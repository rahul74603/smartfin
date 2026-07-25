import { useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  TrendingUp,
  Zap,
  Brain,
  Target,
  Award,
  Shield,
  Calculator,
  Clock,
  Search,
  CheckCircle2,
  Sparkles,
  IndianRupee,
  Wallet,
  PieChart,
} from 'lucide-react';

// NOTE: All SEO (title, meta, canonical, FAQPage schema, BreadcrumbList schema)
// is handled GLOBALLY in App.tsx to avoid duplicates.
// This page is a LIST/HUB page - individual article schemas are added in BlogDetail.tsx

interface BlogPost {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: number;
  icon: ReactNode;
  keyTopics: string[];
  seoKeywords: string[];
  primaryKeyword: string;
  updatedAt: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 'sip-vs-lumpsum',
    title: 'SIP vs Lumpsum: Which Investment Strategy Is Best For You?',
    description:
      'Complete comparison between SIP and lumpsum investments for Indian investors. Learn which strategy works best for long-term mutual fund goals, volatile markets, and risk management.',
    category: 'Investment Strategy',
    readTime: 8,
    icon: <TrendingUp className="w-6 h-6" />,
    keyTopics: [
      'SIP advantages',
      'Lumpsum strategy',
      'Market timing',
      'Risk management',
      'Returns comparison',
    ],
    seoKeywords: [
      'SIP vs lumpsum',
      'which is better SIP or lumpsum',
      'lumpsum vs sip returns',
      'mutual fund investment strategy',
    ],
    primaryKeyword: 'SIP vs Lumpsum',
    updatedAt: '2026',
  },
  {
    id: 'retirement-planning-guide',
    title: 'Retirement Planning Guide 2026: Calculate Your Retirement Corpus',
    description:
      'Step-by-step retirement planning guide for India. Learn how to calculate retirement corpus, use SWP for monthly income, and protect your lifestyle from inflation.',
    category: 'Financial Planning',
    readTime: 10,
    icon: <Award className="w-6 h-6" />,
    keyTopics: [
      'Retirement corpus',
      'SWP strategy',
      'Inflation adjustment',
      'Lifestyle planning',
      'Tax optimization',
    ],
    seoKeywords: [
      'retirement planning india',
      'retirement corpus calculator',
      'how much to save for retirement',
      'retirement withdrawal planning',
    ],
    primaryKeyword: 'Retirement Planning India',
    updatedAt: '2026',
  },
  {
    id: 'power-of-compounding',
    title: 'The Power of Compounding: How to Build Wealth Over Time',
    description:
      'Understand the power of compounding with practical Indian investment examples. Learn how time, return rate, and compounding frequency can grow wealth exponentially.',
    category: 'Financial Education',
    readTime: 7,
    icon: <Zap className="w-6 h-6" />,
    keyTopics: [
      'Compound interest',
      'Exponential growth',
      'Time factor',
      'Compounding frequency',
      'Real-world examples',
    ],
    seoKeywords: [
      'the power of compounding',
      'compound interest growth',
      'compounding miracle',
      'how to use compounding in investments',
    ],
    primaryKeyword: 'Power of Compounding',
    updatedAt: '2026',
  },
  {
    id: 'financial-goal-setting',
    title: 'Financial Goal Setting: 5-Step Framework For Smart Investments',
    description:
      'Create realistic financial goals using a simple 5-step framework. Learn SMART goal setting, investment timeline planning, risk assessment, and regular review methods.',
    category: 'Financial Planning',
    readTime: 9,
    icon: <Target className="w-6 h-6" />,
    keyTopics: [
      'Goal setting',
      'SMART goals',
      'Timeline planning',
      'Risk assessment',
      'Regular monitoring',
    ],
    seoKeywords: [
      'financial goal setting',
      'investment goals planning',
      'how to set financial goals',
      'financial planning steps',
    ],
    primaryKeyword: 'Financial Goal Setting',
    updatedAt: '2026',
  },
  {
    id: 'inflation-impact-investments',
    title: 'How Inflation Destroys Your Wealth: Inflation-Adjusted Planning',
    description:
      'Learn how inflation reduces purchasing power and why nominal returns are not enough. Understand real returns, inflation-adjusted wealth, and protection strategies.',
    category: 'Investment Education',
    readTime: 8,
    icon: <Brain className="w-6 h-6" />,
    keyTopics: [
      'Inflation impact',
      'Real returns',
      'Purchasing power',
      'Inflation-adjusted wealth',
      'Protection strategies',
    ],
    seoKeywords: [
      'inflation impact on investments',
      'inflation adjusted returns',
      'real vs nominal returns',
      'planning for inflation india',
    ],
    primaryKeyword: 'Inflation Adjusted Returns',
    updatedAt: '2026',
  },
  {
    id: 'mutual-fund-guide',
    title: "Mutual Fund Beginner's Guide: From Zero To Investment Pro",
    description:
      'Complete mutual fund guide for beginners in India. Learn fund types, SIP setup, fund selection, taxation, risk profile, and performance tracking.',
    category: 'Mutual Funds',
    readTime: 12,
    icon: <BookOpen className="w-6 h-6" />,
    keyTopics: [
      'Mutual fund types',
      'Fund selection',
      'SIP setup',
      'Performance tracking',
      'Tax planning',
    ],
    seoKeywords: [
      'mutual funds for beginners',
      'how to invest in mutual funds',
      'mutual fund guide india',
      'sip mutual funds',
    ],
    primaryKeyword: 'Mutual Fund Guide India',
    updatedAt: '2026',
  },
  {
    id: 'emergency-fund-planning',
    title: 'Emergency Fund: How Much You Really Need + Planning Guide',
    description:
      'Calculate your emergency fund requirement based on monthly expenses, income stability, dependents, and risk profile. Learn where to keep emergency savings.',
    category: 'Financial Planning',
    readTime: 7,
    icon: <Shield className="w-6 h-6" />,
    keyTopics: [
      'Emergency fund amount',
      'Monthly expenses',
      'Job stability',
      'Build strategy',
      'Investment options',
    ],
    seoKeywords: [
      'emergency fund calculator',
      'how much emergency fund needed',
      'emergency fund india',
      'emergency savings',
    ],
    primaryKeyword: 'Emergency Fund India',
    updatedAt: '2026',
  },
  {
    id: 'investment-calculator-guide',
    title: 'Complete Calculator Guide: When To Use SIP, SWP, Lumpsum',
    description:
      'Learn when to use SIP calculator, SWP calculator, lumpsum calculator, compound interest calculator, and simple interest calculator for financial planning.',
    category: 'Tools Guide',
    readTime: 11,
    icon: <Calculator className="w-6 h-6" />,
    keyTopics: [
      'Calculator usage',
      'Input parameters',
      'Result interpretation',
      'Investment scenarios',
      'Decision making',
    ],
    seoKeywords: [
      'investment calculator',
      'sip calculator guide',
      'financial calculator india',
      'online investment calculator',
    ],
    primaryKeyword: 'Investment Calculator India',
    updatedAt: '2026',
  },
];

const categories = [
  'All',
  'Investment Strategy',
  'Financial Planning',
  'Financial Education',
  'Investment Education',
  'Mutual Funds',
  'Tools Guide',
];

const calculatorLinks = [
  {
    label: 'SIP Calculator',
    href: '/',
    icon: <TrendingUp className="w-5 h-5 text-blue-600" />,
    text: 'Calculate monthly mutual fund SIP returns and maturity value.',
  },
  {
    label: 'SWP Calculator',
    href: '/swp',
    icon: <Wallet className="w-5 h-5 text-purple-600" />,
    text: 'Plan monthly withdrawal income from your investment corpus.',
  },
  {
    label: 'Lumpsum Calculator',
    href: '/lumpsum',
    icon: <IndianRupee className="w-5 h-5 text-indigo-600" />,
    text: 'Estimate one-time investment growth and real value.',
  },
  {
    label: 'Compound Interest Calculator',
    href: '/compound',
    icon: <PieChart className="w-5 h-5 text-emerald-600" />,
    text: 'Understand power of compounding with different frequencies.',
  },
  {
    label: 'EMI Calculator',
    href: '/emi',
    icon: <Target className="w-5 h-5 text-rose-600" />,
    text: 'Home, car and personal loan EMI with prepayment savings.',
  },
  {
    label: 'Income Tax Calculator',
    href: '/income-tax',
    icon: <Target className="w-5 h-5 text-amber-600" />,
    text: 'Compare new vs old regime for FY 2026-27 instantly.',
  },
  {
    label: 'PPF Calculator',
    href: '/ppf',
    icon: <Target className="w-5 h-5 text-emerald-600" />,
    text: 'Public Provident Fund maturity at the current 7.1% rate.',
  },
  {
    label: 'FD & RD Calculator',
    href: '/fd',
    icon: <Target className="w-5 h-5 text-blue-600" />,
    text: 'Deposit maturity with the post-tax return most tools omit.',
  },
  {
    label: 'Goal SIP Planner',
    href: '/goal-sip',
    icon: <Target className="w-5 h-5 text-purple-600" />,
    text: 'Work backwards from your goal to the monthly SIP required.',
  },
];

const resourceFaqs = [
  {
    q: 'Are SmartFintool financial guides free?',
    a: 'Yes, all SmartFintool financial guides, investment tutorials, calculator explainers, and educational resources are free to read. No paid course or subscription is required.',
  },
  {
    q: 'Which topics are covered in SmartFintool resources?',
    a: 'SmartFintool resources cover SIP investing, SWP withdrawal planning, lumpsum investment, mutual funds, retirement planning, compounding, inflation, emergency fund, and financial goal setting.',
  },
  {
    q: 'Are these guides suitable for beginners?',
    a: 'Yes. The resources are written in simple language for Indian beginners, while still providing practical examples for intermediate investors.',
  },
  {
    q: 'Do SmartFintool guides provide investment advice?',
    a: 'No. SmartFintool provides educational content and calculators only. It is not a SEBI registered investment advisor. Always consult a qualified advisor before investing.',
  },
  {
    q: 'How often are resources updated?',
    a: 'Guides are reviewed and updated regularly with latest financial planning practices, tax rules, and investment examples relevant for Indian users.',
  },
  {
    q: 'Can I share SmartFintool articles?',
    a: 'Yes, you can share article links with friends and family. Republishing or copying full content without permission is not allowed.',
  },
];

export default function Resources() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const categoryMatch =
        activeCategory === 'All' || post.category === activeCategory;

      const search = searchTerm.trim().toLowerCase();

      const searchMatch =
        !search ||
        post.title.toLowerCase().includes(search) ||
        post.description.toLowerCase().includes(search) ||
        post.category.toLowerCase().includes(search) ||
        post.primaryKeyword.toLowerCase().includes(search) ||
        post.seoKeywords.some((keyword) =>
          keyword.toLowerCase().includes(search)
        );

      return categoryMatch && searchMatch;
    });
  }, [activeCategory, searchTerm]);

  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) return;

    setMessage(
      'Thank you! Newsletter feature is coming soon. For now, keep checking SmartFintool resources for latest financial guides.'
    );
    setEmail('');
  };

  return (
    <article className="space-y-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-indigo-900 to-[#0f172a] text-white py-24 sm:py-32 rounded-[3.5rem] shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/3 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[200px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded-full px-4 py-2 mb-4">
              <BookOpen className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-[0.3em]">
                Financial Education Hub India
              </span>
            </div>

            <h1 className="text-5xl sm:text-7xl font-black leading-[1.1] tracking-tighter">
              Financial Blog & <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
                Investment Guides India
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 font-medium leading-relaxed max-w-3xl mx-auto">
              Learn SIP investing, SWP withdrawal planning, mutual funds,
              retirement corpus calculation, compound interest, inflation-adjusted
              returns, and smart financial planning with free practical guides
              built for Indian investors.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <div className="text-sm font-bold text-blue-300 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full" />
                {blogPosts.length}+ Detailed Investment Guides
              </div>
              <div className="text-sm font-bold text-blue-300 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-rose-400 rounded-full" />
                India-Focused Financial Education
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Intro Content */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl p-8 sm:p-12 space-y-6">
          <h2 className="text-2xl sm:text-4xl font-black text-[#0f172a]">
            Free Investment Guides, SIP Tutorials and Financial Planning Articles
          </h2>

          <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
            SmartFintool Resources is created to help Indian users understand
            money, investing, mutual funds, SIP, SWP, lumpsum investing,
            compounding, emergency fund planning and retirement planning in a
            simple practical way. Every guide is written with clear examples so
            you can connect financial concepts with real-life goals.
          </p>

          <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
            If you are searching for topics like{' '}
            <strong>SIP calculator guide</strong>,{' '}
            <strong>retirement planning India</strong>,{' '}
            <strong>mutual funds for beginners</strong>,{' '}
            <strong>power of compounding</strong>, or{' '}
            <strong>inflation-adjusted returns</strong>, this resources hub gives
            structured learning paths and connects every concept with free
            SmartFintool calculators.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            {[
              {
                icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
                title: 'Beginner Friendly',
                text: 'Simple guides for first-time investors.',
              },
              {
                icon: <Sparkles className="w-5 h-5 text-purple-500" />,
                title: 'Calculator Linked',
                text: 'Learn concepts and calculate outcomes.',
              },
              {
                icon: <Shield className="w-5 h-5 text-blue-500" />,
                title: 'Risk Aware',
                text: 'Educational content, not investment advice.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-slate-50 border border-slate-100 p-5"
              >
                <div className="mb-3">{item.icon}</div>
                <h3 className="font-black text-slate-900">{item.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search + Category Filter */}
      <section className="max-w-7xl mx-auto px-4 space-y-8">
        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search SIP, SWP, mutual funds, retirement planning..."
            className="w-full pl-14 pr-5 py-4 rounded-2xl bg-white border-2 border-slate-200 focus:border-blue-600 focus:outline-none font-medium shadow-sm"
            aria-label="Search financial guides"
          />
        </div>

        <nav
          className="flex flex-wrap gap-2 justify-center"
          aria-label="Resource categories"
        >
          {categories.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-blue-50 hover:text-blue-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </nav>
      </section>

      {/* Blog Grid (Microdata REMOVED - schemas handled in BlogDetail.tsx) */}
      <section
        className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        aria-labelledby="guides-heading"
      >
        <div className="md:col-span-2 lg:col-span-3 text-center mb-4">
          <h2
            id="guides-heading"
            className="text-3xl sm:text-4xl font-black text-[#0f172a]"
          >
            Latest Financial Planning Guides
          </h2>
          <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
            Read practical investment articles and then use SmartFintool
            calculators to test your own numbers.
          </p>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="md:col-span-2 lg:col-span-3 bg-white rounded-3xl border border-slate-200 p-10 text-center">
            <p className="font-bold text-slate-700">
              No resources found. Try another keyword or category.
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <article
              key={post.id}
              className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 duration-300 flex flex-col"
            >
              <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

              <div className="p-8 flex flex-col flex-grow space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-2xl text-indigo-600 group-hover:scale-110 transition-transform">
                    {post.icon}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime} min
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Updated {post.updatedAt}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-3">
                    {post.category}
                  </p>

                  <h3 className="text-xl font-black text-[#0f172a] group-hover:text-indigo-600 transition-colors line-clamp-2">
                    <Link to={`/blog/${post.id}`} className="block">
                      {post.title}
                    </Link>
                  </h3>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed flex-grow line-clamp-3">
                  {post.description}
                </p>

                <div className="space-y-3 pt-2">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Key Topics Covered
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {post.keyTopics.slice(0, 4).map((topic) => (
                      <span
                        key={topic}
                        className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-lg font-medium"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Popular Keywords
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {post.seoKeywords.slice(0, 2).map((keyword) => (
                      <span
                        key={keyword}
                        className="text-[11px] bg-slate-50 text-slate-600 px-2 py-1 rounded-lg"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  to={`/blog/${post.id}`}
                  aria-label={`Read full guide: ${post.title}`}
                  className="mt-4 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-2xl font-bold uppercase tracking-widest text-xs group-hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  Read Full Guide
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))
        )}
      </section>

      {/* Calculator Internal Links */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="rounded-[3rem] bg-[#0f172a] text-white p-8 sm:p-12 shadow-2xl">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-3xl sm:text-4xl font-black">
              Use Free Financial Calculators With These Guides
            </h2>
            <p className="text-slate-400 mt-4 leading-relaxed">
              After reading a guide, calculate your own investment numbers using
              SmartFintool SIP, SWP, Lumpsum and compound interest calculators.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {calculatorLinks.map((tool) => (
              <Link
                key={tool.href}
                to={tool.href}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all group"
              >
                <div className="bg-white rounded-xl w-10 h-10 flex items-center justify-center mb-4">
                  {tool.icon}
                </div>
                <h3 className="font-black text-white group-hover:text-blue-300 transition-colors">
                  {tool.label}
                </h3>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                  {tool.text}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Path */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl p-8 sm:p-12">
          <h2 className="text-3xl sm:text-4xl font-black text-[#0f172a] text-center mb-10">
            Recommended Learning Path For Beginners
          </h2>

          <div className="grid md:grid-cols-4 gap-5">
            {[
              {
                step: '01',
                title: 'Understand Basics',
                text: 'Start with mutual funds, compounding, inflation and financial goals.',
              },
              {
                step: '02',
                title: 'Plan Investments',
                text: 'Use SIP and lumpsum guides to select a suitable wealth-building strategy.',
              },
              {
                step: '03',
                title: 'Calculate Goals',
                text: 'Use calculators to estimate corpus, maturity value and required monthly SIP.',
              },
              {
                step: '04',
                title: 'Review Regularly',
                text: 'Recheck goals, return assumptions, inflation and risk profile every year.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-2xl bg-slate-50 border border-slate-100 p-6"
              >
                <span className="text-4xl font-black text-blue-100">
                  {item.step}
                </span>
                <h3 className="font-black text-slate-900 mt-3">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="max-w-5xl mx-auto px-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-[3rem] border-2 border-indigo-200 p-12 sm:p-16 text-center">
        <h2 className="text-3xl sm:text-4xl font-black text-[#0f172a] mb-6">
          Want More Free Financial Content?
        </h2>

        <p className="text-gray-700 text-lg mb-8 max-w-2xl mx-auto">
          Get updates on SIP planning, retirement strategy, mutual fund education,
          calculator usage guides and investment planning articles.
        </p>

        <form
          onSubmit={handleSubscribe}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-6 py-3 rounded-2xl bg-white border-2 border-indigo-200 focus:border-indigo-600 focus:outline-none font-medium"
            required
            aria-label="Email address"
          />

          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-2xl font-bold uppercase tracking-widest text-sm hover:shadow-lg transition-all"
          >
            Subscribe
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-emerald-700 font-bold">{message}</p>
        )}
      </section>

      {/* FAQ Section (Visual Only - FAQ schema handled in App.tsx) */}
      <section className="max-w-5xl mx-auto px-4" aria-labelledby="faq-heading">
        <h2
          id="faq-heading"
          className="text-3xl sm:text-4xl font-black text-[#0f172a] mb-12 text-center"
        >
          Financial Resources FAQ
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {resourceFaqs.map((faq) => (
            <div
              key={faq.q}
              className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-sm"
            >
              <h3 className="font-black text-[#0f172a]">{faq.q}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}