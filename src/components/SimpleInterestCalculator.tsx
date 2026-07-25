import { useMemo, useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, Download, AlertTriangle, ArrowRight, BookOpen, HelpCircle, Target, Award, IndianRupee, BarChart3, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '@/components/ui/button';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { formatCurrency, formatNumber, downloadPDF } from '../lib/utils';
import { loadAdminSettings } from '@/lib/adminSettings';

// Lazy load charts
const Doughnut = lazy(() => import('react-chartjs-2').then(m => ({ default: m.Doughnut })));

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface SimpleInterestResult {
  interest: number;
  total: number;
  monthlyInterest: number;
  dailyInterest: number;
}

const SimpleInterestCalculator = () => {
  const navigate = useNavigate();
  const simpleDefaults = useMemo(() => loadAdminSettings().defaults.simple, []);
  const [principal, setPrincipal] = useState(simpleDefaults.principal);
  const [rate, setRate] = useState(simpleDefaults.rate);
  const [time, setTime] = useState(simpleDefaults.time);

  // ============ SCHEMA MARKUP (HowTo/Product only) ============
  // NOTE: title, meta description/keywords, Open Graph, Twitter, robots and
  // canonical are set GLOBALLY by App.tsx for every route. This component used
  // to overwrite them with a canonical of /simple-interest-calculator — a URL
  // that does not exist and is not in the sitemap. Google saw a canonical
  // pointing at a 404 and dropped /simple from the index. Removed on purpose.
  useEffect(() => {

    // ============ SCHEMA MARKUP ============
    const oldSchema = document.getElementById('si-schema');
    if (oldSchema) oldSchema.remove();

    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.id = 'si-schema';
    schemaScript.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebApplication",
          "name": "Simple Interest Calculator",
          "alternateName": "SI Calculator",
          "url": "https://smartfintool.com/simple",
          "description": "Free simple interest calculator with formula explanation",
          "applicationCategory": "FinanceApplication",
          "operatingSystem": "Any",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "2543",
            "bestRating": "5"
          },
          "author": {
            "@type": "Person",
            "name": "Rahul Kumar",
            "url": "https://smartfintool.com/about"
          }
        },
        {
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What is simple interest?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Simple interest is a quick method of calculating the interest charge on a loan or earned on deposits. It is determined by multiplying the principal amount by the interest rate by the number of years."
              }
            },
            {
              "@type": "Question",
              "name": "What is the formula for simple interest?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "The simple interest formula is: SI = (P × R × T) / 100, where P is the principal amount, R is the rate of interest per annum, and T is the time period in years."
              }
            },
            {
              "@type": "Question",
              "name": "How do you calculate simple interest with example?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Example: For ₹10,000 at 10% interest for 5 years: SI = (10000 × 10 × 5) / 100 = ₹5,000. Total amount = ₹15,000."
              }
            },
            {
              "@type": "Question",
              "name": "What is the difference between simple and compound interest?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Simple interest is calculated only on the principal amount. Compound interest is calculated on principal plus accumulated interest. Compound interest grows faster over time, making it better for investments but worse for loans."
              }
            },
            {
              "@type": "Question",
              "name": "Where is simple interest used in India?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Simple interest is commonly used for: car loans, short-term personal loans, treasury bills, some types of fixed deposits, money lent between individuals, and certain government bonds."
              }
            },
            {
              "@type": "Question",
              "name": "How to calculate simple interest for months?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "For months, use the formula: SI = (P × R × T) / (100 × 12), where T is the number of months. For days, divide by (100 × 365) instead."
              }
            }
          ]
        },
        {
          "@type": "HowTo",
          "name": "How to Calculate Simple Interest",
          "step": [
            { "@type": "HowToStep", "position": 1, "name": "Enter Principal", "text": "Input the initial loan or deposit amount" },
            { "@type": "HowToStep", "position": 2, "name": "Set Interest Rate", "text": "Enter the annual rate of interest in percentage" },
            { "@type": "HowToStep", "position": 3, "name": "Choose Duration", "text": "Select the time period in years" },
            { "@type": "HowToStep", "position": 4, "name": "View Result", "text": "Get instant simple interest calculation with total amount" }
          ]
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://smartfintool.com/" },
            { "@type": "ListItem", "position": 2, "name": "Simple Interest Calculator", "item": "https://smartfintool.com/simple" }
          ]
        }
      ]
    });
    document.head.appendChild(schemaScript);

    return () => {
      const schema = document.getElementById('si-schema');
      if (schema) schema.remove();
    };
  }, []);

  const result: SimpleInterestResult = useMemo(() => {
    const interest = (principal * rate * time) / 100;
    return { 
      interest, 
      total: principal + interest,
      monthlyInterest: interest / (time * 12),
      dailyInterest: interest / (time * 365)
    };
  }, [principal, rate, time]);

  // Memoized chart data
  const chartData = useMemo(() => ({
    labels: ['Principal Amount', 'Interest Earned'],
    datasets: [{
      data: [principal, result.interest],
      backgroundColor: ['#0f172a', '#f43f5e'],
      borderColor: ['#1e293b', '#e11d48'],
      borderWidth: 2,
      hoverOffset: 12,
    }],
  }), [principal, result.interest]);

  return (
    <article className="space-y-16 pb-32 font-inter max-w-7xl mx-auto px-4">
      
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-sm text-gray-600 pt-6">
        <ol className="flex items-center gap-2">
          <li><a href="/" className="hover:text-rose-600">Home</a></li>
          <li aria-hidden="true">/</li>
          <li className="text-rose-600 font-medium" aria-current="page">Simple Interest Calculator</li>
        </ol>
      </nav>

      {/* Section heading.
          This was an <h1>, which gave /simple two H1s — App.tsx already renders
          the page H1 in the hero, and the other four calculators correctly use
          an h2 here. Demoted to h2 to keep one H1 per document. */}
      <header className="text-center space-y-4">
        <h2 className="text-3xl sm:text-5xl font-black text-[#0f172a] tracking-tight">
          Simple Interest Calculator - SI Formula Calculator Online
        </h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Calculate simple interest instantly using the SI formula (P × R × T) / 100. 
          Free online calculator for loans, fixed deposits, savings with monthly & daily interest breakdown.
        </p>
      </header>

      {/* --- CALCULATOR SECTION (Preserved Premium Design) --- */}
      <section aria-labelledby="calculator-section">
        <h2 id="calculator-section" className="sr-only">Simple Interest Calculator Tool</h2>

        <div className="space-y-12">
          <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            <Card className="shadow-2xl border-none rounded-[2.5rem] bg-white p-8 border-t-8 border-rose-500">
              <CardHeader className="px-0">
                <CardTitle className="flex items-center gap-3 font-black text-[#0f172a]">
                  <Calculator className="text-rose-500" aria-hidden="true" /> SI CALCULATOR
                </CardTitle>
              </CardHeader>

              <CardContent className="px-0 space-y-10">
                {/* Principal */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-400">
                    <label htmlFor="principal-amount" className="flex items-center gap-2">
                      <IndianRupee className="w-3 h-3" aria-hidden="true" /> Principal
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-rose-600">{'\u20B9'}</span>
                      <input 
                        id="principal-amount"
                        type="number" 
                        min={1000} 
                        max={1000000} 
                        step={1000} 
                        value={principal} 
                        onChange={(e) => setPrincipal(Number(e.target.value))} 
                        className="w-32 rounded-xl border-2 border-rose-200 px-2 py-1 text-right text-sm font-black text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
                        aria-label="Principal amount in rupees"
                      />
                    </div>
                  </div>
                  <input 
                    type="range" 
                    min="1000" 
                    max="1000000" 
                    step="1000" 
                    value={principal} 
                    onChange={(e) => setPrincipal(Number(e.target.value))} 
                    className="w-full accent-rose-500 h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer"
                    aria-label="Principal amount slider"
                  />
                  <p className="text-right text-xs font-semibold text-rose-700">{'\u20B9'} {formatNumber(principal)}</p>
                </div>

                {/* Rate */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-400">
                    <label htmlFor="interest-rate" className="flex items-center gap-2">
                      <BarChart3 className="w-3 h-3" aria-hidden="true" /> Rate (%)
                    </label>
                    <div className="flex items-center gap-2">
                      <input 
                        id="interest-rate"
                        type="number" 
                        min={1} 
                        max={50} 
                        step={0.5} 
                        value={rate} 
                        onChange={(e) => setRate(Number(e.target.value))} 
                        className="w-24 rounded-xl border-2 border-rose-200 px-2 py-1 text-right text-sm font-black text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
                        aria-label="Annual interest rate in percentage"
                      />
                      <span className="text-rose-600">%</span>
                    </div>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="50" 
                    step="0.5" 
                    value={rate} 
                    onChange={(e) => setRate(Number(e.target.value))} 
                    className="w-full accent-rose-500 h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer"
                    aria-label="Interest rate slider"
                  />
                </div>

                {/* Time */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-400">
                    <label htmlFor="time-period" className="flex items-center gap-2">
                      <Clock className="w-3 h-3" aria-hidden="true" /> Time (Years)
                    </label>
                    <div className="flex items-center gap-2">
                      <input 
                        id="time-period"
                        type="number" 
                        min={1} 
                        max={30} 
                        step={1} 
                        value={time} 
                        onChange={(e) => setTime(Number(e.target.value))} 
                        className="w-24 rounded-xl border-2 border-rose-200 px-2 py-1 text-right text-sm font-black text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
                        aria-label="Time period in years"
                      />
                      <span className="text-rose-600">Yrs</span>
                    </div>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="30" 
                    step="1" 
                    value={time} 
                    onChange={(e) => setTime(Number(e.target.value))} 
                    className="w-full accent-rose-500 h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer"
                    aria-label="Time period slider"
                  />
                </div>

                {/* Live Formula Display */}
                <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-4">
                  <p className="text-[10px] font-black uppercase text-rose-600 mb-2">Live Calculation</p>
                  <p className="text-sm font-mono text-gray-800">
                    SI = ({formatNumber(principal)} × {rate} × {time}) / 100
                  </p>
                  <p className="text-lg font-black text-rose-700 mt-2">
                    = {'\u20B9'} {formatNumber(result.interest)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-2xl border-none rounded-[3rem] bg-[#0f172a] text-white p-10 flex flex-col justify-center" id="si-results">
              <div className="text-center space-y-8">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Total Interest</p>
                  <p className="text-5xl sm:text-7xl font-black text-rose-400 italic">{formatCurrency(result.interest)}</p>
                </div>
                
                <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 flex items-center justify-between px-8">
                  <span className="text-xs font-bold text-blue-300">Total Amount</span>
                  <span className="text-2xl sm:text-3xl font-black">{formatCurrency(result.total)}</span>
                </div>

                {/* Additional Insights */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="text-[9px] font-bold text-emerald-300 uppercase mb-1">Monthly Interest</p>
                    <p className="text-base font-black">{formatCurrency(result.monthlyInterest)}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="text-[9px] font-bold text-amber-300 uppercase mb-1">Daily Interest</p>
                    <p className="text-base font-black">{formatCurrency(result.dailyInterest)}</p>
                  </div>
                </div>

                <Button 
                  onClick={() => downloadPDF('si-results', 'SI-Report.pdf')} 
                  className="w-full bg-rose-600 hover:bg-rose-500 py-8 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-rose-600/30"
                  aria-label="Download Simple Interest report"
                >
                  <Download className="mr-3 w-5 h-5" aria-hidden="true" /> Download Report
                </Button>
              </div>
            </Card>
          </div>

          {/* Chart */}
          <Card className="shadow-xl border-none rounded-[2.5rem] bg-white p-8">
            <h2 className="font-black text-[#0f172a] mb-6 uppercase tracking-widest text-xs border-l-4 border-rose-500 pl-4 italic">
              Principal vs Interest Breakdown
            </h2>
            <div className="h-[280px]">
              <Suspense fallback={<div className="flex items-center justify-center h-full text-gray-400">Loading chart...</div>}>
                <Doughnut 
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: { font: { weight: 'bold', size: 13 }, padding: 20, usePointStyle: true }
                      },
                      tooltip: {
                        callbacks: {
                          label: (ctx) => `${ctx.label}: ${formatCurrency(Number(ctx.raw ?? 0))}`
                        }
                      }
                    }
                  }}
                />
              </Suspense>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA to SIP */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-3xl border-2 border-purple-200 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <AlertTriangle className="text-purple-500 w-8 h-8 shrink-0" aria-hidden="true" />
          <p className="text-sm text-purple-900 font-medium">
            <strong>Simple Interest grows linearly.</strong> For exponential wealth growth, try SIP investment instead!
          </p>
        </div>
        <button 
          onClick={() => navigate('/sip-calculator')}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all"
        >
          Try SIP Calculator <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* ============ SI EXAMPLES TABLE (KEYWORD GOLDMINE) ============ */}
      <section className="bg-white p-8 sm:p-12 rounded-[3rem] shadow-xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-[#0f172a] mb-3">
            Simple Interest Calculator Examples
          </h2>
          <p className="text-gray-600">Quick reference for common loan & deposit scenarios at 8% per annum</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-rose-500 text-white">
                <th className="p-4 text-left border border-rose-600">Principal</th>
                <th className="p-4 text-left border border-rose-600">1 Year SI</th>
                <th className="p-4 text-left border border-rose-600">3 Years SI</th>
                <th className="p-4 text-left border border-rose-600">5 Years SI</th>
                <th className="p-4 text-left border border-rose-600">10 Years SI</th>
                <th className="p-4 text-left border border-rose-600">Total (10 Yrs)</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="bg-white hover:bg-rose-50"><td className="p-3 border font-bold">₹10,000</td><td className="p-3 border">₹800</td><td className="p-3 border">₹2,400</td><td className="p-3 border">₹4,000</td><td className="p-3 border">₹8,000</td><td className="p-3 border text-rose-700 font-bold">₹18,000</td></tr>
              <tr className="bg-gray-50 hover:bg-rose-50"><td className="p-3 border font-bold">₹50,000</td><td className="p-3 border">₹4,000</td><td className="p-3 border">₹12,000</td><td className="p-3 border">₹20,000</td><td className="p-3 border">₹40,000</td><td className="p-3 border text-rose-700 font-bold">₹90,000</td></tr>
              <tr className="bg-white hover:bg-rose-50"><td className="p-3 border font-bold">₹1,00,000</td><td className="p-3 border">₹8,000</td><td className="p-3 border">₹24,000</td><td className="p-3 border">₹40,000</td><td className="p-3 border">₹80,000</td><td className="p-3 border text-rose-700 font-bold">₹1.80 L</td></tr>
              <tr className="bg-gray-50 hover:bg-rose-50"><td className="p-3 border font-bold">₹5,00,000</td><td className="p-3 border">₹40,000</td><td className="p-3 border">₹1.20 L</td><td className="p-3 border">₹2 L</td><td className="p-3 border">₹4 L</td><td className="p-3 border text-rose-700 font-bold">₹9 L</td></tr>
              <tr className="bg-white hover:bg-rose-50"><td className="p-3 border font-bold">₹10,00,000</td><td className="p-3 border">₹80,000</td><td className="p-3 border">₹2.40 L</td><td className="p-3 border">₹4 L</td><td className="p-3 border">₹8 L</td><td className="p-3 border text-rose-700 font-bold">₹18 L</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-4 italic">*All calculations at 8% per annum simple interest rate.</p>
      </section>

      {/* ============ SEO MEGA CONTENT ============ */}
      <section className="bg-white p-12 sm:p-16 rounded-[3rem] shadow-xl">
        <div className="grid md:grid-cols-2 gap-12">
          
          {/* What is Simple Interest */}
          <div className="space-y-6">
            <div className="flex gap-4 items-center">
              <div className="bg-rose-100 p-4 rounded-2xl">
                <BookOpen className="text-rose-500" aria-hidden="true" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a]">What is Simple Interest?</h2>
            </div>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                <strong>Simple Interest (SI)</strong> is a quick and straightforward method of calculating 
                the interest charge on a loan or earned on a deposit. The interest is calculated only on 
                the original principal amount and doesn't compound over time.
              </p>
              <p>
                Unlike compound interest where interest earns interest, simple interest provides 
                <strong> linear growth</strong>. This makes it ideal for short-term loans, certain bonds, 
                and basic financial calculations.
              </p>
              <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-lg">
                <p className="text-sm">
                  <strong>हिंदी में:</strong> साधारण ब्याज (Simple Interest) सिर्फ मूल राशि पर लगाया जाता है। 
                  समय बढ़ने पर भी ब्याज की राशि हर साल समान रहती है। यह छोटी अवधि के लोन और बेसिक हिसाब के लिए सबसे अच्छा है।
                </p>
              </div>
            </div>

            <h3 className="text-xl font-black text-[#0f172a] mt-8">Simple Interest Formula</h3>
            <div className="bg-gray-900 text-white p-6 rounded-2xl">
              <p className="text-2xl font-mono font-bold text-rose-400 text-center">
                SI = (P × R × T) / 100
              </p>
              <ul className="mt-4 text-sm text-gray-300 space-y-1">
                <li>• <strong>SI</strong> = Simple Interest</li>
                <li>• <strong>P</strong> = Principal Amount</li>
                <li>• <strong>R</strong> = Rate of Interest per annum (%)</li>
                <li>• <strong>T</strong> = Time period in years</li>
              </ul>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-sm text-emerald-400 font-bold">Total Amount = Principal + Simple Interest</p>
                <p className="text-sm font-mono text-emerald-300">A = P + SI = P(1 + RT/100)</p>
              </div>
            </div>
          </div>

          {/* When Used + Example */}
          <div className="space-y-6">
            <div className="flex gap-4 items-center">
              <div className="bg-blue-100 p-4 rounded-2xl">
                <TrendingUp className="text-blue-500" aria-hidden="true" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a]">Where is SI Used?</h2>
            </div>
            <div className="space-y-3">
              {[
                { title: 'Car Loans', desc: 'Most auto loans use simple interest method' },
                { title: 'Personal Loans (Short-term)', desc: 'Quick personal loans often use SI' },
                { title: 'Treasury Bills', desc: 'Government short-term securities' },
                { title: 'Certificate of Deposits', desc: 'Some CDs use simple interest' },
                { title: 'Inter-personal Lending', desc: 'Money lent between individuals' },
                { title: 'Educational Examples', desc: 'Most school-level math problems' },
              ].map((item, idx) => (
                <div key={idx} className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                  <h3 className="font-bold text-blue-900">{item.title}</h3>
                  <p className="text-sm text-gray-700 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-black text-[#0f172a] mt-8">Solved Example</h3>
            <div className="bg-emerald-50 border-2 border-emerald-200 p-6 rounded-2xl">
              <p className="text-sm text-gray-800 mb-3">
                <strong>Problem:</strong> Calculate simple interest on ₹50,000 at 10% per annum for 5 years.
              </p>
              <div className="bg-white p-4 rounded-xl space-y-2 font-mono text-sm">
                <p>Given: P = ₹50,000, R = 10%, T = 5 years</p>
                <p>SI = (P × R × T) / 100</p>
                <p>SI = (50,000 × 10 × 5) / 100</p>
                <p>SI = 25,00,000 / 100</p>
                <p className="text-emerald-700 font-bold text-lg">SI = ₹25,000</p>
                <p className="border-t pt-2 mt-2">Total Amount = 50,000 + 25,000 = <strong>₹75,000</strong></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple vs Compound Comparison */}
      <section className="bg-white p-8 sm:p-12 rounded-[3rem] shadow-xl">
        <h2 className="text-3xl sm:text-4xl font-black text-[#0f172a] text-center mb-8">
          Simple Interest vs Compound Interest
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-rose-500 text-white">
                <th className="p-4 text-left border">Parameter</th>
                <th className="p-4 text-left border">Simple Interest</th>
                <th className="p-4 text-left border">Compound Interest</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="bg-white"><td className="p-3 border font-bold">Calculation Base</td><td className="p-3 border">Only on principal</td><td className="p-3 border">Principal + accumulated interest</td></tr>
              <tr className="bg-gray-50"><td className="p-3 border font-bold">Formula</td><td className="p-3 border font-mono">SI = (P×R×T)/100</td><td className="p-3 border font-mono">A = P(1+r/n)^(nt)</td></tr>
              <tr className="bg-white"><td className="p-3 border font-bold">Growth Pattern</td><td className="p-3 border">Linear (constant)</td><td className="p-3 border text-emerald-600 font-bold">Exponential (faster)</td></tr>
              <tr className="bg-gray-50"><td className="p-3 border font-bold">Returns on ₹1L @10% for 10 yrs</td><td className="p-3 border">₹1,00,000</td><td className="p-3 border text-emerald-600 font-bold">₹1,59,374</td></tr>
              <tr className="bg-white"><td className="p-3 border font-bold">Best For Borrowers</td><td className="p-3 border text-emerald-600 font-bold">Yes (less to pay)</td><td className="p-3 border text-red-600">No (more to pay)</td></tr>
              <tr className="bg-gray-50"><td className="p-3 border font-bold">Best For Investors</td><td className="p-3 border text-red-600">No (less returns)</td><td className="p-3 border text-emerald-600 font-bold">Yes (more returns)</td></tr>
              <tr className="bg-white"><td className="p-3 border font-bold">Used In</td><td className="p-3 border">Car loans, T-bills</td><td className="p-3 border">FDs, mutual funds, savings</td></tr>
              <tr className="bg-gray-50"><td className="p-3 border font-bold">Complexity</td><td className="p-3 border text-emerald-600">Very Simple</td><td className="p-3 border">Moderate</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white p-8 sm:p-12 rounded-[3rem] shadow-xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-[#0f172a] flex items-center justify-center gap-3">
            <HelpCircle className="w-10 h-10 text-rose-500" aria-hidden="true" />
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 mt-3">Everything about Simple Interest calculations</p>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          {[
            {
              q: 'What is simple interest?',
              a: 'Simple Interest (SI) is interest calculated only on the original principal amount throughout the loan or deposit period. Unlike compound interest, it doesn\'t earn interest on previously earned interest, providing linear growth.'
            },
            {
              q: 'What is the formula for simple interest?',
              a: 'The simple interest formula is: SI = (P × R × T) / 100, where P is Principal, R is annual Rate of interest, and T is Time in years. To find total amount, use: A = P + SI = P(1 + RT/100).'
            },
            {
              q: 'How do you calculate simple interest with example?',
              a: 'Example: For ₹10,000 at 10% interest for 5 years: SI = (10000 × 10 × 5) / 100 = ₹5,000. So total amount payable/receivable = ₹10,000 + ₹5,000 = ₹15,000.'
            },
            {
              q: 'How to calculate simple interest for months?',
              a: 'For monthly calculation: SI = (P × R × T) / (100 × 12), where T is months. Example: ₹10,000 at 12% for 6 months = (10000 × 12 × 6) / (100 × 12) = ₹600.'
            },
            {
              q: 'How to calculate simple interest for days?',
              a: 'For daily calculation: SI = (P × R × T) / (100 × 365), where T is number of days. Example: ₹10,000 at 10% for 90 days = (10000 × 10 × 90) / (100 × 365) = ₹246.58.'
            },
            {
              q: 'What is the difference between simple and compound interest?',
              a: 'Simple interest is calculated only on the principal amount. Compound interest is calculated on principal plus accumulated interest. CI grows exponentially faster than SI - so CI is better for investments but worse for loans.'
            },
            {
              q: 'Which is better - simple or compound interest?',
              a: 'For BORROWERS: Simple interest is better (you pay less). For INVESTORS: Compound interest is better (you earn more). Example: ₹1 lakh at 10% for 10 years = SI ₹1 lakh vs CI ₹1.59 lakh interest.'
            },
            {
              q: 'Where is simple interest used in India?',
              a: 'Simple interest is commonly used for: (1) Car loans and auto financing, (2) Short-term personal loans, (3) Treasury Bills (T-Bills), (4) Some types of bonds, (5) Money lent between individuals, (6) Educational math problems.'
            },
            {
              q: 'Do banks use simple or compound interest?',
              a: 'Banks mostly use compound interest for: Savings accounts, Fixed Deposits (FDs), Recurring Deposits (RDs), Home loans, EMI loans. They use simple interest for: Some auto loans, certain short-term loans, T-bills.'
            },
            {
              q: 'How to find principal from simple interest?',
              a: 'To find Principal: P = (SI × 100) / (R × T). Example: If SI is ₹2,000 at 8% for 5 years, then P = (2000 × 100) / (8 × 5) = ₹5,000.'
            },
            {
              q: 'How to find rate of interest in simple interest?',
              a: 'To find Rate: R = (SI × 100) / (P × T). Example: For SI ₹500 on ₹10,000 for 1 year, R = (500 × 100) / (10000 × 1) = 5% per annum.'
            },
            {
              q: 'Is this simple interest calculator free?',
              a: 'Yes! SmartFintool\'s Simple Interest Calculator is 100% free, requires no signup, and offers unlimited calculations. You can also download your calculation as a PDF report for free.'
            },
          ].map((faq, idx) => (
            <details key={idx} className="group bg-gradient-to-r from-rose-50 to-white rounded-2xl border-2 border-rose-100 hover:border-rose-300 transition-all overflow-hidden">
              <summary className="cursor-pointer p-5 font-black text-[#0f172a] flex items-center justify-between text-sm sm:text-base">
                <span>{faq.q}</span>
                <span className="text-rose-500 group-open:rotate-180 transition-transform text-xl flex-shrink-0 ml-3">▼</span>
              </summary>
              <div className="px-5 pb-5 text-gray-700 leading-relaxed text-sm border-t border-rose-100 pt-4">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Related Calculators */}
      <section className="bg-gradient-to-br from-rose-50 to-pink-50 p-8 sm:p-12 rounded-[3rem]">
        <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] text-center mb-8 flex items-center justify-center gap-3">
          <Target className="w-8 h-8 text-rose-500" aria-hidden="true" />
          Related Financial Calculators
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {[
            { name: 'Compound Interest', url: '/compound-interest', desc: 'CI calculator' },
            { name: 'EMI Calculator', url: '/emi-calculator', desc: 'Loan EMI' },
            { name: 'FD Calculator', url: '/fd-calculator', desc: 'Fixed deposit' },
            { name: 'RD Calculator', url: '/rd-calculator', desc: 'Recurring deposit' },
            { name: 'PPF Calculator', url: '/ppf-calculator', desc: 'PPF returns' },
            { name: 'SIP Calculator', url: '/sip-calculator', desc: 'Mutual fund SIP' },
            { name: 'Lumpsum Calculator', url: '/lumpsum-calculator', desc: 'One-time invest' },
            { name: 'Loan EMI', url: '/loan-emi-calculator', desc: 'Personal/home loan' },
          ].map((calc, idx) => (
            <a 
              key={idx} 
              href={calc.url} 
              className="block p-5 bg-white rounded-2xl text-center hover:shadow-xl transition-all border-2 border-transparent hover:border-rose-300 group"
            >
              <p className="font-black text-sm text-[#0f172a] group-hover:text-rose-600 transition-colors">{calc.name}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">{calc.desc}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white p-8 sm:p-12 rounded-[3rem] shadow-xl">
        <h2 className="text-3xl font-black text-[#0f172a] text-center mb-8 flex items-center justify-center gap-3">
          <Award className="w-8 h-8 text-rose-500" aria-hidden="true" />
          Why Use SmartFintool SI Calculator?
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {[
            { icon: '⚡', title: 'Instant Results', desc: 'Get accurate calculations in milliseconds' },
            { icon: '🎯', title: '100% Accurate', desc: 'Uses standard SI formula (P×R×T)/100' },
            { icon: '📱', title: 'Mobile Friendly', desc: 'Works perfectly on all devices' },
            { icon: '🆓', title: 'Always Free', desc: 'No signup, no payment ever required' },
            { icon: '📊', title: 'Visual Charts', desc: 'See breakdown with interactive charts' },
            { icon: '📄', title: 'PDF Download', desc: 'Save your calculations as PDF report' },
          ].map((item, idx) => (
            <div key={idx} className="bg-rose-50 p-6 rounded-2xl border-2 border-rose-100">
              <p className="text-4xl mb-3">{item.icon}</p>
              <h3 className="font-black text-[#0f172a] mb-2">{item.title}</h3>
              <p className="text-sm text-gray-700">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <div className="bg-red-50 p-8 sm:p-12 rounded-[3rem] border-4 border-dashed border-red-200 text-center space-y-4">
        <AlertTriangle className="w-16 h-16 text-red-600 mx-auto animate-pulse" aria-hidden="true" />
        <h2 className="text-red-900 font-black uppercase tracking-widest italic">Important Disclaimer</h2>
        <p className="text-red-800 text-sm font-bold italic leading-relaxed max-w-4xl mx-auto">
          "The Simple Interest Calculator provides calculations for educational and informational purposes only. 
          For actual loan or investment decisions, please verify with your bank or financial institution as 
          actual interest calculations may include additional charges, processing fees, or different compounding methods. 
          Consult a financial advisor for personalized advice. Content by Rahul Kumar for SmartFintool."
        </p>
      </div>

    </article>
  );
};

export default SimpleInterestCalculator;