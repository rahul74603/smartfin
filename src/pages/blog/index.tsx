import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowRight, BookOpen, TrendingUp, Zap, Brain, Target, Award, Shield } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: number;
  icon: React.ReactNode;
  keyTopics: string[];
  seoKeywords: string[];
}

const blogPosts: BlogPost[] = [
  {
    id: 'sip-vs-lumpsum',
    title: 'SIP vs Lumpsum: Which Investment Strategy Is Best For You?',
    description: 'Complete comparison between Systematic Investment Plan (SIP) and Lumpsum investments. Learn which strategy works best for different financial goals, market conditions, and risk tolerance.',
    category: 'Investment Strategy',
    readTime: 8,
    icon: <TrendingUp className="w-6 h-6" />,
    keyTopics: ['SIP advantages', 'Lumpsum strategy', 'Market timing', 'Risk management', 'Returns comparison'],
    seoKeywords: ['SIP vs lumpsum', 'which is better SIP or lumpsum', 'lumpsum vs sip returns', 'mutual fund investment strategy'],
  },
  {
    id: 'retirement-planning-guide',
    title: 'Retirement Planning Guide 2026: Calculate Your Retirement Corpus',
    description: 'Step-by-step guide to plan retirement with SWP calculator. Understand how much corpus you need, withdrawal strategies, and inflation impact on retirement lifestyle.',
    category: 'Financial Planning',
    readTime: 10,
    icon: <Award className="w-6 h-6" />,
    keyTopics: ['Retirement corpus', 'SWP strategy', 'Inflation adjustment', 'Lifestyle planning', 'Tax optimization'],
    seoKeywords: ['retirement planning india', 'retirement corpus calculator', 'how much to save for retirement', 'retirement withdrawal planning'],
  },
  {
    id: 'power-of-compounding',
    title: 'The Power of Compounding: How to Build Wealth Over Time',
    description: 'Understand Einstein\'s favorite formula - the eighth wonder of the world. Learn how compound interest grows your investments exponentially with practical examples.',
    category: 'Financial Education',
    readTime: 7,
    icon: <Zap className="w-6 h-6" />,
    keyTopics: ['Compound interest', 'Exponential growth', 'Time factor', 'Compounding frequency', 'Real-world examples'],
    seoKeywords: ['the power of compounding', 'compound interest growth', 'compounding miracle', 'how to use compounding in investments'],
  },
  {
    id: 'financial-goal-setting',
    title: 'Financial Goal Setting: 5-Step Framework For Smart Investments',
    description: 'Create realistic financial goals and achieve them with this proven 5-step framework. Includes calculators, templates, and real-life case studies.',
    category: 'Financial Planning',
    readTime: 9,
    icon: <Target className="w-6 h-6" />,
    keyTopics: ['Goal setting', 'SMART goals', 'Timeline planning', 'Risk assessment', 'Regular monitoring'],
    seoKeywords: ['financial goal setting', 'investment goals planning', 'how to set financial goals', 'financial planning steps'],
  },
  {
    id: 'inflation-impact-investments',
    title: 'How Inflation Destroys Your Wealth: Inflation-Adjusted Planning',
    description: 'Understand inflation\'s silent impact on your investments. Learn why nominal returns aren\'t enough and how to plan for real wealth with inflation adjustment.',
    category: 'Investment Education',
    readTime: 8,
    icon: <Brain className="w-6 h-6" />,
    keyTopics: ['Inflation impact', 'Real returns', 'Purchasing power', 'Inflation-adjusted wealth', 'Protection strategies'],
    seoKeywords: ['inflation impact on investments', 'inflation adjusted returns', 'real vs nominal returns', 'planning for inflation india'],
  },
  {
    id: 'mutual-fund-guide',
    title: 'Mutual Fund Beginner\'s Guide: From Zero To Investment Pro',
    description: 'Complete guide for mutual fund beginners. Types of funds, how to choose, SIP setup, tax implications, and performance monitoring.',
    category: 'Mutual Funds',
    readTime: 12,
    icon: <BookOpen className="w-6 h-6" />,
    keyTopics: ['Mutual fund types', 'Fund selection', 'SIP setup', 'Performance tracking', 'Tax planning'],
    seoKeywords: ['mutual funds for beginners', 'how to invest in mutual funds', 'mutual fund guide india', 'sip mutual funds'],
  },
  {
    id: 'emergency-fund-planning',
    title: 'Emergency Fund: How Much You Really Need + Calculator',
    description: 'Calculate your emergency fund requirement based on monthly expenses, job stability, and dependents. Plus strategies to build and maintain it.',
    category: 'Financial Planning',
    readTime: 7,
    icon: <Shield className="w-6 h-6" />,
    keyTopics: ['Emergency fund amount', 'Monthly expenses', 'Job stability', 'Build strategy', 'Investment options'],
    seoKeywords: ['emergency fund calculator', 'how much emergency fund needed', 'emergency fund india', 'emergency savings'],
  },
  {
    id: 'investment-calculator-guide',
    title: 'Complete Calculator Guide: When To Use SIP, SWP, & Lumpsum',
    description: 'Comprehensive guide on all our calculators. When to use each calculator, how to interpret results, and real-world investment scenarios.',
    category: 'Tools Guide',
    readTime: 11,
    icon: <TrendingUp className="w-6 h-6" />,
    keyTopics: ['Calculator usage', 'Input parameters', 'Result interpretation', 'Scenarios', 'Decision making'],
    seoKeywords: ['investment calculator', 'sip calculator guide', 'financial calculator india', 'online investment calculator'],
  },
];

export default function BlogPost() {
  const location = useLocation();
  // Extract id from path: /blog/sip-vs-lumpsum -> sip-vs-lumpsum
  const id = location.pathname.substring(6); // skip '/blog/'
  const post = blogPosts.find((p) => p.id === id);

  // Update meta tags for SEO
  useEffect(() => {
    if (post) {
      document.title = `${post.title} | SmartFintool`;
      // Meta description update logic
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', post.description);
      
      // Meta keywords update logic for SEO
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) metaKeywords.setAttribute('content', post.seoKeywords.join(', '));
    }
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-black text-[#0f172a] mb-6">Page Not Found</h1>
          <p className="text-gray-600 mb-4">The blog post you're looking for does not exist.</p>
          <a href="/resources" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-xl font-bold text-sm">Go to Resources</a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-indigo-900 to-[#0f172a] text-white py-16 sm:py-24 rounded-[3.5rem] shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/3 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[200px] pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded-full px-4 py-2 mb-4">
              {post.icon} <span className="text-xs font-bold uppercase tracking-[0.3em]">{post.category}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black leading-[1.1] tracking-tighter">
              {post.title}
            </h1>
            <p className="text-lg text-gray-300 font-medium leading-relaxed">
              {post.description}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <div className="text-sm font-bold text-blue-300 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full"></span> {post.readTime} min read
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl border border-slate-200 p-8">
          <h2 className="text-2xl font-black text-[#0f172a] mb-6">Key Topics Covered</h2>
          <div className="space-y-4">
            {post.keyTopics.map((topic, idx) => (
              <div key={idx} className="flex items-start space-x-3">
                <TrendingUp className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-medium text-[#0f172a]">{topic}</h3>
                  <p className="text-gray-600 text-sm">
                    Detailed explanation and practical examples of {topic.toLowerCase()} to help you apply these concepts in your investment journey.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Resources */}
        <section className="mt-8">
          <h2 className="text-2xl font-black text-[#0f172a] mb-6">Related Resources</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {blogPosts
              .filter((p) => p.id !== id)
              .slice(0, 4)
              .map((related) => (
                <a
                  key={related.id}
                  href={`/blog/${related.id}`}
                  className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-2xl text-indigo-600 group-hover:scale-110 transition-transform">
                        {related.icon}
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                        {related.readTime} min read
                      </span>
                    </div>
                    <h3 className="font-black text-[#0f172a]">{related.title}</h3>
                    <p className="text-gray-600 line-clamp-3">{related.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-blue-500">
                        <BookOpen className="w-4 h-4" /> Read Guide
                      </div>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </a>
              ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-8 text-center">
          <a href="/resources" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-8 rounded-xl font-bold uppercase tracking-widest text-sm inline-flex items-center justify-center gap-2 hover:shadow-lg transition-all">
            Explore More Guides <ArrowRight className="w-4 h-4" />
          </a>
        </section>
      </section> {/* Added missing closing section tag here */}
    </div>
  );
}