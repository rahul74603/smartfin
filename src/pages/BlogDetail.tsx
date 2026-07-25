import { Link, useLocation, useNavigate } from 'react-router-dom';
import { blogPosts } from '../data/blogData';
import { useEffect } from 'react';
import { ArrowLeft, Clock, CalendarDays, UserRound } from 'lucide-react';
import { BASE_URL } from '../seo/config';

// ─── DOM head helpers ────────────────────────────────────────────────────────
const setMetaByName = (name: string, value: string) => {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
};

const setMetaByProperty = (property: string, value: string) => {
  let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
};

const setCanonical = (href: string) => {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
};

const setJsonLd = (id: string, payload: object) => {
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(payload);
};

export default function BlogDetail() {
  const location = useLocation();
  const navigate = useNavigate();

  const id = location.pathname.split('/blog/')[1]?.replace(/\/$/, '');
  const post = blogPosts.find((p) => p.id === id);

  /**
   * Full head management for article routes.
   *
   * Previously this component only set document.title plus description and
   * keywords — and only if those tags already existed. It never set a
   * canonical, so every /blog/* URL inherited whichever canonical the last
   * visited route left behind (usually https://smartfintool.com/). Google
   * treated all eight articles as duplicates of the homepage and indexed none
   * of them. It also never emitted Article schema.
   */
  useEffect(() => {
    window.scrollTo(0, 0);

    if (!post) {
      document.title = 'Article Not Found | SmartFintool';
      setMetaByName('robots', 'noindex, follow');
      setCanonical(`${BASE_URL}/resources`);
      return;
    }

    const url = `${BASE_URL}/blog/${post.id}`;
    const title = `${post.seoTitle ?? post.title} | SmartFintool`;

    document.title = title;
    setMetaByName('description', post.description);
    setMetaByName('keywords', post.seoKeywords.join(', '));
    setMetaByName('author', post.author);
    setMetaByName(
      'robots',
      'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    );
    setCanonical(url);

    setMetaByProperty('og:type', 'article');
    setMetaByProperty('og:title', title);
    setMetaByProperty('og:description', post.description);
    setMetaByProperty('og:url', url);
    setMetaByProperty('og:image', `${BASE_URL}/og-image.png`);
    setMetaByProperty('article:published_time', post.publishDate);
    setMetaByProperty('article:author', post.author);
    setMetaByProperty('article:section', post.category);

    setMetaByName('twitter:card', 'summary_large_image');
    setMetaByName('twitter:title', title);
    setMetaByName('twitter:description', post.description);
    setMetaByName('twitter:image', `${BASE_URL}/og-image.png`);

    // Article schema — makes the post eligible for rich results.
    setJsonLd('sft-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title.slice(0, 110),
      description: post.description,
      image: `${BASE_URL}/og-image.png`,
      datePublished: post.publishDate,
      dateModified: post.publishDate,
      inLanguage: 'en-IN',
      articleSection: post.category,
      keywords: post.seoKeywords.join(', '),
      wordCount: post.content.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).length,
      timeRequired: `PT${post.readTime}M`,
      author: {
        '@type': 'Person',
        name: post.author,
        jobTitle: post.authorTitle,
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
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    });

    // Article-specific FAQ schema.
    setJsonLd('sft-article-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: post.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    });

    setJsonLd('sft-article-breadcrumb', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Resources', item: `${BASE_URL}/resources` },
        { '@type': 'ListItem', position: 3, name: post.title, item: url },
      ],
    });

    return () => {
      document.getElementById('sft-article')?.remove();
      document.getElementById('sft-article-faq')?.remove();
      document.getElementById('sft-article-breadcrumb')?.remove();
    };
  }, [post]);

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto text-center py-24 px-4">
        <h1 className="text-3xl font-black text-[#0f172a] mb-4">Article Not Found</h1>
        <p className="text-gray-600 mb-8">
          The guide you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/resources"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold"
        >
          Browse all guides
        </Link>
      </div>
    );
  }

  // Related posts drive internal linking, which spreads crawl equity to the
  // deeper article URLs instead of leaving them orphaned.
  const related = blogPosts.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 font-inter">
      {/* Crawlable breadcrumb — the old "back" button used navigate(-1), which
          is invisible to a crawler and leaves the article orphaned. */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <li>
            <Link to="/" className="hover:text-indigo-600 font-medium">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link to="/resources" className="hover:text-indigo-600 font-medium">
              Resources
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-indigo-600 font-semibold line-clamp-1" aria-current="page">
            {post.title}
          </li>
        </ol>
      </nav>

      <button
        onClick={() => navigate('/resources')}
        className="flex items-center gap-2 text-indigo-600 font-bold mb-8 hover:gap-3 transition-all"
      >
        <ArrowLeft className="w-5 h-5" /> Back to Resources
      </button>

      <article className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600" />

        <div className="p-8 sm:p-16 space-y-8">
          <div className="flex flex-wrap items-center gap-4">
            <span className="bg-indigo-50 text-indigo-600 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
              {post.category}
            </span>
            <span className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase">
              <Clock className="w-4 h-4" /> {post.readTime} Min Read
            </span>
            <span className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase">
              <CalendarDays className="w-4 h-4" />
              <time dateTime={post.publishDate}>
                {new Date(post.publishDate).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </time>
            </span>
            <span className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase">
              <UserRound className="w-4 h-4" /> {post.author}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#0f172a] leading-tight tracking-tighter">
            {post.title}
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed border-l-4 border-indigo-200 pl-5 italic">
            {post.description}
          </p>

          <div
            className="prose prose-indigo max-w-none text-gray-600 leading-relaxed text-lg"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* FAQ Section for SEO */}
          <section className="mt-16 bg-blue-50 rounded-[2rem] p-8 border border-blue-100">
            <h2 className="text-2xl font-black text-blue-900 mb-6">Article FAQ</h2>
            <div className="space-y-6">
              {post.faqs.map((faq, i) => (
                <div key={i}>
                  <h3 className="font-bold text-[#0f172a] mb-2">{faq.q}</h3>
                  <p className="text-gray-600 text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Internal links to the calculators this guide talks about. */}
          <section className="rounded-[2rem] bg-[#0f172a] text-white p-8">
            <h2 className="text-xl font-black mb-2">Run the numbers yourself</h2>
            <p className="text-slate-400 text-sm mb-6">
              Use the free SmartFintool calculators to apply this guide to your own money.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { to: '/', label: 'SIP Calculator' },
                { to: '/swp', label: 'SWP Calculator' },
                { to: '/lumpsum', label: 'Lumpsum Calculator' },
                { to: '/compound', label: 'Compound Interest Calculator' },
              ].map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm font-bold hover:bg-white/10 transition-all"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </article>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-black text-[#0f172a] mb-6">Related guides</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {related.map((r) => (
              <Link
                key={r.id}
                to={`/blog/${r.id}`}
                className="bg-white rounded-3xl border border-slate-100 shadow-lg p-6 hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-2">
                  {r.category}
                </p>
                <h3 className="font-bold text-[#0f172a] leading-snug line-clamp-3">{r.title}</h3>
                <p className="text-xs text-gray-400 mt-3 font-bold uppercase">
                  {r.readTime} min read
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
