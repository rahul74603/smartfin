/**
 * Build-time prerenderer for SmartFintool.
 *
 * WHY THIS EXISTS
 * ---------------
 * The site was a pure client-side Vite SPA. Every URL — /, /swp, /lumpsum,
 * /blog/* — served the exact same index.html containing an empty <div id="root">
 * and one homepage <title>. Googlebot's first pass indexes raw HTML; rendering
 * happens later in a separate, heavily rate-limited queue. So Google saw ~20
 * URLs that were byte-for-byte identical, deduplicated them down to one, and
 * left the rest as "Crawled - currently not indexed".
 *
 * This script runs after `vite build`, renders every route to real HTML with
 * React's server renderer, injects the correct per-route title / description /
 * canonical / Open Graph / JSON-LD, and writes a static file per URL. Googlebot
 * now gets fully-formed, unique HTML on the very first request — no JS
 * execution required to see the content.
 *
 * Output: dist/index.html, dist/swp/index.html, dist/blog/<slug>/index.html …
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');
const ssrEntry = path.join(root, 'dist-ssr', 'entry-server.js');

const BASE_URL = 'https://smartfintool.com';

// ── Load the compiled SSR bundle ────────────────────────────────────────────
const { render } = await import(pathToFileURL(ssrEntry).href);
const { seoByRoute } = await import(pathToFileURL(ssrEntry).href).then((m) => m);

// Route metadata is re-exported by the SSR entry so we never duplicate copy.
const { routeSeo, blogSeo } = await import(pathToFileURL(ssrEntry).href).then(
  (m) => m.getSeoTables()
);

const template = await fs.readFile(path.join(distDir, 'index.html'), 'utf8');

// ── Helpers ─────────────────────────────────────────────────────────────────
const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Replace a <meta name="..."> value, inserting the tag if it is absent. */
const upsertMetaName = (html, name, content) => {
  const re = new RegExp(`(<meta\\s+name="${name}"\\s+content=")[^"]*(")`, 'i');
  if (re.test(html)) return html.replace(re, `$1${esc(content)}$2`);
  return html.replace('</head>', `    <meta name="${name}" content="${esc(content)}" />\n  </head>`);
};

const upsertMetaProp = (html, prop, content) => {
  const re = new RegExp(`(<meta\\s+property="${prop}"\\s+content=")[^"]*(")`, 'i');
  if (re.test(html)) return html.replace(re, `$1${esc(content)}$2`);
  return html.replace('</head>', `    <meta property="${prop}" content="${esc(content)}" />\n  </head>`);
};

const setTitle = (html, title) =>
  html
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(title)}</title>`)
    .replace(/(<meta\s+name="title"\s+content=")[^"]*(")/i, `$1${esc(title)}$2`);

const setCanonical = (html, href) =>
  html
    .replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/i, `$1${href}$2`)
    .replace(
      /(<link\s+rel="alternate"\s+hreflang="en-IN"\s+href=")[^"]*(")/i,
      `$1${href}$2`
    )
    .replace(
      /(<link\s+rel="alternate"\s+hreflang="x-default"\s+href=")[^"]*(")/i,
      `$1${href}$2`
    );

/**
 * Inject JSON-LD carrying the SAME element ids that App.tsx / BlogDetail.tsx
 * use at runtime.
 *
 * Without matching ids, setJsonLd() would not find the prerendered block on
 * hydration and would append a second one — leaving the rendered DOM with two
 * FAQPage and two BreadcrumbList objects. Google flags duplicated structured
 * data and can suppress the rich result entirely. Matching ids means the
 * runtime call updates the existing tag in place.
 */
const injectJsonLd = (html, entries) => {
  const blocks = entries
    .map(
      ({ id, data }) =>
        `    <script type="application/ld+json" id="${id}">${JSON.stringify(data)}</script>`
    )
    .join('\n');
  return html.replace('</head>', `${blocks}\n  </head>`);
};

// ── Build the route list ────────────────────────────────────────────────────
const staticRoutes = [
  { url: '/', key: 'sip' },
  { url: '/swp', key: 'swp' },
  { url: '/lumpsum', key: 'lumpsum' },
  { url: '/compound', key: 'compound' },
  { url: '/simple', key: 'simple' },
  // Standalone high-intent tools.
  { url: '/emi', key: 'emi' },
  { url: '/income-tax', key: 'income-tax' },
  { url: '/ppf', key: 'ppf' },
  { url: '/fd', key: 'fd' },
  { url: '/goal-sip', key: 'goal-sip' },
  { url: '/resources', key: 'resources' },
  { url: '/comparisons', key: 'comparisons' },
  { url: '/about', key: 'about' },
  { url: '/privacy-policy', key: 'privacy-policy' },
  { url: '/terms', key: 'terms' },
  { url: '/disclaimer', key: 'disclaimer' },
];

const blogRoutes = blogSeo.map((p) => ({ url: `/blog/${p.id}`, blog: p }));
const allRoutes = [...staticRoutes, ...blogRoutes];

const calculatorKeys = new Set([
  'sip', 'swp', 'lumpsum', 'compound', 'simple',
  'emi', 'income-tax', 'ppf', 'fd', 'goal-sip',
]);

const breadcrumbLabels = {
  swp: 'SWP Calculator',
  emi: 'EMI Calculator',
  'income-tax': 'Income Tax Calculator',
  ppf: 'PPF Calculator',
  fd: 'FD & RD Calculator',
  'goal-sip': 'Goal SIP Planner',
  lumpsum: 'Lumpsum Calculator',
  compound: 'Compound Interest Calculator',
  simple: 'Simple Interest Calculator',
  resources: 'Financial Resources',
  comparisons: 'Investment Comparisons',
  about: 'About Us',
  'privacy-policy': 'Privacy Policy',
  terms: 'Terms of Service',
  disclaimer: 'Financial Disclaimer',
};

const today = new Date().toISOString().split('T')[0];
const written = [];

// ── Render each route ───────────────────────────────────────────────────────
for (const route of allRoutes) {
  const { url } = route;

  let appHtml = '';
  try {
    appHtml = render(url);
  } catch (err) {
    console.error(`  ✗ ${url} — render failed: ${err.message}`);
    continue;
  }

  const canonical = url === '/' ? `${BASE_URL}/` : `${BASE_URL}${url}`;

  let title;
  let description;
  let keywords;
  const jsonLd = [];

  if (route.blog) {
    const p = route.blog;
    title = `${p.seoTitle ?? p.title} | SmartFintool`;
    description = p.description;
    keywords = p.seoKeywords.join(', ');

    jsonLd.push({ id: 'sft-article', data: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: p.title.slice(0, 110),
      description: p.description,
      image: `${BASE_URL}/og-image.png`,
      datePublished: p.publishDate,
      dateModified: p.publishDate,
      inLanguage: 'en-IN',
      articleSection: p.category,
      keywords,
      timeRequired: `PT${p.readTime}M`,
      author: {
        '@type': 'Person',
        name: p.author,
        jobTitle: p.authorTitle,
        url: `${BASE_URL}/about`,
      },
      publisher: {
        '@type': 'Organization',
        name: 'SmartFintool',
        url: BASE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${BASE_URL}/logo192.png`,
          width: 192,
          height: 192,
        },
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    } });

    if (p.faqs?.length) {
      jsonLd.push({ id: 'sft-article-faq', data: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: p.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      } });
    }

    jsonLd.push({ id: 'sft-article-breadcrumb', data: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Resources', item: `${BASE_URL}/resources` },
        { '@type': 'ListItem', position: 3, name: p.title, item: canonical },
      ],
    } });
  } else {
    const seo = routeSeo[route.key];
    if (!seo) {
      console.warn(`  ! ${url} — no SEO entry for key "${route.key}", skipping meta`);
      continue;
    }
    title = seo.title;
    description = seo.description;
    keywords = seo.keywords;

    const isCalc = calculatorKeys.has(route.key);

    jsonLd.push({ id: 'sft-webpage', data: {
      '@context': 'https://schema.org',
      '@type': isCalc ? 'WebApplication' : 'WebPage',
      name: title,
      description,
      url: canonical,
      inLanguage: 'en-IN',
      ...(isCalc && {
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web Browser',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
      }),
      isPartOf: { '@type': 'WebSite', name: 'SmartFintool', url: BASE_URL },
      publisher: {
        '@type': 'Organization',
        name: 'SmartFintool',
        url: BASE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${BASE_URL}/logo192.png`,
          width: 192,
          height: 192,
        },
      },
      // YMYL/E-E-A-T: state who produced and last checked the figures.
      author: { '@type': 'Person', name: 'Rahul Kumar', url: `${BASE_URL}/about` },
      reviewedBy: { '@type': 'Person', name: 'Rahul Kumar', url: `${BASE_URL}/about` },
      dateModified: today,
      lastReviewed: today,
      ...(isCalc && {
        isAccessibleForFree: true,
        creator: { '@type': 'Organization', name: 'SmartFintool', url: BASE_URL },
      }),
    } });

    if (seo.faqs?.length) {
      jsonLd.push({ id: 'sft-faq', data: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: seo.faqs.map((f) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        })),
      } });
    }

    const crumbs = [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` }];
    if (route.key !== 'sip') {
      crumbs.push({
        '@type': 'ListItem',
        position: 2,
        name: breadcrumbLabels[route.key] ?? route.key,
        item: canonical,
      });
    }
    jsonLd.push({ id: 'sft-breadcrumb', data: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: crumbs,
    } });

    // App.tsx emits Organization + WebSite(SearchAction) on the homepage only.
    // Reserve those ids here so hydration updates rather than appends. The
    // global @graph in index.html already declares both, so we point at the
    // same @id values to keep it one entity instead of three competing copies.
    if (route.key === 'sip') {
      jsonLd.push({ id: 'sft-organization', data: {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${BASE_URL}/#organization`,
        name: 'SmartFintool',
        url: BASE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${BASE_URL}/logo192.png`,
          width: 192,
          height: 192,
        },
        foundingDate: '2024',
        founder: { '@type': 'Person', name: 'Rahul Kumar' },
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'help@smartfintool.com',
          contactType: 'customer support',
          availableLanguage: ['English', 'Hindi'],
        },
        areaServed: { '@type': 'Country', name: 'India' },
        sameAs: ['https://twitter.com/smartfintool'],
        description:
          'SmartFintool is India free financial calculator platform offering SIP, SWP, Lumpsum, Compound Interest and Simple Interest calculators.',
      } });

      jsonLd.push({ id: 'sft-sitelinks', data: {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        name: 'SmartFintool',
        url: BASE_URL,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${BASE_URL}/?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      } });
    }
  }

  // ── Assemble the document ────────────────────────────────────────────────
  let html = template;

  html = setTitle(html, title);
  html = upsertMetaName(html, 'description', description);
  html = upsertMetaName(html, 'keywords', keywords);
  html = setCanonical(html, canonical);

  html = upsertMetaProp(html, 'og:title', title);
  html = upsertMetaProp(html, 'og:description', description);
  html = upsertMetaProp(html, 'og:url', canonical);
  html = upsertMetaProp(html, 'og:type', route.blog ? 'article' : 'website');
  html = upsertMetaName(html, 'twitter:title', title);
  html = upsertMetaName(html, 'twitter:description', description);
  html = upsertMetaName(html, 'twitter:url', canonical);

  html = injectJsonLd(html, jsonLd);

  // Swap the loading spinner for the real, crawlable markup.
  html = html.replace(
    /<div id="root">[\s\S]*?<\/div>\n\s*<\/div>\s*<\/div>/,
    `<div id="root" data-prerendered="true">${appHtml}</div>`
  );
  if (!html.includes('data-prerendered')) {
    // Fallback if the spinner markup shape ever changes.
    html = html.replace(
      /<div id="root">[\s\S]*?<\/div>(?=\s*<!-- SEO Fallback)/,
      `<div id="root" data-prerendered="true">${appHtml}</div>`
    );
  }

  // The <noscript> block duplicated the H1 and nav on every single page, which
  // reads as boilerplate to Google. Prerendered HTML makes it redundant.
  html = html.replace(/<noscript>[\s\S]*?<\/noscript>\s*/i, '');

  // ── Write ────────────────────────────────────────────────────────────────
  const outPath =
    url === '/'
      ? path.join(distDir, 'index.html')
      : path.join(distDir, url.slice(1), 'index.html');

  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, html, 'utf8');

  written.push({ url, bytes: html.length, out: path.relative(distDir, outPath) });
  console.log(`  ✓ ${url.padEnd(34)} → ${path.relative(distDir, outPath)}`);
}

// ── 404 page (noindex) ──────────────────────────────────────────────────────
{
  let html = template;
  html = setTitle(html, '404 Page Not Found | SmartFintool');
  html = upsertMetaName(
    html,
    'description',
    'Page not found. Browse free SIP, SWP, Lumpsum and interest calculators on SmartFintool.'
  );
  html = upsertMetaName(html, 'robots', 'noindex, follow');
  await fs.writeFile(path.join(distDir, '404.html'), html, 'utf8');
  console.log('  ✓ 404.html (noindex)');
}

// ── Regenerate sitemap.xml from the routes we actually rendered ─────────────
const priorityFor = (url) => {
  if (url === '/') return '1.0';
  if (['/swp', '/lumpsum', '/compound', '/emi', '/income-tax'].includes(url)) return '0.9';
  if (['/ppf', '/fd', '/goal-sip'].includes(url)) return '0.85';
  if (url === '/simple') return '0.85';
  if (['/resources', '/comparisons'].includes(url)) return '0.8';
  if (url.startsWith('/blog/')) return '0.7';
  if (url === '/about') return '0.6';
  return '0.3';
};

const changefreqFor = (url) => {
  if (['/privacy-policy', '/terms', '/disclaimer'].includes(url)) return 'yearly';
  if (url === '/about') return 'monthly';
  return 'weekly';
};

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${written
  .map(
    ({ url }) => `  <url>
    <loc>${url === '/' ? `${BASE_URL}/` : `${BASE_URL}${url}`}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreqFor(url)}</changefreq>
    <priority>${priorityFor(url)}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

await fs.writeFile(path.join(distDir, 'sitemap.xml'), sitemap, 'utf8');
await fs.writeFile(path.join(root, 'public', 'sitemap.xml'), sitemap, 'utf8');

console.log(`\n✅ Prerendered ${written.length} routes + 404, sitemap regenerated (${written.length} URLs).`);
