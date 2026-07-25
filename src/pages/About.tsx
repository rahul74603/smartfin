import { User, Target, CheckCircle2, TrendingUp, ShieldCheck, Calculator } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

const About = () => (
  <>
    {/*
      Helmet block removed.

      Two bugs here:
      1. <HelmetProvider> was never mounted in main.tsx, so react-helmet-async
         silently discarded every tag in this block — none of it ever reached
         the document head.
      2. The canonical it declared was https://www.smartfintool.com/about while
         the sitemap, the hreflang tags and every internal link use the
         non-www https://smartfintool.com/about. That is a self-conflicting
         canonical and it splits ranking signals across two hostnames.

      Meta for this route now comes from the single source of truth in
      src/seo/config.ts, applied by App.tsx at runtime and baked into the
      static HTML by scripts/prerender.mjs at build time.
    */}

    <main className="max-w-6xl mx-auto space-y-12 pb-24 font-inter" role="main">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 px-4 pt-4">
        <ol className="flex items-center gap-2" itemScope itemType="https://schema.org/BreadcrumbList">
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <a href="/" itemProp="item" className="hover:text-blue-600 transition-colors">
              <span itemProp="name">Home</span>
            </a>
            <meta itemProp="position" content="1" />
          </li>
          <li className="text-gray-400" aria-hidden="true">/</li>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <span itemProp="name" className="text-blue-600 font-semibold">About SmartFintool</span>
            <meta itemProp="position" content="2" />
          </li>
        </ol>
      </nav>

      <article>
        <Card className="shadow-2xl border-none rounded-[3rem] overflow-hidden bg-white border-t-8 border-blue-600">
          <CardHeader className="bg-[#0f172a] text-white p-10 sm:p-16 text-center relative">
            <div className="bg-blue-600 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl" aria-hidden="true">
              <User className="w-10 h-10 text-white" />
            </div>
            <CardTitle>
              <h1 className="text-4xl sm:text-6xl font-black">
                About SmartFintool – India&apos;s Free Financial Calculator Platform
              </h1>
            </CardTitle>
            <p className="text-blue-200 font-bold tracking-[0.2em] uppercase text-xs mt-4">
              Free SIP, SWP, Lumpsum, Compound &amp; Simple Interest Calculators Built For Indian Investors
            </p>
          </CardHeader>

          <CardContent className="p-8 sm:p-12 space-y-10 text-gray-700 leading-relaxed">
            {/* Who We Are Section */}
            <section aria-labelledby="who-we-are" className="space-y-4">
              <h2 id="who-we-are" className="text-3xl font-black text-[#0f172a]">
                Who We Are – SmartFintool Financial Calculator Platform
              </h2>
              <p>
                <strong>SmartFintool</strong> is a dedicated <strong>financial calculator website</strong> founded by <strong>Rahul Kumar</strong>. Our goal is simple: make high-quality <strong>financial planning tools</strong> accessible to every <strong>Indian investor</strong> without complexity, paid barriers, or technical confusion.
              </p>
              <p>
                We focus on calculators that real users search daily on Google such as <strong>SIP calculator</strong>, <strong>SWP calculator</strong>, <strong>Lumpsum calculator</strong>, <strong>Compound Interest calculator</strong>, and <strong>Simple Interest calculator</strong>. Instead of only giving numbers, we provide context so users understand what each result means for <strong>long-term wealth planning</strong> and <strong>investment growth analysis</strong>.
              </p>
            </section>

            {/* Mission, Vision, Approach Cards */}
            <div className="grid lg:grid-cols-3 gap-6" role="list">
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6" role="listitem">
                <Target className="w-8 h-8 text-blue-600 mb-3" aria-hidden="true" />
                <h3 className="text-xl font-extrabold text-[#0f172a] mb-2">Our Mission</h3>
                <p>
                  Deliver reliable <strong>financial calculator</strong> outputs that help <strong>Indian families</strong> plan <strong>investment goals</strong> with clarity, discipline, and better financial decisions using tools like <strong>SIP calculator</strong> and <strong>SWP calculator</strong>.
                </p>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6" role="listitem">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mb-3" aria-hidden="true" />
                <h3 className="text-xl font-extrabold text-[#0f172a] mb-2">Our Vision</h3>
                <p>
                  Become <strong>India&apos;s most trusted free personal finance calculator</strong> destination for <strong>goal planning</strong>, <strong>retirement forecasting</strong>, and <strong>wealth growth analysis</strong> with calculators for SIP, SWP, Lumpsum, and interest computation.
                </p>
              </div>
              <div className="bg-violet-50 border border-violet-100 rounded-2xl p-6" role="listitem">
                <TrendingUp className="w-8 h-8 text-violet-600 mb-3" aria-hidden="true" />
                <h3 className="text-xl font-extrabold text-[#0f172a] mb-2">Our Approach</h3>
                <p>
                  Use practical <strong>financial math models</strong>, transparent assumptions, and <strong>SEO-driven educational content</strong> so users can learn and apply <strong>investment calculations</strong> immediately for better financial outcomes.
                </p>
              </div>
            </div>

            {/* What Makes Us Different */}
            <section aria-labelledby="what-makes-different" className="space-y-4">
              <h2 id="what-makes-different" className="text-3xl font-black text-[#0f172a]">
                What Makes SmartFintool Different From Other Financial Calculator Websites
              </h2>
              <p>
                Many finance websites show only minimal calculator UI. <strong>SmartFintool</strong> combines a powerful <strong>calculation engine</strong>, detailed <strong>interpretation guide</strong>, and educational <strong>long-form content</strong> to support both beginners and experienced investors. This improves user understanding and creates higher trust in <strong>financial planning decisions</strong>.
              </p>
              <p>
                We continuously optimize for search quality and user utility by covering high-intent finance keywords including &ldquo;<strong>best SIP calculator India</strong>&rdquo;, &ldquo;<strong>SWP withdrawal planning</strong>&rdquo;, &ldquo;<strong>lumpsum return with inflation</strong>&rdquo;, and &ldquo;<strong>compound interest growth analysis</strong>&rdquo;. Our focus is usefulness first, then ranking – ensuring every visitor gets genuine <strong>financial planning value</strong>.
              </p>
            </section>

            {/* Calculator Ecosystem */}
            <section aria-labelledby="calculator-ecosystem" className="space-y-4">
              <h2 id="calculator-ecosystem" className="text-3xl font-black text-[#0f172a]">
                Financial Calculator Ecosystem on SmartFintool
              </h2>
              <p className="text-gray-600">
                Explore our comprehensive suite of <strong>free financial calculators</strong> designed specifically for <strong>Indian investors</strong> and <strong>financial planning</strong> needs:
              </p>
              <div className="grid md:grid-cols-2 gap-5" role="list">
                <div className="rounded-xl border border-slate-200 p-5 bg-slate-50" role="listitem">
                  <h3 className="font-bold text-lg text-slate-900">
                    SIP Calculator – Systematic Investment Plan Calculator
                  </h3>
                  <p className="text-sm">
                    Monthly <strong>SIP investment projection</strong> with <strong>inflation-aware interpretation</strong> for <strong>long-term wealth planning</strong>. Calculate how much your monthly SIP investment can grow over 5, 10, 15, 20, or 25 years with expected returns.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 p-5 bg-slate-50" role="listitem">
                  <h3 className="font-bold text-lg text-slate-900">
                    SWP Calculator – Systematic Withdrawal Plan Calculator
                  </h3>
                  <p className="text-sm">
                    <strong>Retirement withdrawal strategy planner</strong> with <strong>corpus sustainability</strong> and <strong>balance projection</strong>. Plan how long your retirement corpus will last with regular monthly withdrawals while remaining invested.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 p-5 bg-slate-50" role="listitem">
                  <h3 className="font-bold text-lg text-slate-900">
                    Lumpsum Calculator – One-Time Investment Calculator
                  </h3>
                  <p className="text-sm">
                    <strong>One-time investment growth analysis</strong> with <strong>inflation-adjusted final corpus</strong> insights. See how a single lump sum investment grows over time with the power of compounding.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 p-5 bg-slate-50" role="listitem">
                  <h3 className="font-bold text-lg text-slate-900">
                    Compound &amp; Simple Interest Calculators
                  </h3>
                  <p className="text-sm">
                    <strong>Compound interest calculator</strong> and <strong>simple interest calculator</strong> for educational, planning, and <strong>scenario testing</strong> use cases. Understand the difference between simple and compound interest with real examples.
                  </p>
                </div>
              </div>
            </section>

            {/* Trust and Transparency */}
            <section aria-labelledby="trust-transparency" className="bg-blue-50 border border-blue-100 p-6 rounded-2xl space-y-3">
              <h2 id="trust-transparency" className="text-2xl font-black text-[#0f172a] flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-blue-600" aria-hidden="true" /> Trust, Transparency &amp; Disclaimer
              </h2>
              <p>
                <strong>SmartFintool</strong> is committed to transparent assumptions in all financial calculations. Calculator outputs are <strong>estimations designed for planning support</strong>, not guaranteed investment outcomes. Market returns can vary, and past performance does not guarantee future results.
              </p>
              <p>
                We encourage users to combine <strong>calculator analysis</strong> with <strong>professional financial advice</strong> when making high-stakes financial decisions related to <strong>mutual funds</strong>, <strong>retirement planning</strong>, or <strong>large investments</strong>.
              </p>
              <p>
                For product queries, partnerships, or content corrections, contact us at{' '}
                <a
                  href="mailto:help@smartfintool.com"
                  className="text-blue-600 font-bold hover:underline"
                  aria-label="Email SmartFintool support at help@smartfintool.com"
                >
                  help@smartfintool.com
                </a>.
              </p>
            </section>

            {/* FAQ Section */}
            <section aria-labelledby="faq-section" className="space-y-4">
              <h2 id="faq-section" className="text-3xl font-black text-[#0f172a]">
                Frequently Asked Questions About SmartFintool
              </h2>
              <div className="grid md:grid-cols-3 gap-4" role="list">
                <article className="rounded-xl border border-slate-200 p-4" role="listitem" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                  <h3 className="font-bold text-slate-900 mb-2" itemProp="name">
                    Is SmartFintool actually free, or are there hidden charges?
                  </h3>
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p className="text-sm" itemProp="text">
                      It is 100% free! There are no hidden charges, no premium plans, and you don't even need to create an account. Just open the website and start calculating your wealth right away.
                    </p>
                  </div>
                </article>
                <article className="rounded-xl border border-slate-200 p-4" role="listitem" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                  <h3 className="font-bold text-slate-900 mb-2" itemProp="name">
                    I am a total beginner. Is this website for me?
                  </h3>
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p className="text-sm" itemProp="text">
                      Absolutely! We built SmartFintool especially for beginners. Whether you just got your first salary, or you are planning for retirement, our tools are super easy to use. No complicated finance jargon—just simple, clear results.
                    </p>
                  </div>
                </article>
                <article className="rounded-xl border border-slate-200 p-4" role="listitem" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                  <h3 className="font-bold text-slate-900 mb-2" itemProp="name">
                    What kind of calculators can I find here?
                  </h3>
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p className="text-sm" itemProp="text">
                      We have all the essential tools you need! Want to see how your monthly savings grow? Use the <strong>SIP Calculator</strong>. Got a big bonus? Check the <strong>Lumpsum Calculator</strong>. Planning to withdraw monthly? Use the <strong>SWP tool</strong>. We also have standard interest calculators.
                    </p>
                  </div>
                </article>
                <article className="rounded-xl border border-slate-200 p-4" role="listitem" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                  <h3 className="font-bold text-slate-900 mb-2" itemProp="name">
                    Are the calculation results accurate? Can I trust them?
                  </h3>
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p className="text-sm" itemProp="text">
                      Yes, the math is 100% accurate because we use standard financial formulas. However, remember that real-world mutual funds depend on the stock market. So, treat these numbers as a very good estimate for your planning, not a magical guarantee.
                    </p>
                  </div>
                </article>
                <article className="rounded-xl border border-slate-200 p-4" role="listitem" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                  <h3 className="font-bold text-slate-900 mb-2" itemProp="name">
                    Will you tell me which mutual fund to buy?
                  </h3>
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p className="text-sm" itemProp="text">
                      No, we don't give investment advice. SmartFintool is strictly an educational tool to help you do your own math. We highly recommend talking to a certified financial advisor before investing your hard-earned money.
                    </p>
                  </div>
                </article>
                <article className="rounded-xl border border-slate-200 p-4" role="listitem" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
                  <h3 className="font-bold text-slate-900 mb-2" itemProp="name">
                    Do you update the website regularly?
                  </h3>
                  <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                    <p className="text-sm" itemProp="text">
                      Yes, we do! We constantly improve our calculators, add new features, and write helpful guides to make sure you always have the best and most accurate tools for your financial journey.
                    </p>
                  </div>
                </article>
              </div>
            </section>

            {/* Final Note */}
            <section aria-labelledby="final-note" className="bg-[#0f172a] text-white p-6 rounded-2xl">
              <h2 id="final-note" className="text-2xl font-black mb-2 flex items-center gap-2">
                <Calculator className="w-6 h-6" aria-hidden="true" /> SmartFintool – Turning Financial Calculations Into Actionable Decisions
              </h2>
              <p className="text-slate-300">
                <strong className="text-white">SmartFintool</strong> exists to turn <strong className="text-white">financial calculations</strong> into <strong className="text-white">actionable investment decisions</strong>. We are building a long-term platform where every calculator page – whether it&apos;s our <strong className="text-white">SIP calculator</strong>, <strong className="text-white">SWP calculator</strong>, <strong className="text-white">Lumpsum calculator</strong>, or <strong className="text-white">interest calculators</strong> – is educational, transparent, and optimized for users as well as search engines. Start planning your <strong className="text-white">financial future</strong> today with SmartFintool.
              </p>
            </section>
          </CardContent>
        </Card>
      </article>
    </main>
  </>
);

export default About;