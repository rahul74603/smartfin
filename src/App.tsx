import { Suspense, lazy, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Calculator,
  TrendingUp,
  Wallet,
  PieChart,
  IndianRupee,
  Mail,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  FileText,
  Scale,
  User,
  Lock,
} from 'lucide-react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import './App.css';

import SIPCalculator from './components/SIPCalculator';
import SWPCalculator from './components/SWPCalculator';
import CompoundInterestCalculator from './components/CompoundInterestCalculator';
import SimpleInterestCalculator from './components/SimpleInterestCalculator';
import LumpsumCalculator from './components/LumpsumCalculator';
import EMICalculator from './components/EMICalculator';
import IncomeTaxCalculator from './components/IncomeTaxCalculator';
import PPFCalculator from './components/PPFCalculator';
import FDCalculator from './components/FDCalculator';
import GoalSIPCalculator from './components/GoalSIPCalculator';

import About from './pages/About';
import Disclaimer from './pages/Disclaimer';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
/**
 * Admin panel is lazy-loaded.
 *
 * It is the only consumer of Firebase Auth (94 kB). A static import put that
 * into the shared bundle, so every visitor to a calculator page downloaded the
 * whole auth SDK for a route they will never open. The page is noindex anyway,
 * so there is no SEO cost to code-splitting it.
 */
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
import Resources from './pages/Resources';
import Comparisons from './pages/Comparisons';
import { NotFoundPage } from './components/Pages';
import { ADMIN_SETTINGS_EVENT, loadAdminSettings } from './lib/adminSettings';
import BlogDetail from './pages/BlogDetail';
import {
  BASE_URL,
  breadcrumbLabels,
  calculatorSEOContent,
  seoByRoute,
} from './seo/config';

// ─── Calculator Meta (icon + gradient) ────────────────────────────────────────
const calcMeta: Record<
  string,
  { gradient: string; icon: React.ReactNode; label: string }
> = {
  sip: {
    gradient: 'from-blue-500 to-indigo-700',
    icon: <TrendingUp className="w-7 h-7 text-white" />,
    label: 'SIP Calculator',
  },
  swp: {
    gradient: 'from-purple-500 to-fuchsia-700',
    icon: <Wallet className="w-7 h-7 text-white" />,
    label: 'SWP Calculator',
  },
  compound: {
    gradient: 'from-emerald-500 to-teal-700',
    icon: <PieChart className="w-7 h-7 text-white" />,
    label: 'Compound Interest',
  },
  simple: {
    gradient: 'from-rose-500 to-orange-700',
    icon: <Calculator className="w-7 h-7 text-white" />,
    label: 'Simple Interest',
  },
  lumpsum: {
    gradient: 'from-indigo-500 to-blue-800',
    icon: <IndianRupee className="w-7 h-7 text-white" />,
    label: 'Lumpsum Calculator',
  },
};

/**
 * Standalone tools shown in the header and footer.
 *
 * `short` is used in the cramped desktop header, `label` everywhere else.
 * Keeping one table means the header, footer and any future menu cannot drift
 * out of sync.
 */
const TOOL_NAV = [
  { path: '/emi', short: 'EMI', label: 'EMI Calculator' },
  { path: '/income-tax', short: 'Tax', label: 'Income Tax Calculator' },
  { path: '/ppf', short: 'PPF', label: 'PPF Calculator' },
  { path: '/fd', short: 'FD', label: 'FD & RD Calculator' },
  { path: '/goal-sip', short: 'Goal', label: 'Goal SIP Planner' },
];

// ─── Mobile Nav Icons ─────────────────────────────────────────────────────────
const mobileNavIcon: Record<string, React.ReactNode> = {
  sip: <TrendingUp className="w-6 h-6" />,
  swp: <Wallet className="w-6 h-6" />,
  compound: <PieChart className="w-6 h-6" />,
  simple: <Calculator className="w-6 h-6" />,
  lumpsum: <IndianRupee className="w-6 h-6" />,
};

// ─── SEO Data Per Route ───────────────────────────────────────────────────────

// ─── DOM SEO Helpers ──────────────────────────────────────────────────────────
const setMetaByName = (name: string, value: string) => {
  let el = document.querySelector(
    `meta[name="${name}"]`
  ) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
};

const setMetaByProperty = (property: string, value: string) => {
  let el = document.querySelector(
    `meta[property="${property}"]`
  ) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
};

const setCanonical = (href: string) => {
  let link = document.querySelector(
    'link[rel="canonical"]'
  ) as HTMLLinkElement | null;
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
  script.textContent = JSON.stringify(payload, null, 0);
};

const removeJsonLd = (id: string) => {
  document.getElementById(id)?.remove();
};

// ─── Breadcrumb Labels ────────────────────────────────────────────────────────

// ─── Trust Signals ────────────────────────────────────────────────────────────
const trustSignals = [
  {
    icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
    label: '100% Free',
    sub: 'No registration needed',
  },
  {
    icon: <Calculator className="w-5 h-5 text-blue-500" />,
    label: 'Browser-based',
    sub: 'Your data stays private',
  },
  {
    icon: <TrendingUp className="w-5 h-5 text-purple-500" />,
    label: 'India Focused',
    sub: 'INR and Indian norms',
  },
  {
    icon: <Sparkles className="w-5 h-5 text-amber-500" />,
    label: 'Inflation Aware',
    sub: 'Real value projections',
  },
];

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [adminSettings, setAdminSettings] = useState(() => loadAdminSettings());

  // ── Route Classification ────────────────────────────────────────────────────
  const infoPages = ['about', 'privacy-policy', 'terms', 'disclaimer'];
  const coreCalculators = ['sip', 'swp', 'compound', 'simple', 'lumpsum'];
  /**
   * Standalone tools. These render as their own page (own H1 area, FAQ and
   * related-links cluster) instead of inside the five-tab hero, because each
   * one targets a distinct high-volume query and needs its own long-form copy.
   */
  const toolPages = ['emi', 'income-tax', 'ppf', 'fd', 'goal-sip'];
  const adminPages = ['admin'];
  const contentPages = ['resources', 'comparisons'];
  const allValidPages = [
    ...infoPages,
    ...coreCalculators,
    ...toolPages,
    ...adminPages,
    ...contentPages,
  ];

  const currentPath =
    location.pathname === '/'
      ? 'sip'
      : location.pathname.replace(/^\/|\/$/g, '');

  const isBlogPage = location.pathname.startsWith('/blog/');
  const isInfoPage = infoPages.includes(currentPath);
  const isAdminPage = adminPages.includes(currentPath);
  const isCalculatorPage =
    coreCalculators.includes(currentPath) || location.pathname === '/';
  const isContentPage = contentPages.includes(currentPath);
  const isToolPage = toolPages.includes(currentPath);
  const isValidPath =
    allValidPages.includes(currentPath) ||
    location.pathname === '/' ||
    isBlogPage;

  const activeTab = isCalculatorPage ? currentPath : isBlogPage ? 'resources' : '';
  const seoContent = calculatorSEOContent[activeTab] ?? calculatorSEOContent.sip;

  // ── Navigation ──────────────────────────────────────────────────────────────
  /**
   * Map a calculator id to its canonical path. Used by both the <Link>s and
   * the scroll-to-top side effect.
   */
  const pathForCalculator = (id: string) => (id === 'sip' ? '/' : `/${id}`);

  // ── Scroll Restoration ──────────────────────────────────────────────────────
  // Every nav control is now a real <Link>, so scroll-to-top moves here from
  // the old click handlers. Guarded by typeof window for the SSR prerender.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  // ── Admin Settings Sync ─────────────────────────────────────────────────────
  useEffect(() => {
    const sync = () => setAdminSettings(loadAdminSettings());
    window.addEventListener(ADMIN_SETTINGS_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(ADMIN_SETTINGS_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  // ── SEO Effect ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isBlogPage) return;

    if (!isValidPath) {
      document.title = '404 Page Not Found | SmartFintool';
      setMetaByName(
        'description',
        'Page not found. Visit SmartFintool for free SIP, SWP, Lumpsum and interest calculators India.'
      );
      setMetaByName('robots', 'noindex, follow');
      setCanonical(`${BASE_URL}${location.pathname}`);
      removeJsonLd('sft-webpage');
      removeJsonLd('sft-faq');
      removeJsonLd('sft-breadcrumb');
      removeJsonLd('sft-organization');
      removeJsonLd('sft-sitelinks');
      return;
    }

    const seo = seoByRoute[currentPath] ?? seoByRoute.sip;
    const pageUrl = `${BASE_URL}${seo.canonicalPath}`;

    // ── Primary Meta ────────────────────────────────────────────────────────
    document.title = seo.title;
    setMetaByName('description', seo.description);
    setMetaByName('keywords', seo.keywords);
    setMetaByName(
      'robots',
      isAdminPage
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    );
    setMetaByName('author', adminSettings.brand.founderName);
    setMetaByName('language', 'en-IN');
    setMetaByName('geo.region', 'IN');
    setMetaByName('geo.country', 'India');

    // ── Canonical ───────────────────────────────────────────────────────────
    setCanonical(pageUrl);

    // ── Open Graph ──────────────────────────────────────────────────────────
    setMetaByProperty('og:type', 'website');
    setMetaByProperty('og:site_name', adminSettings.brand.siteName);
    setMetaByProperty('og:title', seo.title);
    setMetaByProperty('og:description', seo.description);
    setMetaByProperty('og:url', pageUrl);
    setMetaByProperty('og:image', `${BASE_URL}/og-image.png`);
    setMetaByProperty('og:image:width', '1200');
    setMetaByProperty('og:image:height', '630');
    setMetaByProperty(
      'og:image:alt',
      `${adminSettings.brand.siteName} – Financial Calculator India`
    );
    setMetaByProperty('og:locale', 'en_IN');

    // ── Twitter Card ────────────────────────────────────────────────────────
    setMetaByName('twitter:card', 'summary_large_image');
    setMetaByName('twitter:site', '@smartfintool');
    setMetaByName('twitter:creator', '@smartfintool');
    setMetaByName('twitter:title', seo.title);
    setMetaByName('twitter:description', seo.description);
    setMetaByName('twitter:image', `${BASE_URL}/og-image.png`);
    setMetaByName(
      'twitter:image:alt',
      `${adminSettings.brand.siteName} Calculator`
    );

    // ── Schema: WebPage / WebApplication ───────────────────────────────────
    setJsonLd('sft-webpage', {
      '@context': 'https://schema.org',
      '@type': isCalculatorPage ? 'WebApplication' : 'WebPage',
      name: seo.title,
      description: seo.description,
      url: pageUrl,
      inLanguage: 'en-IN',
      ...(isCalculatorPage && {
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web Browser',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
      }),
      isPartOf: {
        '@type': 'WebSite',
        name: adminSettings.brand.siteName,
        url: BASE_URL,
      },
      publisher: {
        '@type': 'Organization',
        name: adminSettings.brand.siteName,
        url: BASE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${BASE_URL}/logo192.png`,
          width: 192,
          height: 192,
        },
      },
      dateModified: new Date().toISOString().split('T')[0],
    });

    // ── Schema: FAQPage (SINGLE SOURCE - no duplicates) ─────────────────────
    setJsonLd('sft-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: seo.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    });

    // ── Schema: BreadcrumbList ──────────────────────────────────────────────
    const breadcrumbItems: object[] = [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
    ];
    if (currentPath !== 'sip') {
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 2,
        name: breadcrumbLabels[currentPath] ?? currentPath,
        item: pageUrl,
      });
    }
    setJsonLd('sft-breadcrumb', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems,
    });

    // ── Schema: Organization + SiteLinks (homepage only) ───────────────────
    if (currentPath === 'sip') {
      setJsonLd('sft-organization', {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: adminSettings.brand.siteName,
        url: BASE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${BASE_URL}/logo192.png`,
          width: 192,
          height: 192,
        },
        foundingDate: '2024',
        founder: { '@type': 'Person', name: adminSettings.brand.founderName },
        contactPoint: {
          '@type': 'ContactPoint',
          email: adminSettings.brand.supportEmail,
          contactType: 'customer support',
          availableLanguage: ['English', 'Hindi'],
        },
        areaServed: { '@type': 'Country', name: 'India' },
        sameAs: ['https://twitter.com/smartfintool'],
        description:
          'SmartFintool is India free financial calculator platform offering SIP, SWP, Lumpsum, Compound Interest and Simple Interest calculators.',
      });

      setJsonLd('sft-sitelinks', {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: adminSettings.brand.siteName,
        url: BASE_URL,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${BASE_URL}/?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      });
    } else {
      removeJsonLd('sft-organization');
      removeJsonLd('sft-sitelinks');
    }
  }, [
    adminSettings.brand.founderName,
    adminSettings.brand.siteName,
    adminSettings.brand.supportEmail,
    currentPath,
    isAdminPage,
    isBlogPage,
    isCalculatorPage,
    isValidPath,
    location.pathname,
  ]);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 md:pb-0 font-inter text-[#0f172a]">

      {/* ══ HEADER ═══════════════════════════════════════════════════════════ */}
      <header className="bg-[#0f172a] text-white sticky top-0 z-50 border-b border-white/5 shadow-2xl backdrop-blur-md bg-opacity-95">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">

          {/* Logo – using span not h1 to preserve h1 for page content */}
          <Link
            to="/"
            className="flex items-center gap-3 cursor-pointer group"
            aria-label="SmartFintool home"
          >
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-2xl group-hover:rotate-12 transition-transform shadow-lg shadow-blue-500/20">
              <Calculator className="w-8 h-8 md:w-7 md:h-7 text-white" />
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl md:text-2xl font-black leading-tight tracking-tighter">
                {adminSettings.brand.siteName}
              </span>
              <span className="block text-[11px] sm:text-[12px] md:text-[10px] text-blue-400 font-black uppercase tracking-[0.2em]">
                {adminSettings.brand.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav
            className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10"
            aria-label="Main navigation"
          >
            {coreCalculators.map((id) => (
              <Link
                key={id}
                to={pathForCalculator(id)}
                aria-label={`Open ${calcMeta[id].label}`}
                aria-current={activeTab === id ? 'page' : undefined}
                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === id
                    ? 'bg-blue-600 text-white shadow-xl scale-105'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {id}
              </Link>
            ))}
            <div className="border-l border-white/10 ml-2 pl-2 flex gap-1">
              <Link
                to="/resources"
                aria-current={currentPath === 'resources' ? 'page' : undefined}
                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  currentPath === 'resources'
                    ? 'bg-blue-600 text-white shadow-xl scale-105'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Resources
              </Link>
              <Link
                to="/comparisons"
                aria-current={currentPath === 'comparisons' ? 'page' : undefined}
                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  currentPath === 'comparisons'
                    ? 'bg-blue-600 text-white shadow-xl scale-105'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Compare
              </Link>
            </div>
            {/* High-intent tools get their own header group so they are one
                click (and one crawl hop) from every page on the site. */}
            <div className="border-l border-white/10 ml-2 pl-2 flex gap-1">
              {TOOL_NAV.map((t) => (
                <Link
                  key={t.path}
                  to={t.path}
                  aria-current={currentPath === t.path.slice(1) ? 'page' : undefined}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    currentPath === t.path.slice(1)
                      ? 'bg-emerald-600 text-white shadow-xl scale-105'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {t.short}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </header>

      {/* ══ MAIN ═════════════════════════════════════════════════════════════ */}
      <main id="main-content" className="container mx-auto px-4 py-8">

        {/* 404 */}
        {!isValidPath ? (
          <div className="py-12">
            <NotFoundPage goHome={() => navigate('/')} />
          </div>

        /* Info pages */
        ) : isInfoPage ? (
          <div className="max-w-5xl mx-auto py-12">
            {currentPath === 'about' && <About />}
            {currentPath === 'privacy-policy' && <Privacy />}
            {currentPath === 'terms' && <Terms />}
            {currentPath === 'disclaimer' && <Disclaimer />}
          </div>

        /* Admin */
        ) : isAdminPage ? (
          <div className="max-w-6xl mx-auto">
            <Suspense
              fallback={
                <div className="py-24 text-center text-sm font-bold text-slate-400">
                  Loading admin…
                </div>
              }
            >
              <AdminPanel />
            </Suspense>
          </div>

        /* Standalone tools */
        ) : isToolPage ? (
          <div className="py-10">
            {currentPath === 'emi' && <EMICalculator />}
            {currentPath === 'income-tax' && <IncomeTaxCalculator />}
            {currentPath === 'ppf' && <PPFCalculator />}
            {currentPath === 'fd' && <FDCalculator />}
            {currentPath === 'goal-sip' && <GoalSIPCalculator />}
          </div>

        /* Content pages */
        ) : isContentPage ? (
          <div className="py-12">
            {currentPath === 'resources' && <Resources />}
            {currentPath === 'comparisons' && <Comparisons />}
          </div>

        /* Blog detail */
        ) : isBlogPage ? (
          <BlogDetail />

        /* ── Calculator Pages ── */
        ) : (
          <>
            {/* Hero */}
            <section
              className="relative overflow-hidden bg-[#0f172a] text-white py-16 sm:py-24 rounded-[3.5rem] mb-16 shadow-2xl border border-white/5"
              aria-label="Financial calculator selection"
            >
              <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

              <div className="container mx-auto px-4 relative z-10 text-center">
                <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full px-6 py-2 mb-8 shadow-inner">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                    Precision Financial Modeling
                  </span>
                </div>

                <h1 className="text-5xl sm:text-8xl font-black mb-8 tracking-tighter leading-[1.1]">
                  {activeTab === 'sip' && 'Free SIP'}
                  {activeTab === 'swp' && 'Free SWP'}
                  {activeTab === 'compound' && 'Compound Interest'}
                  {activeTab === 'simple' && 'Simple Interest'}
                  {activeTab === 'lumpsum' && 'Lumpsum'}
                  {' '}
                  <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                    Calculator India
                  </span>
                </h1>

                <p className="text-lg sm:text-2xl text-gray-400 max-w-3xl mx-auto mb-16 font-medium leading-relaxed">
                  {adminSettings.hero.subtitle}
                </p>

                {/* Calculator Picker */}
                <div className="hidden md:grid grid-cols-5 gap-6 max-w-6xl mx-auto">
                  {coreCalculators.map((id) => {
                    const meta = calcMeta[id];
                    return (
                      <Link
                        key={id}
                        to={pathForCalculator(id)}
                        aria-label={`Switch to ${meta.label}`}
                        aria-current={activeTab === id ? 'page' : undefined}
                        className={`group p-8 rounded-[2.5rem] transition-all border ${
                          activeTab === id
                            ? 'bg-white/10 border-white/20 shadow-2xl scale-110 backdrop-blur-xl ring-2 ring-blue-500/50'
                            : 'bg-[#1e293b]/40 border-white/5 hover:bg-white/5 hover:-translate-y-2'
                        }`}
                      >
                        <div
                          className={`mb-5 inline-flex p-5 rounded-3xl bg-gradient-to-br shadow-2xl transition-transform group-hover:scale-110 ${meta.gradient}`}
                        >
                          {meta.icon}
                        </div>
                        <span className="block text-[11px] font-black uppercase tracking-[0.2em] text-white">
                          {id}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Calculator Tabs */}
            <div className="max-w-[1400px] mx-auto">
              <Tabs value={activeTab} className="space-y-12">
                <TabsContent
                  value="sip"
                  className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-700"
                >
                  <SIPCalculator />
                </TabsContent>
                <TabsContent
                  value="swp"
                  className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-700"
                >
                  <SWPCalculator />
                </TabsContent>
                <TabsContent
                  value="compound"
                  className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-700"
                >
                  <CompoundInterestCalculator />
                </TabsContent>
                <TabsContent
                  value="simple"
                  className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-700"
                >
                  <SimpleInterestCalculator />
                </TabsContent>
                <TabsContent
                  value="lumpsum"
                  className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-700"
                >
                  <LumpsumCalculator />
                </TabsContent>
              </Tabs>
            </div>

            {/* SEO Content Section */}
            <section
              className="max-w-6xl mx-auto mt-20 rounded-[2.5rem] bg-white shadow-2xl border border-slate-100 p-8 sm:p-12 space-y-8"
              aria-labelledby="seo-heading"
            >
              <header>
                <h2
                  id="seo-heading"
                  className="text-2xl sm:text-4xl font-black text-[#0f172a]"
                >
                  {seoContent.heading}
                </h2>
                <p className="text-blue-600 font-bold mt-2 text-base sm:text-lg">
                  {seoContent.subheading}
                </p>
              </header>

              {seoContent.paragraphs.map((text, idx) => (
                <p
                  key={idx}
                  className="text-gray-700 leading-relaxed text-base sm:text-lg"
                >
                  {text}
                </p>
              ))}

              {/* FAQ */}
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-black text-blue-900 mb-5">
                  Frequently Asked Questions
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {seoContent.faqs.map((faq) => (
                    <article
                      key={faq.question}
                      className="rounded-xl bg-white border border-blue-100 p-4 space-y-2"
                    >
                      <h4 className="font-bold text-slate-900">{faq.question}</h4>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </article>
                  ))}
                </div>
              </div>

              {/* Trust Signals */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                {trustSignals.map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-50 border border-slate-100"
                  >
                    <div className="mb-2">{item.icon}</div>
                    <span className="font-black text-sm text-slate-800">
                      {item.label}
                    </span>
                    <span className="text-xs text-slate-500 mt-1">
                      {item.sub}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      {/* ══ FOOTER ═══════════════════════════════════════════════════════════ */}
      <footer
        className="bg-[#0f172a] text-white pt-24 pb-12 border-t border-white/5 relative overflow-hidden"
        aria-label="Site footer"
      >
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500" />
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-16 mb-20">

            {/* Brand */}
            <div className="space-y-6 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-3">
                <div className="bg-blue-600 p-2.5 rounded-2xl shadow-xl shadow-blue-600/20">
                  <Calculator className="w-6 h-6" />
                </div>
                <span className="text-3xl font-black tracking-tighter">
                  {adminSettings.brand.siteName}
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed font-medium">
                India focused free financial planning toolkit with SIP, SWP,
                Lumpsum, Compound and Simple Interest calculators for smart
                wealth building.
              </p>
            </div>

            {/* Calculators */}
            <div className="text-center sm:text-left">
              <h3 className="font-black mb-8 text-blue-400 uppercase tracking-[0.3em] text-[10px]">
                Calculators
              </h3>
              <ul className="space-y-4 text-sm font-bold text-gray-400">
                {coreCalculators.map((id) => (
                  <li key={id}>
                    <Link
                      to={pathForCalculator(id)}
                      className="hover:text-blue-400 transition-colors uppercase tracking-widest text-[11px]"
                    >
                      {id} Calculator
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tools */}
            <div className="text-center sm:text-left">
              <h3 className="font-black mb-8 text-blue-400 uppercase tracking-[0.3em] text-[10px]">
                Planning Tools
              </h3>
              <ul className="space-y-4 text-sm font-bold text-gray-400 mb-10">
                {TOOL_NAV.map((t) => (
                  <li key={t.path}>
                    <Link
                      to={t.path}
                      className="hover:text-blue-400 transition-colors uppercase tracking-widest text-[11px]"
                    >
                      {t.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <h3 className="font-black mb-8 text-blue-400 uppercase tracking-[0.3em] text-[10px]">
                Learn & Compare
              </h3>
              <ul className="space-y-4 text-sm font-bold text-gray-400">
                <li>
                  <Link
                    to="/resources"
                    className="hover:text-blue-400 flex items-center justify-center sm:justify-start gap-3 uppercase tracking-widest text-[11px]"
                  >
                    <FileText className="w-4 h-4 text-blue-500" />
                    Resources & Blog
                  </Link>
                </li>
                <li>
                  <Link
                    to="/comparisons"
                    className="hover:text-blue-400 flex items-center justify-center sm:justify-start gap-3 uppercase tracking-widest text-[11px]"
                  >
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    Strategy Comparisons
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="text-center sm:text-left">
              <h3 className="font-black mb-8 text-blue-400 uppercase tracking-[0.3em] text-[10px]">
                Legal & Info
              </h3>
              <ul className="space-y-4 text-sm font-bold text-gray-400">
                {[
                  { path: '/about', icon: <User className="w-4 h-4 text-blue-500" />, label: 'About Us' },
                  { path: '/privacy-policy', icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />, label: 'Privacy Policy' },
                  { path: '/terms', icon: <FileText className="w-4 h-4 text-purple-500" />, label: 'Terms of Service' },
                  { path: '/disclaimer', icon: <Scale className="w-4 h-4 text-rose-500" />, label: 'Disclaimer' },
                  { path: '/admin', icon: <Lock className="w-4 h-4 text-amber-400" />, label: 'Admin' },
                ].map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      rel={link.path === '/admin' ? 'nofollow' : undefined}
                      className="hover:text-white flex items-center justify-center sm:justify-start gap-3"
                    >
                      {link.icon} {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Founder */}
            <div className="text-center sm:text-left">
              <h3 className="font-black mb-8 text-blue-400 uppercase tracking-[0.3em] text-[10px]">
                Founder
              </h3>
              <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 shadow-inner">
                <p className="text-white font-black mb-3 uppercase text-xs tracking-wider">
                  {adminSettings.brand.founderName}
                </p>
                <a
                  href={`mailto:${adminSettings.brand.supportEmail}`}
                  className="text-gray-400 text-[10px] flex items-center justify-center sm:justify-start gap-3 hover:text-blue-400 transition-all uppercase tracking-[0.2em] font-black italic"
                >
                  <Mail className="w-4 h-4" />
                  {adminSettings.brand.supportEmail}
                </a>
              </div>
            </div>
          </div>

          {/* Risk Disclaimer */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-[2.5rem] p-8 mb-16 max-w-5xl mx-auto backdrop-blur-md">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center sm:text-left">
              <div className="bg-red-500/20 p-3 rounded-2xl flex-shrink-0">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-xs text-gray-400 font-bold italic leading-relaxed">
                {adminSettings.legal.riskDisclaimer}
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-gray-600 text-[10px] font-black uppercase tracking-[0.4em] pb-8">
            {new Date().getFullYear()}{' '}
            {adminSettings.brand.siteName.toUpperCase()} INDIA | ALL RIGHTS
            RESERVED
          </div>
        </div>
      </footer>

      {/* ══ MOBILE BOTTOM NAV ════════════════════════════════════════════════ */}
      {isCalculatorPage && (
        <nav
          className="lg:hidden fixed bottom-6 left-6 right-6 bg-[#0f172a] border border-white/10 flex justify-around items-center px-4 py-4 z-50 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl bg-opacity-95 ring-1 ring-white/10"
          aria-label="Mobile calculator navigation"
        >
          {coreCalculators.map((id) => (
            <Link
              key={id}
              to={pathForCalculator(id)}
              aria-label={calcMeta[id].label}
              aria-current={activeTab === id ? 'page' : undefined}
              className={`flex flex-col items-center p-3 rounded-2xl transition-all ${
                activeTab === id
                  ? 'bg-blue-600 text-white scale-110 shadow-2xl shadow-blue-600/40'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              {mobileNavIcon[id]}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}

export default App;