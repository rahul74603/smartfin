import { useMemo, useState, useEffect, lazy, Suspense } from 'react';
import { Wallet, Download, BarChart3, Clock, TrendingDown, BookOpen, HelpCircle, AlertTriangle, Target, Award, Calculator, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Filler, Legend, ArcElement
} from 'chart.js';
import { formatCurrency, formatNumber, downloadPDF } from '../lib/utils';
import { loadAdminSettings } from '@/lib/adminSettings';

// Lazy load charts
const Line = lazy(() => import('react-chartjs-2').then(m => ({ default: m.Line })));

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend, ArcElement);

interface SWPResult {
  totalWithdrawn: number;
  balance: number;
  monthsLasted: number;
  totalInterestEarned: number;
  yearlyData: { year: number; balance: number; withdrawn: number }[];
}

const SWPCalculator = () => {
  const navigate = useNavigate();
  const swpDefaults = useMemo(() => loadAdminSettings().defaults.swp, []);
  const [totalInvestment, setTotalInvestment] = useState(swpDefaults.totalInvestment);
  const [withdrawalAmount, setWithdrawalAmount] = useState(swpDefaults.withdrawalAmount);
  const [expectedReturn, setExpectedReturn] = useState(swpDefaults.expectedReturn);
  const [tenure, setTenure] = useState(swpDefaults.tenure);

  // ============ SCHEMA MARKUP (Only HowTo - No Duplicates) ============
  // NOTE: Title, Meta, Canonical, FAQPage, WebApplication, BreadcrumbList
  // are handled GLOBALLY in App.tsx to avoid duplicates.
  // We keep only HowTo schema here as it's unique to this calculator.
  useEffect(() => {
    const oldSchema = document.getElementById('swp-howto-schema');
    if (oldSchema) oldSchema.remove();

    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.id = 'swp-howto-schema';
    schemaScript.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Calculate SWP Returns",
      "description": "Step by step guide to calculate Systematic Withdrawal Plan returns using SmartFintool SWP Calculator",
      "totalTime": "PT2M",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "Enter Investment Amount", "text": "Input your total mutual fund corpus amount that you want to use for systematic withdrawal." },
        { "@type": "HowToStep", "position": 2, "name": "Set Monthly Withdrawal", "text": "Enter the fixed amount you want to withdraw every month for regular income." },
        { "@type": "HowToStep", "position": 3, "name": "Expected Return", "text": "Set the expected annual return rate of your investment (typically 8-12% for hybrid funds)." },
        { "@type": "HowToStep", "position": 4, "name": "Choose Tenure", "text": "Select the number of years you want the SWP to continue for retirement planning." },
        { "@type": "HowToStep", "position": 5, "name": "View Results", "text": "See total withdrawn amount, final balance, and how long your corpus will last." }
      ]
    });
    document.head.appendChild(schemaScript);

    return () => {
      const schema = document.getElementById('swp-howto-schema');
      if (schema) schema.remove();
    };
  }, []);

  // Enhanced calculation with yearly data
  const result: SWPResult = useMemo(() => {
    let balance = totalInvestment;
    const monthlyReturn = expectedReturn / 100 / 12;
    const months = tenure * 12;
    let totalWithdrawn = 0;
    let monthsLasted = 0;
    const yearlyData: { year: number; balance: number; withdrawn: number }[] = [
      { year: 0, balance: totalInvestment, withdrawn: 0 }
    ];

    for (let i = 0; i < months; i++) {
      balance = (balance - withdrawalAmount) * (1 + monthlyReturn);
      totalWithdrawn += withdrawalAmount;
      monthsLasted = i + 1;
      
      if ((i + 1) % 12 === 0) {
        yearlyData.push({ 
          year: (i + 1) / 12, 
          balance: Math.max(0, Math.round(balance)), 
          withdrawn: totalWithdrawn 
        });
      }
      
      if (balance < 0) {
        balance = 0;
        break;
      }
    }

    const totalInterestEarned = (totalWithdrawn + balance) - totalInvestment;

    return { totalWithdrawn, balance, monthsLasted, totalInterestEarned, yearlyData };
  }, [totalInvestment, withdrawalAmount, expectedReturn, tenure]);

  // Chart data for balance over time
  const chartData = useMemo(() => ({
    labels: result.yearlyData.map(d => `Year ${d.year}`),
    datasets: [
      {
        label: 'Remaining Balance',
        data: result.yearlyData.map(d => d.balance),
        borderColor: '#10b981',
        borderWidth: 4,
        tension: 0.4,
        fill: true,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        pointRadius: 4,
        pointBackgroundColor: '#fff',
        pointBorderWidth: 3
      }
    ]
  }), [result.yearlyData]);

  return (
    <article className="space-y-12 sm:space-y-16 pb-20 sm:pb-32 font-inter max-w-7xl mx-auto px-4">
      
      {/* Breadcrumb (Visual only - schema handled in App.tsx) */}
      <nav aria-label="Breadcrumb" className="text-sm text-gray-600 pt-6">
        <ol className="flex items-center gap-2">
          <li><a href="/" className="hover:text-purple-600">Home</a></li>
          <li>/</li>
          <li><a href="/" className="hover:text-purple-600">Calculators</a></li>
          <li>/</li>
          <li className="text-purple-700 font-medium">SWP Calculator</li>
        </ol>
      </nav>

      {/* H2 Subheading (H1 is in App.tsx hero section) */}
      <header className="text-center space-y-4">
        <h2 className="text-3xl sm:text-5xl font-black text-[#0f172a] tracking-tight">
          SWP Calculator - Systematic Withdrawal Plan Calculator India
        </h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Plan your retirement income with our free SWP Calculator. Calculate monthly withdrawals 
          from your mutual fund corpus, see how long your money will last, and download detailed PDF reports.
        </p>
      </header>

      {/* --- CALCULATOR SECTION (Preserved Premium Design) --- */}
      <section aria-labelledby="calculator-section">
        <h2 id="calculator-section" className="sr-only">SWP Calculator Tool</h2>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* INPUT CARD */}
          <Card className="shadow-2xl border-none rounded-[2.5rem] bg-white p-8 border-t-8 border-purple-600">
            <CardHeader className="px-0">
              <CardTitle className="flex gap-3 text-[#0f172a] font-black uppercase tracking-tight">
                <Wallet className="text-purple-600" aria-hidden="true" /> SWP Planning
              </CardTitle>
            </CardHeader>

            <CardContent className="px-0 space-y-10 pt-6">
              {/* Lumpsum Amount */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-400">
                  <label htmlFor="lumpsum-amount" className="flex items-center gap-2">
                    <Wallet className="w-3 h-3" aria-hidden="true" /> Lumpsum Amount
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-600">{'\u20B9'}</span>
                    <input 
                      id="lumpsum-amount"
                      type="number" 
                      min={100000} 
                      max={10000000} 
                      step={50000} 
                      value={totalInvestment} 
                      onChange={(e) => setTotalInvestment(Number(e.target.value))} 
                      className="w-32 rounded-xl border-2 border-purple-200 px-2 py-1 text-right text-sm font-black text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      aria-label="Total investment amount in rupees"
                    />
                  </div>
                </div>
                <input 
                  type="range" 
                  min="100000" 
                  max="10000000" 
                  step="50000" 
                  value={totalInvestment} 
                  onChange={(e) => setTotalInvestment(Number(e.target.value))} 
                  className="w-full accent-purple-600 h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer"
                  aria-label="Lumpsum amount slider"
                />
                <p className="text-right text-xs font-semibold text-purple-700">{'\u20B9'} {formatNumber(totalInvestment)}</p>
              </div>

              {/* Monthly Withdrawal */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-400">
                  <label htmlFor="withdrawal-amount" className="flex items-center gap-2">
                    <TrendingDown className="w-3 h-3" aria-hidden="true" /> Withdrawal / Month
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-600">{'\u20B9'}</span>
                    <input 
                      id="withdrawal-amount"
                      type="number" 
                      min={1000} 
                      max={100000} 
                      step={1000} 
                      value={withdrawalAmount} 
                      onChange={(e) => setWithdrawalAmount(Number(e.target.value))} 
                      className="w-32 rounded-xl border-2 border-purple-200 px-2 py-1 text-right text-sm font-black text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      aria-label="Monthly withdrawal amount in rupees"
                    />
                  </div>
                </div>
                <input 
                  type="range" 
                  min="1000" 
                  max="100000" 
                  step="1000" 
                  value={withdrawalAmount} 
                  onChange={(e) => setWithdrawalAmount(Number(e.target.value))} 
                  className="w-full accent-purple-600 h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer"
                  aria-label="Withdrawal amount slider"
                />
                <p className="text-right text-xs font-semibold text-purple-700">{'\u20B9'} {formatNumber(withdrawalAmount)}</p>
              </div>

              {/* Expected Return */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-400">
                  <label htmlFor="expected-return" className="flex items-center gap-2">
                    <BarChart3 className="w-3 h-3" aria-hidden="true" /> Expected Return (%)
                  </label>
                  <div className="flex items-center gap-2">
                    <input 
                      id="expected-return"
                      type="number" 
                      min={1} 
                      max={30} 
                      step={0.5} 
                      value={expectedReturn} 
                      onChange={(e) => setExpectedReturn(Number(e.target.value))} 
                      className="w-24 rounded-xl border-2 border-purple-200 px-2 py-1 text-right text-sm font-black text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      aria-label="Expected annual return rate"
                    />
                    <span className="text-purple-600">%</span>
                  </div>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="30" 
                  step="0.5" 
                  value={expectedReturn} 
                  onChange={(e) => setExpectedReturn(Number(e.target.value))} 
                  className="w-full accent-purple-600 h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer"
                  aria-label="Return rate slider"
                />
              </div>

              {/* Tenure */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black uppercase text-gray-400">
                  <label htmlFor="tenure-years" className="flex items-center gap-2">
                    <Clock className="w-3 h-3" aria-hidden="true" /> Tenure (Years)
                  </label>
                  <div className="flex items-center gap-2">
                    <input 
                      id="tenure-years"
                      type="number" 
                      min={1} 
                      max={40} 
                      step={1} 
                      value={tenure} 
                      onChange={(e) => setTenure(Number(e.target.value))} 
                      className="w-24 rounded-xl border-2 border-purple-200 px-2 py-1 text-right text-sm font-black text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      aria-label="Tenure in years"
                    />
                    <span className="text-purple-600">Yrs</span>
                  </div>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="40" 
                  step="1" 
                  value={tenure} 
                  onChange={(e) => setTenure(Number(e.target.value))} 
                  className="w-full accent-purple-600 h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer"
                  aria-label="Tenure slider"
                />
              </div>

              {/* Warning if balance becomes zero */}
              {result.balance === 0 && result.monthsLasted < tenure * 12 && (
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
                  <p className="text-xs font-bold text-red-700 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>⚠️ Your corpus will exhaust in {Math.floor(result.monthsLasted / 12)} years {result.monthsLasted % 12} months! Reduce withdrawal or increase corpus.</span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* RESULT CARD - Preserved Premium Design */}
          <Card className="shadow-2xl border-none rounded-[2.5rem] sm:rounded-[3rem] bg-[#0f172a] text-white p-6 sm:p-10 flex flex-col justify-center text-center space-y-6 sm:space-y-8" id="swp-results">
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Amount Withdrawn</p>
              <p className="text-5xl sm:text-7xl font-black text-emerald-400">{formatCurrency(result.totalWithdrawn)}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
                <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-2">Final Balance</p>
                <p className="text-2xl sm:text-3xl font-black">{formatCurrency(result.balance)}</p>
              </div>
              <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
                <p className="text-[10px] font-bold text-purple-300 uppercase tracking-widest mb-2">Interest Earned</p>
                <p className="text-2xl sm:text-3xl font-black text-emerald-400">{formatCurrency(result.totalInterestEarned)}</p>
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-300 mb-1">Money Will Last</p>
              <p className="text-xl font-black text-amber-200">
                {Math.floor(result.monthsLasted / 12)} Years {result.monthsLasted % 12} Months
              </p>
            </div>

            <Button 
              onClick={() => downloadPDF('swp-results', 'SWP-Report.pdf')} 
              className="w-full bg-purple-600 hover:bg-purple-500 py-8 rounded-2xl font-black shadow-xl transition-all hover:scale-[1.02]"
              aria-label="Download SWP report"
            >
              <Download className="mr-2 w-5 h-5" aria-hidden="true" /> DOWNLOAD SUMMARY
            </Button>
          </Card>
        </div>
      </section>

      {/* --- BALANCE CHART --- */}
      <section aria-labelledby="chart-section">
        <Card className="bg-white rounded-[2.5rem] shadow-xl p-8 border-none">
          <h3 id="chart-section" className="font-black text-[#0f172a] mb-8 uppercase tracking-widest text-xs border-l-4 border-purple-600 pl-4 italic">
            Corpus Balance Over Time
          </h3>
          <div className="h-[300px]">
            <Suspense fallback={<div className="flex items-center justify-center h-full text-gray-400">Loading chart...</div>}>
              <Line 
                data={chartData}
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false, 
                  plugins: { 
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (ctx) => `Balance: ${formatCurrency(Number(ctx.raw ?? 0))}`
                      }
                    }
                  }, 
                  scales: { 
                    x: { grid: { display: false }, ticks: { font: { weight: 'bold' } } }, 
                    y: { 
                      grid: { color: 'rgba(0,0,0,0.05)' }, 
                      ticks: { 
                        font: { weight: 'bold' },
                        callback: (value) => formatCurrency(Number(value))
                      } 
                    } 
                  } 
                }} 
              />
            </Suspense>
          </div>
        </Card>
      </section>

      {/* --- NAVIGATION --- */}
      <nav aria-label="Related calculators">
        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
          <button 
            onClick={() => navigate('/')} 
            className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl flex justify-between items-center font-black text-xs uppercase hover:border-purple-600 transition-all group"
          >
            SIP Calculator <ArrowRight className="w-5 h-5 text-purple-600 group-hover:translate-x-2 transition-transform" aria-hidden="true" />
          </button>
          <button 
            onClick={() => navigate('/lumpsum')} 
            className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl flex justify-between items-center font-black text-xs uppercase hover:border-purple-600 transition-all group"
          >
            Lumpsum Tool <ArrowRight className="w-5 h-5 text-purple-600 group-hover:translate-x-2 transition-transform" aria-hidden="true" />
          </button>
        </div>
      </nav>

      {/* ============ SWP EXAMPLES TABLE (HIGH SEO VALUE) ============ */}
      <section className="bg-white p-8 sm:p-12 rounded-[3rem] shadow-xl">
        <div className="text-center mb-10">
          <h3 className="text-3xl sm:text-4xl font-black text-[#0f172a] mb-3">
            SWP Calculator Examples - How Much Monthly Income?
          </h3>
          <p className="text-gray-600">See monthly income possible from different corpus amounts (at 10% returns for 20 years)</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-purple-600 text-white">
                <th className="p-4 text-left border border-purple-700">Corpus Amount</th>
                <th className="p-4 text-left border border-purple-700">Monthly SWP</th>
                <th className="p-4 text-left border border-purple-700">Yearly Income</th>
                <th className="p-4 text-left border border-purple-700">Total Withdrawn (20 yrs)</th>
                <th className="p-4 text-left border border-purple-700">Final Balance</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="bg-white hover:bg-purple-50"><td className="p-3 border font-bold">₹10 Lakhs</td><td className="p-3 border">₹8,300</td><td className="p-3 border">₹99,600</td><td className="p-3 border">₹19.92 L</td><td className="p-3 border text-emerald-600 font-bold">~₹10 L</td></tr>
              <tr className="bg-gray-50 hover:bg-purple-50"><td className="p-3 border font-bold">₹25 Lakhs</td><td className="p-3 border">₹20,750</td><td className="p-3 border">₹2.49 L</td><td className="p-3 border">₹49.80 L</td><td className="p-3 border text-emerald-600 font-bold">~₹25 L</td></tr>
              <tr className="bg-white hover:bg-purple-50"><td className="p-3 border font-bold">₹50 Lakhs</td><td className="p-3 border">₹41,500</td><td className="p-3 border">₹4.98 L</td><td className="p-3 border">₹99.60 L</td><td className="p-3 border text-emerald-600 font-bold">~₹50 L</td></tr>
              <tr className="bg-gray-50 hover:bg-purple-50"><td className="p-3 border font-bold">₹75 Lakhs</td><td className="p-3 border">₹62,250</td><td className="p-3 border">₹7.47 L</td><td className="p-3 border">₹1.49 Cr</td><td className="p-3 border text-emerald-600 font-bold">~₹75 L</td></tr>
              <tr className="bg-white hover:bg-purple-50"><td className="p-3 border font-bold">₹1 Crore</td><td className="p-3 border">₹83,000</td><td className="p-3 border">₹9.96 L</td><td className="p-3 border">₹1.99 Cr</td><td className="p-3 border text-emerald-600 font-bold">~₹1 Cr</td></tr>
              <tr className="bg-gray-50 hover:bg-purple-50"><td className="p-3 border font-bold">₹2 Crore</td><td className="p-3 border">₹1,66,000</td><td className="p-3 border">₹19.92 L</td><td className="p-3 border">₹3.98 Cr</td><td className="p-3 border text-emerald-600 font-bold">~₹2 Cr</td></tr>
              <tr className="bg-white hover:bg-purple-50"><td className="p-3 border font-bold">₹5 Crore</td><td className="p-3 border">₹4,15,000</td><td className="p-3 border">₹49.80 L</td><td className="p-3 border">₹9.96 Cr</td><td className="p-3 border text-emerald-600 font-bold">~₹5 Cr</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-4 italic">*Calculated at 10% annual return for 20 years. SWP amount keeps corpus intact while providing regular income. Actual returns may vary.</p>
      </section>

      {/* ============ SEO MEGA CONTENT ============ */}
      <section className="bg-white p-12 sm:p-16 rounded-[3rem] shadow-xl">
        <div className="grid md:grid-cols-2 gap-12">
          
          {/* What is SWP */}
          <div className="space-y-6">
            <div className="flex gap-4 items-center">
              <div className="bg-purple-100 p-4 rounded-2xl">
                <BookOpen className="text-purple-600" aria-hidden="true" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#0f172a]">What is SWP?</h3>
            </div>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                <strong>SWP (Systematic Withdrawal Plan)</strong> is a facility offered by mutual funds 
                that allows investors to withdraw a fixed amount regularly from their investments. It's the 
                <strong> opposite of SIP</strong> - while SIP helps you accumulate wealth, SWP helps you 
                create regular income from accumulated wealth.
              </p>
              <p>
                SWP is particularly popular among <strong>retirees, senior citizens, and individuals 
                seeking passive income</strong>. You can choose to withdraw monthly, quarterly, or 
                semi-annually based on your needs.
              </p>
              <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded-r-lg">
                <p className="text-sm">
                  <strong>हिंदी में:</strong> SWP एक ऐसी सुविधा है जिसमें आप अपने म्यूचुअल फंड निवेश से 
                  हर महीने एक निश्चित राशि निकाल सकते हैं। यह रिटायरमेंट के बाद नियमित आय के लिए बेस्ट है।
                </p>
              </div>
            </div>

            <h4 className="text-xl font-black text-[#0f172a] mt-8">SWP Formula</h4>
            <div className="bg-gray-900 text-white p-6 rounded-2xl">
              <p className="text-lg font-mono">
                Future Value = PV × (1+r)<sup>n</sup> − PMT × [((1+r)<sup>n</sup> − 1) / r]
              </p>
              <ul className="mt-4 text-sm text-gray-300 space-y-1">
                <li>• PV = Present Value (Initial Corpus)</li>
                <li>• PMT = Monthly Withdrawal</li>
                <li>• r = Monthly Rate of Return</li>
                <li>• n = Number of Months</li>
              </ul>
            </div>
          </div>

          {/* Benefits of SWP */}
          <div className="space-y-6">
            <div className="flex gap-4 items-center">
              <div className="bg-emerald-100 p-4 rounded-2xl">
                <Award className="text-emerald-600" aria-hidden="true" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#0f172a]">Benefits of SWP</h3>
            </div>
            <div className="space-y-3">
              {[
                { title: 'Regular Income', desc: 'Get fixed monthly income like pension - perfect for retirees' },
                { title: 'Tax Efficient', desc: 'Only gains are taxed, not the full withdrawal amount' },
                { title: 'Flexibility', desc: 'Modify, pause, or stop withdrawals anytime without penalty' },
                { title: 'Capital Growth', desc: 'Remaining corpus continues earning returns' },
                { title: 'Inflation Beating', desc: 'Higher returns than FD (10-12% vs 6-7%)' },
                { title: 'No TDS', desc: 'No tax deducted at source unlike FD interest' },
              ].map((item, idx) => (
                <div key={idx} className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
                  <h4 className="font-bold text-emerald-900">{item.title}</h4>
                  <p className="text-sm text-gray-700 mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SIP vs SWP vs FD Comparison */}
      <section className="bg-white p-8 sm:p-12 rounded-[3rem] shadow-xl">
        <h3 className="text-3xl sm:text-4xl font-black text-[#0f172a] text-center mb-8">
          SWP vs SIP vs FD - Detailed Comparison
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-purple-600 text-white">
                <th className="p-4 text-left border">Parameter</th>
                <th className="p-4 text-left border">SWP</th>
                <th className="p-4 text-left border">SIP</th>
                <th className="p-4 text-left border">FD Interest</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="bg-white"><td className="p-3 border font-bold">Purpose</td><td className="p-3 border">Regular income</td><td className="p-3 border">Wealth accumulation</td><td className="p-3 border">Fixed interest income</td></tr>
              <tr className="bg-gray-50"><td className="p-3 border font-bold">Best For</td><td className="p-3 border">Retirees</td><td className="p-3 border">Working professionals</td><td className="p-3 border">Risk-averse investors</td></tr>
              <tr className="bg-white"><td className="p-3 border font-bold">Returns</td><td className="p-3 border text-green-600 font-bold">10-12%</td><td className="p-3 border text-green-600 font-bold">12-15%</td><td className="p-3 border">6-7.5%</td></tr>
              <tr className="bg-gray-50"><td className="p-3 border font-bold">Tax Efficiency</td><td className="p-3 border text-green-600">High (only gains taxed)</td><td className="p-3 border text-green-600">High</td><td className="p-3 border text-red-600">Low (full taxed)</td></tr>
              <tr className="bg-white"><td className="p-3 border font-bold">Flexibility</td><td className="p-3 border text-green-600">Very High</td><td className="p-3 border text-green-600">High</td><td className="p-3 border text-orange-600">Low (lock-in)</td></tr>
              <tr className="bg-gray-50"><td className="p-3 border font-bold">Risk Level</td><td className="p-3 border text-orange-600">Market-linked</td><td className="p-3 border text-orange-600">Market-linked</td><td className="p-3 border text-green-600">Very Low</td></tr>
              <tr className="bg-white"><td className="p-3 border font-bold">Capital Erosion</td><td className="p-3 border">Slow (with returns)</td><td className="p-3 border">N/A (accumulation)</td><td className="p-3 border">No erosion</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* How to Use SWP */}
      <section className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 sm:p-12 rounded-[3rem]">
        <h3 className="text-3xl sm:text-4xl font-black text-[#0f172a] text-center mb-8 flex items-center justify-center gap-3">
          <Calculator className="w-10 h-10 text-purple-600" aria-hidden="true" />
          How to Use SWP Calculator?
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { num: '1', title: 'Enter Lumpsum', desc: 'Input your total mutual fund corpus amount (₹1 Lakh to ₹1 Crore).' },
            { num: '2', title: 'Set Withdrawal', desc: 'Decide how much money you want every month from your investment.' },
            { num: '3', title: 'Expected Return', desc: 'Enter realistic annual returns (10-12% for hybrid funds is safe).' },
            { num: '4', title: 'Choose Tenure', desc: 'Select for how many years you want the SWP to continue.' },
            { num: '5', title: 'View Analysis', desc: 'See total withdrawn, final balance, and corpus longevity.' },
            { num: '6', title: 'Download PDF', desc: 'Get a detailed PDF report for retirement planning.' },
          ].map((step, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-lg">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-black text-xl mb-4">
                {step.num}
              </div>
              <h4 className="font-black text-lg text-[#0f172a] mb-2">{step.title}</h4>
              <p className="text-sm text-gray-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section (Visual Only - Schema handled in App.tsx) */}
      <section className="bg-white p-8 sm:p-12 rounded-[3rem] shadow-xl">
        <div className="text-center mb-10">
          <h3 className="text-3xl sm:text-4xl font-black text-[#0f172a] flex items-center justify-center gap-3">
            <HelpCircle className="w-10 h-10 text-purple-600" aria-hidden="true" />
            Frequently Asked Questions
          </h3>
          <p className="text-gray-600 mt-3">Everything about Systematic Withdrawal Plan (SWP)</p>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          {[
            {
              q: 'What is SWP in mutual funds?',
              a: 'SWP (Systematic Withdrawal Plan) is a facility where you withdraw a fixed amount regularly from your mutual fund investment. It\'s opposite of SIP - while SIP accumulates wealth, SWP provides regular income from accumulated wealth. Perfect for retirees and those seeking passive income.'
            },
            {
              q: 'How much SWP can I get from ₹1 Crore?',
              a: 'From ₹1 crore corpus at 10% expected return, you can withdraw approximately ₹83,000 per month for 20 years and still have ₹1 crore remaining! Or you can withdraw ₹1.2 lakh/month for about 12-13 years before corpus exhausts.'
            },
            {
              q: 'Is SWP better than FD interest?',
              a: 'Yes, SWP is typically better than FD interest because: (1) Higher returns 10-12% vs FD\'s 6-7%, (2) Tax efficient - only gains taxed not full amount, (3) No TDS unlike FD, (4) Flexible - modify anytime, (5) Better inflation protection over long term.'
            },
            {
              q: 'How is SWP calculated?',
              a: 'SWP works on iterative calculation: Each month, your withdrawal is deducted from corpus, then remaining balance earns monthly return. Formula: New Balance = (Previous Balance - Withdrawal) × (1 + Monthly Return). Our calculator does this for entire tenure instantly.'
            },
            {
              q: 'What is the difference between SIP and SWP?',
              a: 'SIP = Systematic Investment Plan (you INVEST money regularly). SWP = Systematic Withdrawal Plan (you WITHDRAW money regularly). SIP is for wealth building during earning years. SWP is for income generation during retirement years.'
            },
            {
              q: 'How is SWP taxed in India?',
              a: 'For equity funds: STCG 20% if held <1 year, LTCG 12.5% above ₹1.25 lakh if held >1 year. For debt funds: Taxed as per income slab. Important: Only the GAIN portion is taxed, not the full withdrawal amount, making SWP very tax-efficient.'
            },
            {
              q: 'Can I do SWP from any mutual fund?',
              a: 'Yes, SWP is available in most open-ended mutual funds in India - equity, debt, and hybrid funds. However, ELSS funds only allow SWP after the 3-year lock-in period. For stable SWP income, prefer hybrid or debt funds over pure equity.'
            },
            {
              q: 'Which mutual fund is best for SWP?',
              a: 'Best funds for SWP: (1) Hybrid/Balanced funds for moderate risk-return, (2) Debt funds for stability, (3) Conservative hybrid funds for retirees. Avoid pure small-cap or thematic funds for SWP due to high volatility.'
            },
            {
              q: 'What is the minimum amount for SWP?',
              a: 'Minimum SWP amount varies by fund house but typically ranges from ₹500 to ₹1,000 per month. Minimum corpus required is usually ₹25,000 to ₹1 lakh. Check specific fund details before starting SWP.'
            },
            {
              q: 'Can I increase or decrease my SWP amount?',
              a: 'Yes! SWP is completely flexible. You can increase, decrease, pause, or stop your SWP anytime without any penalty. You can also change the withdrawal frequency (monthly to quarterly) or change the date as per your needs.'
            },
            {
              q: 'Will my SWP corpus ever finish?',
              a: 'It depends on withdrawal amount vs returns. If your annual withdrawal % is less than your return %, corpus may grow or remain stable. If withdrawal exceeds returns, corpus will deplete over time. Our calculator shows exactly when corpus will exhaust.'
            },
            {
              q: 'Is SWP good for senior citizens?',
              a: 'Absolutely! SWP is excellent for senior citizens because: (1) Provides regular pension-like income, (2) More tax-efficient than FD, (3) Beats inflation with higher returns, (4) Capital can grow even while withdrawing, (5) No senior citizen specific restrictions.'
            },
          ].map((faq, idx) => (
            <details key={idx} className="group bg-gradient-to-r from-purple-50 to-white rounded-2xl border-2 border-purple-100 hover:border-purple-300 transition-all overflow-hidden">
              <summary className="cursor-pointer p-5 font-black text-[#0f172a] flex items-center justify-between text-sm sm:text-base">
                <span>{faq.q}</span>
                <span className="text-purple-600 group-open:rotate-180 transition-transform text-xl flex-shrink-0 ml-3">▼</span>
              </summary>
              <div className="px-5 pb-5 text-gray-700 leading-relaxed text-sm border-t border-purple-100 pt-4">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Related Calculators */}
      <section className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 sm:p-12 rounded-[3rem]">
        <h3 className="text-2xl sm:text-3xl font-black text-[#0f172a] text-center mb-8 flex items-center justify-center gap-3">
          <Target className="w-8 h-8 text-purple-600" aria-hidden="true" />
          Related Financial Calculators
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {[
            { name: 'SIP Calculator', url: '/', desc: 'Build wealth' },
            { name: 'Lumpsum Calculator', url: '/lumpsum', desc: 'One-time invest' },
            { name: 'Compound Interest', url: '/compound', desc: 'Compounding' },
            { name: 'Simple Interest', url: '/simple', desc: 'SI calculator' },
            { name: 'Resources & Blog', url: '/resources', desc: 'Learn more' },
            { name: 'Comparisons', url: '/comparisons', desc: 'Compare plans' },
            { name: 'About Us', url: '/about', desc: 'Our story' },
            { name: 'Disclaimer', url: '/disclaimer', desc: 'Read terms' },
          ].map((calc, idx) => (
            <a 
              key={idx} 
              href={calc.url} 
              className="block p-5 bg-white rounded-2xl text-center hover:shadow-xl transition-all border-2 border-transparent hover:border-purple-300 group"
            >
              <p className="font-black text-sm text-[#0f172a] group-hover:text-purple-600 transition-colors">{calc.name}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">{calc.desc}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <div className="bg-red-50 p-8 sm:p-12 rounded-[3rem] border-4 border-dashed border-red-200 text-center space-y-4">
        <AlertTriangle className="w-16 h-16 text-red-600 mx-auto animate-pulse" aria-hidden="true" />
        <h3 className="text-red-900 font-black uppercase tracking-widest italic">Important Disclaimer</h3>
        <p className="text-red-800 text-sm font-bold italic leading-relaxed max-w-4xl mx-auto">
          "Mutual Fund investments are subject to market risks. SWP Calculator projections are based on 
          assumed rate of returns and are for illustrative purposes only. Actual returns may vary based 
          on market conditions, fund performance, and other factors. Please consult a SEBI registered 
          financial advisor before making investment decisions. Content by Rahul Kumar for SmartFintool."
        </p>
      </div>

    </article>
  );
};

export default SWPCalculator;