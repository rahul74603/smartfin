import { CheckCircle2, XCircle, AlertCircle, TrendingUp, Clock, Target } from 'lucide-react';

// NOTE: All SEO (title, meta, canonical, FAQPage schema, BreadcrumbList schema)
// is handled GLOBALLY in App.tsx to avoid duplicates.

interface ComparisonItem {
  feature: string;
  sip: string;
  lumpsum: string;
  swp: string;
  winner?: 'sip' | 'lumpsum' | 'swp';
}

const comparisons: ComparisonItem[] = [
  {
    feature: 'Initial Amount Required',
    sip: '₹500-5000/month (Flexible)',
    lumpsum: 'Large amount (₹1L+)',
    swp: 'Invested corpus already',
    winner: 'sip',
  },
  {
    feature: 'Time Requirement',
    sip: '3-5 years minimum',
    lumpsum: 'Immediate investment',
    swp: 'After corpus building',
    winner: 'lumpsum',
  },
  {
    feature: 'Market Timing Risk',
    sip: 'Low (Rupee Cost Averaging)',
    lumpsum: 'High (All at once)',
    swp: 'Medium (Withdrawal phase)',
    winner: 'sip',
  },
  {
    feature: 'Returns Potential',
    sip: 'Good (Long-term compound)',
    lumpsum: 'Excellent (Full period)',
    swp: 'Varies (Withdrawal reduces corpus)',
    winner: 'lumpsum',
  },
  {
    feature: 'Monthly Commitment',
    sip: 'Required (Discipline)',
    lumpsum: 'One-time investment',
    swp: 'Withdrawal (Income)',
    winner: 'lumpsum',
  },
  {
    feature: 'Inflation Protection',
    sip: 'Good (Growing corpus)',
    lumpsum: 'Good (Full potential)',
    swp: 'Medium (Reducing balance)',
    winner: 'lumpsum',
  },
  {
    feature: 'Best For',
    sip: 'Young, Regular earners',
    lumpsum: 'Bonus, Inheritance',
    swp: 'Retired, Passive income',
    winner: undefined,
  },
];

// Strategy data with FIXED routes and STATIC class names
interface StrategyCard {
  icon: React.ReactNode;
  title: string;
  calculatorUrl: string;
  calculatorName: string;
  borderClass: string;
  iconColorClass: string;
  buttonClass: string;
  cases: string[];
}

const strategyCards: StrategyCard[] = [
  {
    icon: <TrendingUp />,
    title: 'Best for SIP (Monthly Investment)',
    calculatorUrl: '/',
    calculatorName: 'SIP',
    borderClass: 'border-emerald-100',
    iconColorClass: 'text-emerald-600',
    buttonClass: 'bg-emerald-600 hover:bg-emerald-700',
    cases: [
      '✓ Young professionals (Age 25-40)',
      '✓ Regular monthly income',
      '✓ Building wealth over 10-20 years',
      '✓ Risk-averse investors',
      '✓ Want to avoid market timing',
      '✓ Rupee cost averaging benefit',
    ],
  },
  {
    icon: <Target />,
    title: 'Best for Lumpsum (One-Time)',
    calculatorUrl: '/lumpsum',
    calculatorName: 'Lumpsum',
    borderClass: 'border-blue-100',
    iconColorClass: 'text-blue-600',
    buttonClass: 'bg-blue-600 hover:bg-blue-700',
    cases: [
      '✓ Received bonus or large sum',
      '✓ Inherited amount',
      '✓ Investment over 5+ years',
      '✓ Investing near market lows',
      '✓ Full capital utilization needed',
      '✓ Want maximum compound benefit',
    ],
  },
  {
    icon: <Clock />,
    title: 'Best for SWP (Withdrawal Plan)',
    calculatorUrl: '/swp',
    calculatorName: 'SWP',
    borderClass: 'border-purple-100',
    iconColorClass: 'text-purple-600',
    buttonClass: 'bg-purple-600 hover:bg-purple-700',
    cases: [
      '✓ Retired investors (Age 50+)',
      '✓ Need regular income',
      '✓ Have built investment corpus',
      '✓ Want tax-optimized withdrawals',
      '✓ Maintain capital while withdrawing',
      '✓ Reduce sequence-of-returns risk',
    ],
  },
];

// Scenario data with STATIC class names
interface ScenarioCard {
  scenario: string;
  description: string;
  winner: string;
  reason: string;
  amount: string;
  badgeClass: string;
}

const scenarioCards: ScenarioCard[] = [
  {
    scenario: 'Priya, Age 28, ₹1L Monthly Income',
    description: 'Wants to save ₹50,000/month for 20 years for retirement',
    winner: 'SIP',
    reason: 'Regular monthly investment, long tenure, rupee cost averaging, and disciplined approach.',
    amount: 'SIP: ₹50K/month for 20 years at 12% = ₹4.7 Cr',
    badgeClass: 'bg-emerald-100 text-emerald-700',
  },
  {
    scenario: 'Rakesh, Got ₹20L Bonus',
    description: 'Want to invest entire bonus for 15 years',
    winner: 'Lumpsum',
    reason: 'Large amount, 15-year horizon, one-time deployment, maximum compounding period.',
    amount: 'Lumpsum: ₹20L for 15 years at 12% = ₹1.73 Cr',
    badgeClass: 'bg-blue-100 text-blue-700',
  },
  {
    scenario: 'Meera, Age 55, Has ₹2Cr Corpus',
    description: 'Retired, needs ₹1L monthly income',
    winner: 'SWP',
    reason: 'Steady monthly income needed, capital preservation, tax optimization, longevity planning.',
    amount: 'SWP: ₹1L/month for 25+ years at 9% returns',
    badgeClass: 'bg-purple-100 text-purple-700',
  },
  {
    scenario: 'Arjun, Got ₹5L Tax Refund',
    description: 'Wants to invest for 3 years',
    winner: 'Depends',
    reason: 'Short tenure: Lumpsum better but risky. Better to split: ₹3L lumpsum + ₹50K monthly SIP.',
    amount: 'Hybrid: Mix of both approaches for balance',
    badgeClass: 'bg-amber-100 text-amber-700',
  },
];

// Returns comparison data with STATIC class names
interface ReturnsCard {
  title: string;
  desc: string;
  bgClass: string;
  borderClass: string;
  titleClass: string;
  descClass: string;
  valueClass: string;
  breakdown: { label: string; value: string; sub: string }[];
}

const returnsCards: ReturnsCard[] = [
  {
    title: 'SIP Approach',
    desc: '₹50K/month for 20 years',
    bgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-200',
    titleClass: 'text-emerald-900',
    descClass: 'text-emerald-700',
    valueClass: 'text-emerald-700',
    breakdown: [
      { label: 'Total Investment', value: '₹1,20,00,000', sub: 'Your money' },
      { label: 'Total Gains', value: '₹2,23,67,411', sub: 'Compound interest' },
      { label: 'Final Corpus', value: '₹3,43,67,411', sub: 'Wealth created' },
      { label: 'Gain Ratio', value: '186%', sub: 'Return on invested' },
    ],
  },
  {
    title: 'Lumpsum Approach',
    desc: '₹50L invested upfront',
    bgClass: 'bg-blue-50',
    borderClass: 'border-blue-200',
    titleClass: 'text-blue-900',
    descClass: 'text-blue-700',
    valueClass: 'text-blue-700',
    breakdown: [
      { label: 'Initial Investment', value: '₹50,00,000', sub: 'Your money' },
      { label: 'Total Gains', value: '₹1,84,68,000', sub: 'Compound benefit' },
      { label: 'Final Corpus', value: '₹2,34,68,000', sub: 'Wealth created' },
      { label: 'Gain Ratio', value: '369%', sub: 'Return on invested' },
    ],
  },
  {
    title: '60/40 Hybrid',
    desc: '₹25L + ₹25K/month',
    bgClass: 'bg-purple-50',
    borderClass: 'border-purple-200',
    titleClass: 'text-purple-900',
    descClass: 'text-purple-700',
    valueClass: 'text-purple-700',
    breakdown: [
      { label: 'Total Investment', value: '₹85,00,000', sub: 'Your money' },
      { label: 'Total Gains', value: '₹2,10,15,705', sub: 'Blended returns' },
      { label: 'Final Corpus', value: '₹2,95,15,705', sub: 'Wealth created' },
      { label: 'Gain Ratio', value: '247%', sub: 'Return on invested' },
    ],
  },
];

export default function Comparisons() {
  return (
    <div className="space-y-20 max-w-7xl mx-auto px-4">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-[3rem] p-12 sm:p-16 text-center space-y-6">
        <h1 className="text-4xl sm:text-6xl font-black leading-tight">Investment Strategy Comparison</h1>
        <p className="text-lg text-blue-100 max-w-2xl mx-auto">
          Compare SIP, Lumpsum, and SWP strategies side-by-side to choose the right investment approach for your financial goals.
        </p>
      </section>

      {/* Main Comparison Table */}
      <section>
        <h2 className="text-3xl font-black text-[#0f172a] mb-8">Feature Comparison: SIP vs Lumpsum vs SWP</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-[2rem] overflow-hidden shadow-xl">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <th className="px-6 py-4 text-left font-black uppercase tracking-widest text-sm">Feature</th>
                <th className="px-6 py-4 text-center font-black uppercase tracking-widest text-sm">SIP</th>
                <th className="px-6 py-4 text-center font-black uppercase tracking-widest text-sm">Lumpsum</th>
                <th className="px-6 py-4 text-center font-black uppercase tracking-widest text-sm">SWP</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((comp, idx) => (
                <tr key={idx} className={`border-t ${idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'} hover:bg-blue-50 transition-colors`}>
                  <td className="px-6 py-4 font-bold text-[#0f172a]">{comp.feature}</td>
                  <td className={`px-6 py-4 text-center ${comp.winner === 'sip' ? 'bg-emerald-100' : ''}`}>
                    <div className="flex items-center justify-center gap-2">
                      {comp.winner === 'sip' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                      <span className="text-sm font-semibold">{comp.sip}</span>
                    </div>
                  </td>
                  <td className={`px-6 py-4 text-center ${comp.winner === 'lumpsum' ? 'bg-blue-100' : ''}`}>
                    <div className="flex items-center justify-center gap-2">
                      {comp.winner === 'lumpsum' && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                      <span className="text-sm font-semibold">{comp.lumpsum}</span>
                    </div>
                  </td>
                  <td className={`px-6 py-4 text-center ${comp.winner === 'swp' ? 'bg-purple-100' : ''}`}>
                    <div className="flex items-center justify-center gap-2">
                      {comp.winner === 'swp' && <CheckCircle2 className="w-5 h-5 text-purple-600" />}
                      <span className="text-sm font-semibold">{comp.swp}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Use Case Cards (FIXED: Static classes + correct URLs) */}
      <section>
        <h2 className="text-3xl font-black text-[#0f172a] mb-8">Choose Your Strategy Based On Your Situation</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {strategyCards.map((strategy, idx) => (
            <div key={idx} className={`bg-white rounded-[2.5rem] border-2 ${strategy.borderClass} p-8 space-y-6 shadow-lg hover:shadow-xl transition-all`}>
              <div className={`text-4xl font-black ${strategy.iconColorClass}`}>{strategy.icon}</div>
              <h3 className="text-xl font-black text-[#0f172a]">{strategy.title}</h3>
              <ul className="space-y-3">
                {strategy.cases.map((caseItem, cidx) => (
                  <li key={cidx} className="text-sm font-medium text-gray-700">
                    {caseItem}
                  </li>
                ))}
              </ul>
              <a 
                href={strategy.calculatorUrl} 
                className={`w-full ${strategy.buttonClass} text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all block text-center`}
              >
                Use {strategy.calculatorName} Calculator
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Scenario Based Comparison (FIXED: Static classes) */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-[3rem] p-12 space-y-8">
        <h2 className="text-3xl font-black text-[#0f172a]">Real-Life Scenarios: Which Strategy Wins?</h2>

        <div className="grid md:grid-cols-2 gap-8">
          {scenarioCards.map((scenario, idx) => (
            <div key={idx} className="bg-white rounded-[2rem] border-2 border-slate-200 p-8 space-y-6">
              <div className="space-y-3">
                <h3 className="text-lg font-black text-[#0f172a]">{scenario.scenario}</h3>
                <p className="text-sm text-gray-600">{scenario.description}</p>
              </div>

              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${scenario.badgeClass}`}>
                <CheckCircle2 className="w-4 h-4" /> {scenario.winner} Strategy
              </div>

              <p className="text-sm text-gray-700 leading-relaxed">{scenario.reason}</p>
              <div className="bg-blue-50 border-l-4 border-blue-600 px-4 py-3 text-sm font-medium text-blue-900">
                {scenario.amount}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Returns Comparison Chart (FIXED: Static classes) */}
      <section>
        <h2 className="text-3xl font-black text-[#0f172a] mb-8">Example: ₹50L Investment Over 20 Years @ 12% Returns</h2>
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-12 space-y-12">
          <div className="grid md:grid-cols-3 gap-8">
            {returnsCards.map((strategy, idx) => (
              <div key={idx} className={`rounded-[2rem] ${strategy.bgClass} border-2 ${strategy.borderClass} p-8 space-y-6`}>
                <h3 className={`font-black text-lg ${strategy.titleClass}`}>{strategy.title}</h3>
                <p className={`text-sm font-medium ${strategy.descClass}`}>{strategy.desc}</p>

                <div className="space-y-3">
                  {strategy.breakdown.map((item, bidx) => (
                    <div key={bidx} className="bg-white rounded-xl p-4 space-y-1">
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-600">{item.label}</p>
                      <p className={`text-2xl font-black ${strategy.valueClass}`}>{item.value}</p>
                      <p className="text-xs text-gray-500">{item.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 space-y-3">
            <p className="font-bold text-blue-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> Key Insight
            </p>
            <p className="text-sm text-blue-800">
              <strong>Lumpsum provides highest absolute returns (369%)</strong> but requires accessing large capital upfront. <strong>SIP provides tax-optimized compound growth (186%)</strong> with lower capital requirement. Choose based on capital availability and risk tolerance, not just returns.
            </p>
          </div>
        </div>
      </section>

      {/* Decision Flowchart Section */}
      <section>
        <h2 className="text-3xl font-black text-[#0f172a] mb-8">Decision Flowchart: Pick Your Strategy</h2>
        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-12 space-y-8">
          <p className="text-center text-gray-700 font-medium mb-8">Answer these questions to find your ideal investment strategy:</p>

          <div className="space-y-6">
            {[
              { q: 'Do you have ₹5L+ to invest right now?', yes: 'Lumpsum might work', no: 'Go to Q2' },
              { q: 'Can you invest ₹10K+ monthly consistently?', yes: 'SIP suits you', no: 'Go to Q3' },
              { q: 'Are you retired or near retirement?', yes: 'Consider SWP', no: 'Go to Q4' },
              { q: 'Is your investment tenure 10+ years?', yes: 'Any strategy works', no: 'Short-term: Be careful' },
            ].map((q, idx) => (
              <div key={idx} className="flex gap-6 items-start">
                <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-black flex-shrink-0">Q{idx + 1}</div>
                <div className="flex-1 space-y-3">
                  <p className="font-bold text-[#0f172a]">{q.q}</p>
                  <div className="flex gap-4 ml-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm text-emerald-700">Yes: {q.yes}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span className="text-sm text-rose-700">No: {q.no}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ (Visual Only - Schema handled in App.tsx) */}
      <section className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-[2.5rem] p-12 space-y-10">
        <h2 className="text-3xl font-black text-[#0f172a]">Comparison FAQ</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            { q: 'Can I switch strategies mid-way?', a: 'Yes! Start with SIP, switch to Lumpsum when you have capital, then to SWP in retirement.' },
            { q: 'Does market condition matter?', a: 'Yes. Lumpsum in bear market is risky. SIP works in all markets due to rupee cost averaging.' },
            { q: 'Which gives highest returns?', a: 'Lumpsum with correct timing. But SIP is safer as it captures averaging benefits.' },
            { q: 'Is there a perfect strategy?', a: 'No. Your best strategy depends on income, capital availability, goals, and risk tolerance.' },
          ].map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-indigo-100">
              <h3 className="font-black text-[#0f172a] mb-3">{faq.q}</h3>
              <p className="text-sm text-gray-700">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}