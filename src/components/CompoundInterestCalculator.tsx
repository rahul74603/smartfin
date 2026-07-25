import { useMemo, useState, useEffect, lazy, Suspense } from 'react';
import { PieChart, IndianRupee, BarChart3, Clock, Calculator, Target, Download, TrendingUp, BookOpen, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, type TooltipItem } from 'chart.js';
import { formatNumber, downloadPDF } from '../lib/utils';
import { loadAdminSettings } from '@/lib/adminSettings';

// Lazy load chart for better performance
const Doughnut = lazy(() => import('react-chartjs-2').then(module => ({ default: module.Doughnut })));

ChartJS.register(ArcElement, Tooltip, Legend);

interface CIResult {
  principal: number;
  interest: number;
  totalAmount: number;
}

const calculateCompoundInterest = (principal: number, rate: number, time: number, frequency: number): CIResult => {
  const amount = principal * Math.pow(1 + rate / (100 * frequency), frequency * time);
  const interest = amount - principal;
  return { principal, interest, totalAmount: amount };
};

const CompoundInterestCalculator = () => {
  const compoundDefaults = useMemo(() => loadAdminSettings().defaults.compound, []);
  const [principal, setPrincipal] = useState(compoundDefaults.principal);
  const [rate, setRate] = useState(compoundDefaults.rate);
  const [time, setTime] = useState(compoundDefaults.time);
  const [frequency, setFrequency] = useState(compoundDefaults.frequency);
  
  // Memoize calculation for performance
  const result: CIResult = useMemo(
    () => calculateCompoundInterest(principal, rate, time, frequency),
    [principal, rate, time, frequency]
  );

  // ============ SCHEMA MARKUP (Only HowTo - No Duplicates) ============
  // NOTE: Title, Meta, Canonical, FAQPage, WebApplication, BreadcrumbList
  // are handled GLOBALLY in App.tsx to avoid duplicates.
  // We keep only HowTo schema here as it's unique to this calculator.
  useEffect(() => {
    const oldSchema = document.getElementById('ci-howto-schema');
    if (oldSchema) oldSchema.remove();

    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.id = 'ci-howto-schema';
    schemaScript.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Calculate Compound Interest Online",
      "description": "Step by step guide to calculate compound interest using SmartFintool Compound Interest Calculator",
      "totalTime": "PT2M",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "Enter Principal Amount", "text": "Input the initial sum you want to invest (₹1,000 to ₹1 Crore)." },
        { "@type": "HowToStep", "position": 2, "name": "Set Interest Rate", "text": "Enter the annual interest rate offered (typically 1% to 30%)." },
        { "@type": "HowToStep", "position": 3, "name": "Choose Time Period", "text": "Select investment duration in years (1 to 40 years)." },
        { "@type": "HowToStep", "position": 4, "name": "Select Compounding Frequency", "text": "Choose between Yearly, Quarterly, or Monthly compounding frequency." },
        { "@type": "HowToStep", "position": 5, "name": "View Results", "text": "Get instant breakdown of principal, interest earned, and total maturity amount with visual chart." }
      ]
    });
    document.head.appendChild(schemaScript);

    return () => {
      const schema = document.getElementById('ci-howto-schema');
      if (schema) schema.remove();
    };
  }, []);

  const frequencyLabels: { [key: number]: string } = { 1: 'Yearly', 4: 'Quarterly', 12: 'Monthly' };

  const chartData = useMemo(() => ({
    labels: ['Principal Amount', 'Compound Interest'],
    datasets: [
      {
        data: [result.principal, result.interest],
        backgroundColor: ['#1e3a8a', '#f59e0b'],
        borderColor: ['#1e40af', '#d97706'],
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  }), [result.principal, result.interest]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { padding: 20, font: { size: 14, family: 'Inter, sans-serif' }, usePointStyle: true },
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'doughnut'>) => `${context.label}: \u20B9${formatNumber(Number(context.raw ?? 0))}`,
        },
      },
    },
  }), []);

  return (
    <article className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb (Visual only - schema handled in App.tsx) */}
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-600">
        <ol className="flex items-center gap-2">
          <li><a href="/" className="hover:text-emerald-600">Home</a></li>
          <li>/</li>
          <li className="text-emerald-700 font-medium">Compound Interest Calculator</li>
        </ol>
      </nav>

      {/* H2 Subheading (H1 is in App.tsx hero section) */}
      <header className="mb-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Compound Interest Calculator India - Free Online Tool
        </h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
          Calculate compound interest instantly with yearly, quarterly, or monthly compounding. 
          Get accurate results with detailed breakdowns, charts, and downloadable PDF reports - 100% free.
        </p>
      </header>

      {/* Calculator Section */}
      <section aria-labelledby="calculator-heading" className="mb-12">
        <h2 id="calculator-heading" className="sr-only">Compound Interest Calculator Tool</h2>
        
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          <Card className="shadow-calculator" id="ci-calculator-card">
            <CardHeader className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white rounded-t-lg p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <PieChart className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" /> 
                Compound Interest Calculator
              </CardTitle>
              <CardDescription className="text-emerald-100 text-xs sm:text-sm">
                Calculate compound interest with different frequencies
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 space-y-5 sm:space-y-6">
              {/* Principal */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex flex-row justify-between items-center">
                  <label htmlFor="principal-input" className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <IndianRupee className="w-4 h-4 text-emerald-600 hidden sm:block" aria-hidden="true" /> 
                    Principal Amt.
                  </label>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-emerald-900 font-bold" aria-hidden="true">{'\u20B9'}</span>
                    <input 
                      id="principal-input"
                      type="number" 
                      min={1000} 
                      max={10000000} 
                      step={1000} 
                      value={principal} 
                      onChange={(e) => setPrincipal(Number(e.target.value))} 
                      className="w-24 sm:w-32 px-2 py-1.5 border-2 border-emerald-200 rounded-lg text-right font-semibold text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm sm:text-base"
                      aria-label="Principal amount in rupees"
                    />
                  </div>
                </div>
                <input 
                  type="range" 
                  min="1000" 
                  max="10000000" 
                  step="1000" 
                  value={principal} 
                  onChange={(e) => setPrincipal(Number(e.target.value))} 
                  className="w-full accent-emerald-600"
                  aria-label="Principal amount slider"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{'\u20B9'}1,000</span>
                  <span>{'\u20B9'}1 Crore</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex flex-row justify-between items-center">
                  <label htmlFor="rate-input" className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-emerald-600 hidden sm:block" aria-hidden="true" /> 
                    Interest Rate (p.a)
                  </label>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <input 
                      id="rate-input"
                      type="number" 
                      min={1} 
                      max={30} 
                      step={0.5} 
                      value={rate} 
                      onChange={(e) => setRate(Number(e.target.value))} 
                      className="w-16 sm:w-20 px-2 py-1.5 border-2 border-emerald-200 rounded-lg text-right font-semibold text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm sm:text-base"
                      aria-label="Annual interest rate in percent"
                    />
                    <span className="text-emerald-900 font-bold">%</span>
                  </div>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="30" 
                  step="0.5" 
                  value={rate} 
                  onChange={(e) => setRate(Number(e.target.value))} 
                  className="w-full accent-emerald-600"
                  aria-label="Interest rate slider"
                />
                <div className="flex justify-between text-xs text-gray-500"><span>1%</span><span>30%</span></div>
              </div>

              {/* Time Period */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex flex-row justify-between items-center">
                  <label htmlFor="time-input" className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-600 hidden sm:block" aria-hidden="true" /> 
                    Time Period
                  </label>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <input 
                      id="time-input"
                      type="number" 
                      min={1} 
                      max={40} 
                      step={1} 
                      value={time} 
                      onChange={(e) => setTime(Number(e.target.value))} 
                      className="w-16 sm:w-20 px-2 py-1.5 border-2 border-emerald-200 rounded-lg text-right font-semibold text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm sm:text-base"
                      aria-label="Time period in years"
                    />
                    <span className="text-emerald-900 font-bold">Yrs</span>
                  </div>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="40" 
                  step="1" 
                  value={time} 
                  onChange={(e) => setTime(Number(e.target.value))} 
                  className="w-full accent-emerald-600"
                  aria-label="Time period slider"
                />
                <div className="flex justify-between text-xs text-gray-500"><span>1 Year</span><span>40 Years</span></div>
              </div>

              {/* Compounding Frequency */}
              <div className="space-y-2 sm:space-y-3">
                <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-emerald-600 hidden sm:block" aria-hidden="true" /> 
                  Compounding Freq.
                </label>
                <div className="grid grid-cols-3 gap-2" role="group" aria-label="Compounding frequency">
                  {[1, 4, 12].map((freq) => (
                    <button
                      key={freq}
                      onClick={() => setFrequency(freq)}
                      aria-pressed={frequency === freq}
                      className={`py-1.5 sm:py-2 px-2 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-all ${frequency === freq ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      {frequencyLabels[freq]}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="shadow-calculator" id="ci-results">
              <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-t-lg p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Target className="w-5 h-5" aria-hidden="true" /> Summary
                  </CardTitle>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => downloadPDF('ci-results', 'Compound-Interest-Summary.pdf')} 
                    className="h-8 bg-white/20 text-white hover:bg-white/30 border-0"
                    aria-label="Download PDF report"
                  >
                    <Download className="w-4 h-4 mr-1 sm:mr-2" aria-hidden="true" /> 
                    <span className="hidden sm:inline">PDF</span>
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-blue-50 p-3 sm:p-4 rounded-xl">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Principal</p>
                    <p className="text-lg sm:text-xl font-bold text-deepblue-900">{'\u20B9'}{formatNumber(result.principal)}</p>
                  </div>
                  <div className="bg-amber-50 p-3 sm:p-4 rounded-xl">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Interest</p>
                    <p className="text-lg sm:text-xl font-bold text-amber-600">{'\u20B9'}{formatNumber(result.interest)}</p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-emerald-700 to-teal-600 p-4 rounded-xl text-white text-center">
                  <p className="text-xs sm:text-sm text-emerald-100 mb-1">Total Amount</p>
                  <p className="text-2xl sm:text-3xl font-bold">{'\u20B9'}{formatNumber(result.totalAmount)}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-calculator hidden sm:block">
              <CardContent className="p-4 sm:p-6 h-56 sm:h-64">
                <Suspense fallback={<div className="flex items-center justify-center h-full text-gray-500">Loading chart...</div>}>
                  <Doughnut data={chartData} options={chartOptions} />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ============ SEO CONTENT SECTION (CRITICAL) ============ */}
      
      {/* What is Compound Interest */}
      <section className="mt-12 prose prose-emerald max-w-none" aria-labelledby="what-is-ci">
        <Card className="shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <h3 id="what-is-ci" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-emerald-600" aria-hidden="true" />
              What is Compound Interest?
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Compound Interest</strong> is the interest calculated on the initial principal amount 
              as well as the accumulated interest from previous periods. Unlike simple interest, compound 
              interest helps your money grow exponentially over time - which is why Albert Einstein 
              reportedly called it the <em>"eighth wonder of the world."</em>
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you invest money with compound interest, your earnings start earning their own returns. 
              This snowball effect makes compound interest one of the most powerful concepts in personal 
              finance and wealth creation in India.
            </p>

            <h4 className="text-xl font-bold text-gray-900 mt-6 mb-3">Compound Interest Formula</h4>
            <div className="bg-emerald-50 border-l-4 border-emerald-600 p-4 rounded-r-lg my-4">
              <p className="text-lg font-mono font-bold text-emerald-900">
                A = P (1 + r/n)<sup>nt</sup>
              </p>
              <p className="text-sm text-gray-700 mt-2">
                Compound Interest (CI) = A - P
              </p>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li><strong>A</strong> = Final Amount (Principal + Interest)</li>
              <li><strong>P</strong> = Principal Amount (Initial investment)</li>
              <li><strong>r</strong> = Annual Interest Rate (in decimal, e.g., 10% = 0.10)</li>
              <li><strong>n</strong> = Number of times interest is compounded per year</li>
              <li><strong>t</strong> = Time period in years</li>
            </ul>

            <h4 className="text-xl font-bold text-gray-900 mt-6 mb-3">Example Calculation</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 mb-2">
                If you invest <strong>₹1,00,000</strong> at <strong>10% annual interest rate</strong> for 
                <strong> 10 years</strong>, compounded annually:
              </p>
              <p className="font-mono text-sm text-gray-800 my-2">
                A = 1,00,000 × (1 + 0.10/1)<sup>1×10</sup> = ₹2,59,374
              </p>
              <p className="text-gray-700">
                <strong>Compound Interest earned = ₹1,59,374</strong>
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* How to Use Calculator */}
      <section className="mt-8" aria-labelledby="how-to-use">
        <Card className="shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <h3 id="how-to-use" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-7 h-7 text-emerald-600" aria-hidden="true" />
              How to Use Compound Interest Calculator?
            </h3>
            <ol className="space-y-3 text-gray-700">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">1</span>
                <span><strong>Enter Principal Amount:</strong> The initial sum you want to invest (₹1,000 to ₹1 Crore).</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2</span>
                <span><strong>Set Interest Rate:</strong> Annual interest rate offered (1% to 30%).</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">3</span>
                <span><strong>Choose Time Period:</strong> Investment duration in years (1 to 40 years).</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">4</span>
                <span><strong>Select Compounding Frequency:</strong> Yearly, Quarterly, or Monthly compounding.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">5</span>
                <span><strong>View Results:</strong> Get instant breakdown of principal, interest earned, and total maturity amount with visual chart.</span>
              </li>
            </ol>
          </CardContent>
        </Card>
      </section>

      {/* Benefits */}
      <section className="mt-8" aria-labelledby="benefits">
        <Card className="shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <h3 id="benefits" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Benefits of Compound Interest
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: 'Exponential Growth', desc: 'Money grows faster than simple interest due to interest-on-interest effect.' },
                { title: 'Wealth Creation', desc: 'Long-term compounding can turn small investments into substantial wealth.' },
                { title: 'Beat Inflation', desc: 'Higher compounding frequency helps your savings beat inflation effectively.' },
                { title: 'Retirement Planning', desc: 'Perfect for long-term goals like retirement and child education.' },
                { title: 'Passive Income', desc: 'Your money works for you, generating returns even when you sleep.' },
                { title: 'Reinvestment Power', desc: 'Reinvested interest accelerates the growth of your investment portfolio.' },
              ].map((item, idx) => (
                <div key={idx} className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                  <h4 className="font-bold text-emerald-900 mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-700">{item.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Comparison Table */}
      <section className="mt-8" aria-labelledby="comparison">
        <Card className="shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <h3 id="comparison" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Simple Interest vs Compound Interest
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-emerald-600 text-white">
                    <th className="p-3 text-left border border-emerald-700">Parameter</th>
                    <th className="p-3 text-left border border-emerald-700">Simple Interest</th>
                    <th className="p-3 text-left border border-emerald-700">Compound Interest</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white">
                    <td className="p-3 border font-semibold">Calculation</td>
                    <td className="p-3 border">On principal only</td>
                    <td className="p-3 border">On principal + accumulated interest</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-3 border font-semibold">Formula</td>
                    <td className="p-3 border">SI = (P × R × T) / 100</td>
                    <td className="p-3 border">A = P(1 + r/n)^(nt)</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-3 border font-semibold">Growth Rate</td>
                    <td className="p-3 border">Linear (slower)</td>
                    <td className="p-3 border">Exponential (faster)</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-3 border font-semibold">Best For</td>
                    <td className="p-3 border">Short-term loans</td>
                    <td className="p-3 border">Long-term investments</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-3 border font-semibold">Returns (₹1L @10% for 10yr)</td>
                    <td className="p-3 border">₹2,00,000</td>
                    <td className="p-3 border text-emerald-700 font-bold">₹2,59,374</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* FAQ Section (Visual Only - Schema handled in App.tsx) */}
      <section className="mt-8" aria-labelledby="faq-heading">
        <Card className="shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <h3 id="faq-heading" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <HelpCircle className="w-7 h-7 text-emerald-600" aria-hidden="true" />
              Frequently Asked Questions (FAQs)
            </h3>
            <div className="space-y-4">
              {[
                {
                  q: 'What is compound interest in simple terms?',
                  a: 'Compound interest is "interest on interest." When you invest money, you earn interest not just on your original amount but also on the interest you have already earned. This makes your money grow much faster over time.'
                },
                {
                  q: 'What is the formula for compound interest?',
                  a: 'The compound interest formula is A = P(1 + r/n)^(nt), where A is the final amount, P is principal, r is annual interest rate (in decimal), n is number of times interest compounds per year, and t is time in years.'
                },
                {
                  q: 'How is compound interest calculated monthly?',
                  a: 'For monthly compounding, use n=12 in the formula. Example: ₹10,000 at 10% for 5 years monthly compounded = 10000 × (1 + 0.10/12)^(12×5) = ₹16,453.'
                },
                {
                  q: 'Which compounding frequency is best?',
                  a: 'Higher frequency = better returns. Monthly compounding gives more returns than quarterly, which gives more than yearly. However, the difference becomes smaller as frequency increases.'
                },
                {
                  q: 'Is compound interest better than simple interest?',
                  a: 'Yes, for investments compound interest is much better as it generates higher returns. However, for borrowers, simple interest is preferable as you pay less interest over time.'
                },
                {
                  q: 'Does FD use compound interest in India?',
                  a: 'Yes, most Fixed Deposits (FDs) in India use compound interest, typically compounded quarterly. Some banks offer monthly compounding for better returns.'
                },
                {
                  q: 'What is the Rule of 72 in compound interest?',
                  a: 'Rule of 72 is a quick formula to estimate how long it takes for money to double. Divide 72 by your annual interest rate. At 12% return, money doubles in approximately 6 years (72/12 = 6).'
                },
                {
                  q: 'Can I download the compound interest calculation as PDF?',
                  a: 'Yes, our calculator provides a free PDF download option. Click the "PDF" button in the results section to download your complete calculation report.'
                },
                {
                  q: 'Is this compound interest calculator free?',
                  a: 'Absolutely! SmartFintool\'s compound interest calculator is 100% free, requires no registration, and can be used unlimited times.'
                },
                {
                  q: 'Is compound interest taxable in India?',
                  a: 'Yes. Interest income from FD compounding is taxable as per income tax slab. Mutual fund gains have separate capital gains tax rules - LTCG above ₹1.25 lakh is taxed at 12.5% for equity funds.'
                },
              ].map((faq, idx) => (
                <details key={idx} className="group bg-gray-50 rounded-lg border border-gray-200 hover:border-emerald-300 transition-colors">
                  <summary className="cursor-pointer p-4 font-semibold text-gray-900 flex items-center justify-between">
                    <span>{faq.q}</span>
                    <span className="text-emerald-600 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="px-4 pb-4 text-gray-700 leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Related Calculators - Internal Linking for SEO */}
      <section className="mt-8" aria-labelledby="related">
        <Card className="shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <h3 id="related" className="text-2xl font-bold text-gray-900 mb-4">
              Related Financial Calculators
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { name: 'SIP Calculator', url: '/' },
                { name: 'SWP Calculator', url: '/swp' },
                { name: 'Lumpsum Calculator', url: '/lumpsum' },
                { name: 'Simple Interest Calculator', url: '/simple' },
                { name: 'Resources & Blog', url: '/resources' },
                { name: 'Comparisons', url: '/comparisons' },
              ].map((calc, idx) => (
                <a 
                  key={idx} 
                  href={calc.url} 
                  className="block p-3 bg-emerald-50 hover:bg-emerald-100 rounded-lg text-center text-emerald-800 font-medium transition-colors border border-emerald-200"
                >
                  {calc.name}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Disclaimer - Important for Finance sites */}
      <section className="mt-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
          <p className="text-sm text-gray-700">
            <strong>Disclaimer:</strong> The calculations provided by this compound interest calculator are 
            for educational and illustrative purposes only. Actual returns may vary based on market conditions, 
            tax implications, and other factors. Please consult a SEBI-registered financial advisor before 
            making investment decisions.
          </p>
        </div>
      </section>
    </article>
  );
};

export default CompoundInterestCalculator;