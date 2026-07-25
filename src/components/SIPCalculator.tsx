import { useMemo, useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, Wallet, BarChart3, Clock, Sparkles, 
  Download, HelpCircle, AlertTriangle, ArrowRight, Zap, ListChecks, Award, Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Filler, Legend, ArcElement
} from 'chart.js';
import { formatCurrency, downloadPDF } from '../lib/utils';
import { loadAdminSettings } from '@/lib/adminSettings';

// Lazy load charts
const Line = lazy(() => import('react-chartjs-2').then(m => ({ default: m.Line })));
const Doughnut = lazy(() => import('react-chartjs-2').then(m => ({ default: m.Doughnut })));

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend, ArcElement);

interface SIPResult {
  investedAmount: number;
  estimatedReturns: number;
  totalValue: number;
  inflationAdjustedValue: number;
  chartData: number[];
}

const SIPCalculator = () => {
  const navigate = useNavigate();
  const sipDefaults = useMemo(() => loadAdminSettings().defaults.sip, []);
  const [monthlyInvestment, setMonthlyInvestment] = useState(sipDefaults.monthlyInvestment);
  const [rateOfReturn, setRateOfReturn] = useState(sipDefaults.rateOfReturn);
  const [years, setYears] = useState(sipDefaults.years);
  const [inflationRate, setInflationRate] = useState(sipDefaults.inflationRate);
  const [adjustForInflation, setAdjustForInflation] = useState(false);

  // ============ SCHEMA MARKUP (Only HowTo - No Duplicates) ============
  // NOTE: Title, Meta, Canonical, FAQPage, WebApplication, BreadcrumbList
  // are handled GLOBALLY in App.tsx to avoid duplicates.
  // We keep only HowTo schema here as it's unique to this calculator.
  useEffect(() => {
    const oldSchema = document.getElementById('sip-howto-schema');
    if (oldSchema) oldSchema.remove();

    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.id = 'sip-howto-schema';
    schemaScript.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Calculate SIP Returns Online",
      "description": "Step by step guide to calculate Systematic Investment Plan returns using SmartFintool SIP Calculator",
      "totalTime": "PT2M",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "Enter Monthly Investment", "text": "Input the amount you want to invest every month in mutual funds via SIP." },
        { "@type": "HowToStep", "position": 2, "name": "Set Expected Return", "text": "Enter expected annual return rate (typically 10-15% for equity mutual funds in India)." },
        { "@type": "HowToStep", "position": 3, "name": "Choose Investment Period", "text": "Select the number of years you want to continue your SIP investment." },
        { "@type": "HowToStep", "position": 4, "name": "Enable Inflation Adjustment", "text": "Toggle on inflation adjustment for realistic real-value projections." },
        { "@type": "HowToStep", "position": 5, "name": "View Results", "text": "See your maturity amount, total gains, and year-wise growth chart instantly." }
      ]
    });
    document.head.appendChild(schemaScript);

    return () => {
      const schema = document.getElementById('sip-howto-schema');
      if (schema) schema.remove();
    };
  }, []);
  
  // Memoized SIP calculation
  const result: SIPResult = useMemo(() => {
    const monthlyRate = rateOfReturn / 100 / 12;
    const months = years * 12;
    let currentBalance = 0;
    const yearlyData = [0];

    for (let i = 1; i <= months; i++) {
      currentBalance = (currentBalance + monthlyInvestment) * (1 + monthlyRate);
      if (i % 12 === 0) yearlyData.push(Math.round(currentBalance));
    }

    const investedAmount = monthlyInvestment * months;
    const inflationFactor = Math.pow(1 + inflationRate / 100, years);

    return {
      investedAmount, 
      estimatedReturns: currentBalance - investedAmount, 
      totalValue: currentBalance,
      inflationAdjustedValue: currentBalance / inflationFactor,
      chartData: yearlyData
    };
  }, [monthlyInvestment, rateOfReturn, years, inflationRate]);

  // Memoized chart configs
  const lineChartData = useMemo(() => ({
    labels: Array.from({ length: result.chartData.length }, (_, i) => `Year ${i}`),
    datasets: [{ 
      data: result.chartData, 
      borderColor: '#8b5cf6', 
      borderWidth: 4, 
      tension: 0.4, 
      fill: true, 
      backgroundColor: 'rgba(139, 92, 246, 0.05)', 
      pointRadius: 4,
      pointBackgroundColor: '#fff',
      pointBorderWidth: 3
    }]
  }), [result.chartData]);

  const doughnutData = useMemo(() => ({
    labels: ['Invested', 'Gains'],
    datasets: [{ 
      data: [result.investedAmount, result.estimatedReturns], 
      backgroundColor: ['#0f172a', '#10b981'], 
      borderWidth: 0, 
      hoverOffset: 15 
    }]
  }), [result.investedAmount, result.estimatedReturns]);

  return (
    <article className="space-y-24 pb-32 font-inter max-w-7xl mx-auto px-4">
      
      {/* Breadcrumb (Visual only - schema handled in App.tsx) */}
      <nav aria-label="Breadcrumb" className="text-sm text-gray-600 -mb-16 pt-6">
        <ol className="flex items-center gap-2">
          <li><a href="/" className="hover:text-purple-600">Home</a></li>
          <li>/</li>
          <li><a href="/" className="hover:text-purple-600">Calculators</a></li>
          <li>/</li>
          <li className="text-purple-700 font-medium">SIP Calculator</li>
        </ol>
      </nav>

      {/* H2 Subheading (H1 is in App.tsx hero section) */}
      <header className="text-center space-y-4 pt-8">
        <h2 className="text-4xl sm:text-5xl font-black text-[#0f172a] tracking-tight">
          SIP Calculator India - Free Mutual Fund SIP Return Calculator
        </h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Calculate your Systematic Investment Plan returns instantly. Plan ₹500 to ₹1 Lakh monthly SIP 
          investments with inflation adjustment, year-wise growth charts, and downloadable PDF reports.
        </p>
      </header>

      {/* --- DASHBOARD SECTION (Preserved Premium Design) --- */}
      <section aria-labelledby="calculator-section">
        <h2 id="calculator-section" className="sr-only">SIP Calculator Tool</h2>
        
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          
          {/* INPUT CARD */}
          <Card className="shadow-2xl border-none rounded-[2.5rem] bg-white overflow-hidden border-t-8 border-purple-600">
            <CardHeader className="p-8 border-b border-gray-50">
              <CardTitle className="text-2xl font-black flex items-center gap-3 text-[#0f172a]">
                <TrendingUp className="text-purple-600 w-8 h-8" aria-hidden="true" /> SIP CALCULATOR
              </CardTitle>
              <CardDescription className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                Smart Wealth Planning by Rahul Kumar
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-12">
              {/* Monthly Investment */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                  <label htmlFor="monthly-investment" className="flex items-center gap-2">
                    <Wallet className="w-3 h-3" aria-hidden="true" /> Monthly Investment
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-[#0f172a] font-black">{'\u20B9'}</span>
                    <input 
                      id="monthly-investment"
                      type="number" 
                      min={500} 
                      max={100000} 
                      step={500} 
                      value={monthlyInvestment} 
                      onChange={(e) => setMonthlyInvestment(Number(e.target.value))} 
                      className="w-28 rounded-xl border-2 border-purple-200 px-2 py-1 text-right text-sm font-black text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-purple-500"
                      aria-label="Monthly SIP investment amount in rupees"
                    />
                  </div>
                </div>
                <input 
                  type="range" 
                  min="500" 
                  max="100000" 
                  step="500" 
                  value={monthlyInvestment} 
                  onChange={(e) => setMonthlyInvestment(Number(e.target.value))} 
                  className="w-full accent-purple-600 h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer"
                  aria-label="Monthly investment slider"
                />
              </div>

              {/* Expected Return */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                  <label htmlFor="return-rate" className="flex items-center gap-2">
                    <BarChart3 className="w-3 h-3" aria-hidden="true" /> Expected Return (p.a)
                  </label>
                  <div className="flex items-center gap-2">
                    <input 
                      id="return-rate"
                      type="number" 
                      min={1} 
                      max={30} 
                      step={0.5} 
                      value={rateOfReturn} 
                      onChange={(e) => setRateOfReturn(Number(e.target.value))} 
                      className="w-20 rounded-xl border-2 border-blue-200 px-2 py-1 text-right text-sm font-black text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label="Expected annual return rate"
                    />
                    <span className="text-[#0f172a] font-black">%</span>
                  </div>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="30" 
                  step="0.5" 
                  value={rateOfReturn} 
                  onChange={(e) => setRateOfReturn(Number(e.target.value))} 
                  className="w-full accent-blue-600 h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer"
                  aria-label="Return rate slider"
                />
              </div>

              {/* Time Period */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                  <label htmlFor="time-period" className="flex items-center gap-2">
                    <Clock className="w-3 h-3" aria-hidden="true" /> Time Period
                  </label>
                  <div className="flex items-center gap-2">
                    <input 
                      id="time-period"
                      type="number" 
                      min={1} 
                      max={40} 
                      step={1} 
                      value={years} 
                      onChange={(e) => setYears(Number(e.target.value))} 
                      className="w-20 rounded-xl border-2 border-indigo-200 px-2 py-1 text-right text-sm font-black text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      aria-label="Investment duration in years"
                    />
                    <span className="text-[#0f172a] font-black">Yrs</span>
                  </div>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="40" 
                  step="1" 
                  value={years} 
                  onChange={(e) => setYears(Number(e.target.value))} 
                  className="w-full accent-indigo-600 h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer"
                  aria-label="Time period slider"
                />
              </div>

              {/* Inflation Toggle */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles className="text-amber-600 w-5 h-5" aria-hidden="true" />
                    <span className="text-xs font-black text-gray-800 uppercase tracking-widest">Adjust for Inflation?</span>
                  </div>
                  <Switch 
                    checked={adjustForInflation} 
                    onCheckedChange={setAdjustForInflation}
                    aria-label="Toggle inflation adjustment"
                  />
                </div>
                {adjustForInflation && (
                  <div className="space-y-3 animate-in slide-in-from-top-2">
                    <div className="flex justify-between items-center text-[10px] font-black text-amber-600 uppercase">
                      <label htmlFor="inflation-rate">Inflation Rate</label>
                      <div className="flex items-center gap-2">
                        <input 
                          id="inflation-rate"
                          type="number" 
                          min={1} 
                          max={15} 
                          step={0.5} 
                          value={inflationRate} 
                          onChange={(e) => setInflationRate(Number(e.target.value))} 
                          className="w-20 rounded-xl border-2 border-amber-200 bg-white px-2 py-1 text-right text-sm font-black text-amber-700 focus:outline-none"
                          aria-label="Inflation rate percentage"
                        />
                        <span>%</span>
                      </div>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="15" 
                      step="0.5" 
                      value={inflationRate} 
                      onChange={(e) => setInflationRate(Number(e.target.value))} 
                      className="w-full accent-amber-500 h-1 bg-amber-100 rounded-full appearance-none"
                      aria-label="Inflation rate slider"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* RESULT CARD - Preserved Premium Design */}
          <Card className="shadow-2xl border-none rounded-[3rem] bg-[#0f172a] text-white p-10 overflow-hidden relative flex flex-col justify-center" id="sip-results">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10 space-y-10">
              <div className="text-center space-y-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em]">Estimated Maturity Value</p>
                <p className="text-5xl sm:text-7xl font-black text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                  {formatCurrency(result.totalValue)}
                </p>
                {adjustForInflation && (
                  <div className="mx-auto mt-4 max-w-xl rounded-3xl border border-amber-500/30 bg-amber-500/10 p-5 text-center">
                    <p className="text-[11px] font-black uppercase tracking-[0.15em] text-amber-300">Inflation Adjusted Value</p>
                    <p className="mt-2 text-3xl sm:text-4xl font-black text-amber-200">{formatCurrency(result.inflationAdjustedValue)}</p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 text-center backdrop-blur-md">
                  <p className="text-[10px] font-bold text-blue-300 uppercase mb-2">Total Invested</p>
                  <p className="text-2xl font-black italic">{formatCurrency(result.investedAmount)}</p>
                </div>
                <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 text-center backdrop-blur-md">
                  <p className="text-[10px] font-bold text-emerald-400 uppercase mb-2">Total Gains</p>
                  <p className="text-2xl font-black italic">{formatCurrency(result.estimatedReturns)}</p>
                </div>
              </div>
              <Button 
                onClick={() => downloadPDF('sip-results', 'SmartFintool-SIP-Report.pdf')} 
                className="w-full bg-purple-600 hover:bg-purple-500 text-white rounded-2xl py-8 font-black uppercase tracking-[0.2em] shadow-xl shadow-purple-600/30 transition-all hover:scale-[1.02]"
                aria-label="Download SIP calculation PDF report"
              >
                <Download className="mr-3 w-5 h-5" aria-hidden="true" /> Download Summary
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* --- VISUAL ANALYTICS SECTION --- */}
      <section aria-labelledby="charts-section">
        <h2 id="charts-section" className="sr-only">SIP Growth Charts</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="md:col-span-2 bg-white rounded-[2.5rem] shadow-xl p-8 border-none overflow-hidden group">
            <h3 className="font-black text-[#0f172a] mb-8 uppercase tracking-widest text-xs border-l-4 border-purple-600 pl-4 group-hover:pl-6 transition-all italic">
              Investment Growth Projection
            </h3>
            <div className="h-[300px]">
              <Suspense fallback={<div className="flex items-center justify-center h-full text-gray-400">Loading chart...</div>}>
                <Line 
                  data={lineChartData}
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false, 
                    plugins: { legend: { display: false } }, 
                    scales: { 
                      x: { grid: { display: false }, ticks: { font: { weight: 'bold' } } }, 
                      y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { weight: 'bold' } } } 
                    } 
                  }} 
                />
              </Suspense>
            </div>
          </Card>
          <Card className="bg-white rounded-[2.5rem] shadow-xl p-8 border-none flex flex-col items-center justify-center">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Principal vs Gains</h4>
            <div className="w-full h-[250px]">
              <Suspense fallback={<div className="flex items-center justify-center h-full text-gray-400">Loading...</div>}>
                <Doughnut 
                  data={doughnutData}
                  options={{ cutout: '75%', plugins: { legend: { position: 'bottom', labels: { font: { weight: 'bold' }, padding: 20 } } } }}
                />
              </Suspense>
            </div>
          </Card>
        </div>
      </section>

      {/* --- NAVIGATION & LINKS --- */}
      <nav aria-label="Related calculators">
        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
          <button 
            onClick={() => navigate('/swp')} 
            className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl flex justify-between items-center font-black text-xs uppercase hover:border-purple-600 transition-all group"
          >
            Plan SWP Mode <ArrowRight className="w-5 h-5 text-purple-600 group-hover:translate-x-2 transition-transform" aria-hidden="true" />
          </button>
          <button 
            onClick={() => navigate('/lumpsum')} 
            className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl flex justify-between items-center font-black text-xs uppercase hover:border-purple-600 transition-all group"
          >
            Lumpsum Tool <ArrowRight className="w-5 h-5 text-purple-600 group-hover:translate-x-2 transition-transform" aria-hidden="true" />
          </button>
        </div>
      </nav>

      {/* ============ SIP RETURN EXAMPLES TABLE (HIGH VALUE SEO) ============ */}
      <section className="bg-white p-8 sm:p-12 rounded-[3rem] shadow-xl">
        <div className="text-center space-y-4 mb-10">
          <h3 className="text-3xl sm:text-4xl font-black text-[#0f172a]">
            SIP Return Examples - Popular Investment Amounts
          </h3>
          <p className="text-gray-600">See how much wealth you can create with regular SIP investments at 12% returns</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-purple-600 text-white">
                <th className="p-4 text-left border border-purple-700">Monthly SIP</th>
                <th className="p-4 text-left border border-purple-700">5 Years</th>
                <th className="p-4 text-left border border-purple-700">10 Years</th>
                <th className="p-4 text-left border border-purple-700">15 Years</th>
                <th className="p-4 text-left border border-purple-700">20 Years</th>
                <th className="p-4 text-left border border-purple-700">25 Years</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="bg-white hover:bg-purple-50"><td className="p-3 border font-bold">₹1,000</td><td className="p-3 border">₹82,486</td><td className="p-3 border">₹2.32 L</td><td className="p-3 border">₹5.04 L</td><td className="p-3 border">₹9.99 L</td><td className="p-3 border text-purple-700 font-bold">₹18.95 L</td></tr>
              <tr className="bg-gray-50 hover:bg-purple-50"><td className="p-3 border font-bold">₹2,500</td><td className="p-3 border">₹2.06 L</td><td className="p-3 border">₹5.81 L</td><td className="p-3 border">₹12.61 L</td><td className="p-3 border">₹24.98 L</td><td className="p-3 border text-purple-700 font-bold">₹47.39 L</td></tr>
              <tr className="bg-white hover:bg-purple-50"><td className="p-3 border font-bold">₹5,000</td><td className="p-3 border">₹4.12 L</td><td className="p-3 border">₹11.61 L</td><td className="p-3 border">₹25.23 L</td><td className="p-3 border">₹49.96 L</td><td className="p-3 border text-purple-700 font-bold">₹94.78 L</td></tr>
              <tr className="bg-gray-50 hover:bg-purple-50"><td className="p-3 border font-bold">₹10,000</td><td className="p-3 border">₹8.25 L</td><td className="p-3 border">₹23.23 L</td><td className="p-3 border">₹50.46 L</td><td className="p-3 border">₹99.91 L</td><td className="p-3 border text-purple-700 font-bold">₹1.89 Cr</td></tr>
              <tr className="bg-white hover:bg-purple-50"><td className="p-3 border font-bold">₹15,000</td><td className="p-3 border">₹12.37 L</td><td className="p-3 border">₹34.85 L</td><td className="p-3 border">₹75.69 L</td><td className="p-3 border">₹1.49 Cr</td><td className="p-3 border text-purple-700 font-bold">₹2.84 Cr</td></tr>
              <tr className="bg-gray-50 hover:bg-purple-50"><td className="p-3 border font-bold">₹25,000</td><td className="p-3 border">₹20.62 L</td><td className="p-3 border">₹58.08 L</td><td className="p-3 border">₹1.26 Cr</td><td className="p-3 border">₹2.49 Cr</td><td className="p-3 border text-purple-700 font-bold">₹4.73 Cr</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-4 italic">*Calculated at 12% annual return rate. Actual returns may vary based on market conditions.</p>
      </section>

      {/* --- SEO MEGA CONTENT SECTION (Preserved + Enhanced) --- */}
      <section className="bg-white p-12 sm:p-20 rounded-[4rem] shadow-2xl border border-gray-50 space-y-16">
        <div className="text-center space-y-6">
          <h3 className="text-3xl sm:text-6xl font-black text-[#0f172a] tracking-tight flex items-center justify-center gap-6 underline decoration-purple-600/20 decoration-8">
            <HelpCircle className="w-16 h-16 text-purple-600" aria-hidden="true" /> SIP Calculator Online Guide
          </h3>
          <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px]">Deep Financial Insights by SmartFintool</p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div className="space-y-10">
            {/* WHAT IS SIP SECTION */}
            <div className="flex gap-6 group">
              <div className="bg-emerald-100 p-5 rounded-2xl h-fit group-hover:bg-emerald-500 group-hover:rotate-12 transition-all shadow-lg">
                <Zap className="text-emerald-600 group-hover:text-white transition-colors" aria-hidden="true" />
              </div>
              <div className="space-y-4">
                <h4 className="font-black text-xl text-[#0f172a] mb-2 uppercase italic tracking-tighter">What is SIP? (SIP क्या है?)</h4>
                <div className="text-sm text-gray-600 font-medium leading-relaxed space-y-4">
                  <p className="italic border-l-4 border-emerald-500 pl-4 bg-emerald-50/30 py-4 rounded-r-2xl text-gray-800">
                    <strong>SIP (Systematic Investment Plan)</strong> म्यूचुअल फंड में निवेश करने का सबसे अनुशासित तरीका है। इसकी सबसे बड़ी खूबी यह है कि आप हर महीने एक छोटी रकम निवेश करके भी भविष्य में करोड़ों का फंड तैयार कर सकते हैं। यह न केवल बचत की आदत डालता है, बल्कि <strong>Compounding</strong> की शक्ति से आपके पैसे को तेजी से बढ़ाता है।
                  </p>
                  <p>
                    SIP is a simple yet powerful financial tool that allows you to invest a fixed amount regularly in mutual fund schemes. It mitigates market volatility through <strong>Rupee Cost Averaging</strong>, making it ideal for long-term wealth creation and retirement planning.
                  </p>
                </div>

                <div className="mt-6 space-y-4">
                  <h5 className="font-black text-sm uppercase text-purple-600">SIP कैसे काम करता है? (How SIP Works?)</h5>
                  <ul className="space-y-3 text-sm text-gray-500">
                    <li className="flex gap-2 font-bold"><ListChecks className="w-4 h-4 text-emerald-500 shrink-0" aria-hidden="true" /> <span><strong>Discipline:</strong> यह आपको नियमित निवेश की आदत डालता है।</span></li>
                    <li className="flex gap-2 font-bold"><ListChecks className="w-4 h-4 text-emerald-500 shrink-0" aria-hidden="true" /> <span><strong>Rupee Cost Averaging:</strong> बाजार गिरने पर ज्यादा यूनिट्स और बढ़ने पर कम यूनिट्स खरीदकर आपकी लागत को औसत करता है।</span></li>
                    <li className="flex gap-2 font-bold"><ListChecks className="w-4 h-4 text-emerald-500 shrink-0" aria-hidden="true" /> <span><strong>Power of Compounding:</strong> आपके मुनाफे पर भी मुनाफा मिलता है, जिससे पैसा तेजी से बढ़ता है।</span></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* COMPOUNDING SECTION */}
            <div className="flex gap-6 group">
              <div className="bg-blue-100 p-5 rounded-2xl h-fit group-hover:bg-blue-500 group-hover:rotate-12 transition-all shadow-lg">
                <Sparkles className="text-blue-600 group-hover:text-white transition-colors" aria-hidden="true" />
              </div>
              <div>
                <h4 className="font-black text-xl text-[#0f172a] mb-2 uppercase italic tracking-tighter">The Magic of Compounding</h4>
                <p className="text-sm text-gray-500 font-medium leading-relaxed mb-4">
                  Small investments done early can grow exponentially. Our <strong>SIP Calculator</strong> uses monthly compounding intervals to provide the most precise projections. For example, a ₹5,000 monthly SIP at 12% can grow to over ₹95 Lakhs in 25 years.
                </p>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-black uppercase text-blue-600 mb-2">Pro Tip by Rahul Kumar</p>
                  <p className="text-xs text-gray-400 italic font-bold">"Start early, stay invested, and let time do the heavy lifting for your wealth."</p>
                </div>
              </div>
            </div>

            {/* Benefits of SIP */}
            <div className="flex gap-6 group">
              <div className="bg-purple-100 p-5 rounded-2xl h-fit group-hover:bg-purple-500 group-hover:rotate-12 transition-all shadow-lg">
                <Award className="text-purple-600 group-hover:text-white transition-colors" aria-hidden="true" />
              </div>
              <div>
                <h4 className="font-black text-xl text-[#0f172a] mb-2 uppercase italic tracking-tighter">Benefits of SIP Investment</h4>
                <ul className="space-y-2 text-sm text-gray-600 font-medium">
                  <li>✓ <strong>Start with just ₹500/month</strong> - Affordable for everyone</li>
                  <li>✓ <strong>Auto-debit facility</strong> - No need to remember dates</li>
                  <li>✓ <strong>Flexibility</strong> - Increase, decrease, pause anytime</li>
                  <li>✓ <strong>Tax benefits</strong> - ELSS SIP saves up to ₹46,800 tax (80C)</li>
                  <li>✓ <strong>Goal-based planning</strong> - Home, education, retirement</li>
                  <li>✓ <strong>Beats inflation</strong> - Higher returns than FD/Savings</li>
                </ul>
              </div>
            </div>
          </div>

          {/* MATH LOGIC BOX */}
          <div className="bg-[#0f172a] text-white p-12 rounded-[3.5rem] border border-white/10 shadow-2xl relative">
            <h4 className="text-2xl font-black mb-8 text-purple-400 underline decoration-purple-500/30 decoration-4">The Mathematical Logic</h4>
            <div className="p-8 bg-white/5 rounded-3xl border border-white/10 text-center">
              <p className="text-xs uppercase font-black text-gray-500 tracking-[0.4em] mb-6 italic">Trust the Formula</p>
              <div className="text-2xl font-black italic tracking-tighter text-blue-400">
                {"FV = P x [((1 + i)^n - 1) / i] x (1 + i)"}
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8 text-[10px] text-gray-400 font-bold italic text-left border-t border-white/5 pt-6">
                <div>P = Monthly Investment</div>
                <div>i = Periodic Rate (r/12)</div>
                <div>n = Total Months</div>
                <div>FV = Future Value</div>
              </div>
            </div>
            
            <div className="mt-10 space-y-4">
              <h5 className="text-xs font-black uppercase tracking-widest text-emerald-400">Why use SmartFintool SIP Calculator?</h5>
              <ul className="text-[11px] text-gray-400 leading-relaxed font-medium space-y-2">
                <li>✓ 100% Free & No Registration Required</li>
                <li>✓ Accurate Monthly Compounding Calculations</li>
                <li>✓ Inflation-Adjusted Real Returns</li>
                <li>✓ Visual Charts & Year-wise Growth</li>
                <li>✓ Downloadable PDF Reports</li>
                <li>✓ Hindi + English Support</li>
                <li>✓ Mobile-Friendly Responsive Design</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FAQ SECTION (Visual Only - Schema handled in App.tsx) ============ */}
      <section className="bg-white p-8 sm:p-12 rounded-[3rem] shadow-xl">
        <div className="text-center mb-10">
          <h3 className="text-3xl sm:text-4xl font-black text-[#0f172a] flex items-center justify-center gap-3">
            <HelpCircle className="w-10 h-10 text-purple-600" aria-hidden="true" />
            Frequently Asked Questions
          </h3>
          <p className="text-gray-600 mt-3">Everything you need to know about SIP investments</p>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          {[
            {
              q: 'What is SIP and how does it work?',
              a: 'SIP (Systematic Investment Plan) is a method of investing a fixed amount regularly (monthly/quarterly) in mutual funds. It works through rupee cost averaging - you buy more units when prices are low and fewer when high, reducing overall risk and averaging out market volatility.'
            },
            {
              q: 'How is SIP return calculated?',
              a: 'SIP returns use the formula: FV = P × [((1+i)^n - 1) / i] × (1+i), where P is monthly investment, i is monthly interest rate (annual rate/12), and n is total number of months. Our calculator does this instantly.'
            },
            {
              q: 'How much will ₹5000 monthly SIP grow in 10 years?',
              a: '₹5,000 monthly SIP for 10 years at 12% expected annual return grows to approximately ₹11.61 lakhs. Your total investment of ₹6 lakhs becomes ₹11.61 lakhs - that\'s ₹5.61 lakhs in gains!'
            },
            {
              q: 'Can I become a crorepati with SIP?',
              a: 'Absolutely YES! ₹10,000 monthly SIP at 12% return for 25 years grows to ₹1.89 crores. Even ₹15,000/month for 20 years can make you a crorepati (₹1.49 Cr). Start early for best results.'
            },
            {
              q: 'Is SIP better than Lumpsum?',
              a: 'It depends on your situation. SIP is better for salaried people, reduces timing risk, and instills discipline. Lumpsum works better when markets are low or you have a large surplus amount. Many investors smartly use both strategies.'
            },
            {
              q: 'What is the minimum SIP amount in India?',
              a: 'Most mutual funds allow SIPs starting from ₹500 per month. Some funds even accept ₹100 monthly SIP. ELSS funds typically have ₹500 minimum, while regular equity funds may start from ₹100-1000.'
            },
            {
              q: 'Are SIP returns guaranteed?',
              a: 'No, SIP returns are NOT guaranteed as they are linked to market performance. However, historically equity mutual funds in India have delivered 12-15% annualized returns over the long term (10+ years).'
            },
            {
              q: 'Is SIP tax-free in India?',
              a: 'SIP returns are NOT completely tax-free. Equity fund gains above ₹1.25 lakh/year are taxed at 12.5% (LTCG as per new rules). However, ELSS SIPs qualify for ₹1.5 lakh deduction under Section 80C, saving up to ₹46,800 tax annually.'
            },
            {
              q: 'Can I stop or pause my SIP anytime?',
              a: 'Yes, you can pause, stop, or modify your SIP anytime without any penalty (except ELSS which has 3-year lock-in). Most fund houses offer SIP pause facility for up to 6 months.'
            },
            {
              q: 'Which is the best SIP for beginners?',
              a: 'Beginners should start with diversified large-cap or index funds (like Nifty 50 Index Fund) due to lower risk. Hybrid funds are also good for first-time investors. Avoid sectoral/thematic funds initially.'
            },
            {
              q: 'How does inflation affect my SIP returns?',
              a: 'Inflation reduces the real purchasing power of your returns. If your SIP gives 12% returns and inflation is 6%, your real return is only 6%. Our calculator\'s inflation adjustment feature shows you the real value of money.'
            },
            {
              q: 'Is SmartFintool SIP calculator free?',
              a: 'Yes! SmartFintool\'s SIP calculator is 100% free, requires no registration, and offers unlimited calculations. You can also download your results as a PDF report for free.'
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

      {/* ============ RELATED CALCULATORS ============ */}
      <section className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 sm:p-12 rounded-[3rem]">
        <h3 className="text-2xl sm:text-3xl font-black text-[#0f172a] text-center mb-8 flex items-center justify-center gap-3">
          <Target className="w-8 h-8 text-purple-600" aria-hidden="true" />
          Related Financial Calculators
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {[
            { name: 'Lumpsum Calculator', url: '/lumpsum', desc: 'One-time investment' },
            { name: 'SWP Calculator', url: '/swp', desc: 'Withdrawal plan' },
            { name: 'Compound Interest', url: '/compound', desc: 'CI calculator' },
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

      {/* --- RISK WARNING --- */}
      <div className="bg-red-50 p-12 rounded-[3rem] border-4 border-dashed border-red-200 text-center space-y-4 shadow-inner">
        <AlertTriangle className="w-16 h-16 text-red-600 mx-auto animate-pulse" aria-hidden="true" />
        <h3 className="text-red-900 font-black uppercase tracking-widest italic">Important Disclaimer</h3>
        <p className="text-red-800 text-sm font-bold italic leading-relaxed max-w-4xl mx-auto">
          "Mutual Fund investments are subject to market risks. All results generated by this <strong>SIP Calculator</strong> are based on standard mathematical estimates and are not guarantees of future performance. Please consult a SEBI registered financial expert before making actual investments. Content curated by Rahul Kumar for SmartFintool."
        </p>
      </div>

    </article>
  );
};

export default SIPCalculator;