import { useMemo, useState, useEffect, lazy, Suspense } from 'react';
import { IndianRupee, Wallet, BarChart3, Clock, Sparkles, Target, Download, BookOpen, TrendingUp, HelpCircle, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, type ChartOptions, type TooltipItem } from 'chart.js';
import { formatNumber, formatCurrency, downloadPDF } from '../lib/utils';
import { loadAdminSettings } from '@/lib/adminSettings';

// Lazy load charts for better performance
const Doughnut = lazy(() => import('react-chartjs-2').then(m => ({ default: m.Doughnut })));
const Bar = lazy(() => import('react-chartjs-2').then(m => ({ default: m.Bar })));

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface LumpsumResult {
  investedAmount: number;
  estimatedReturns: number;
  totalValue: number;
  inflationAdjustedValue: number;
  futurePurchasingPower: number;
}

const calculateLumpsum = (
  investment: number,
  rateOfReturn: number,
  years: number,
  inflationRate: number = 6,
  adjustForInflation: boolean = false
): LumpsumResult => {
  const totalValue = investment * Math.pow(1 + rateOfReturn / 100, years);
  const estimatedReturns = totalValue - investment;
  const inflationFactor = Math.pow(1 + inflationRate / 100, years);
  const inflationAdjustedValue = adjustForInflation ? totalValue / inflationFactor : totalValue;
  const futurePurchasingPower = adjustForInflation ? estimatedReturns / inflationFactor : estimatedReturns;

  return {
    investedAmount: investment,
    estimatedReturns,
    totalValue,
    inflationAdjustedValue,
    futurePurchasingPower,
  };
};

const LumpsumCalculator = () => {
  const lumpsumDefaults = useMemo(() => loadAdminSettings().defaults.lumpsum, []);
  const [investment, setInvestment] = useState(lumpsumDefaults.investment);
  const [rateOfReturn, setRateOfReturn] = useState(lumpsumDefaults.rateOfReturn);
  const [years, setYears] = useState(lumpsumDefaults.years);
  const [inflationRate, setInflationRate] = useState(lumpsumDefaults.inflationRate);
  const [adjustForInflation, setAdjustForInflation] = useState(false);

  // Memoize calculation
  const result: LumpsumResult = useMemo(
    () => calculateLumpsum(investment, rateOfReturn, years, inflationRate, adjustForInflation),
    [investment, rateOfReturn, years, inflationRate, adjustForInflation]
  );

  // ============ SCHEMA MARKUP (Only HowTo - No Duplicates) ============
  // NOTE: Title, Meta, Canonical, FAQPage, WebApplication, BreadcrumbList
  // are handled GLOBALLY in App.tsx to avoid duplicates.
  // We keep only HowTo schema here as it's unique to this calculator.
  useEffect(() => {
    const oldSchema = document.getElementById('lumpsum-howto-schema');
    if (oldSchema) oldSchema.remove();

    const schemaScript = document.createElement('script');
    schemaScript.type = 'application/ld+json';
    schemaScript.id = 'lumpsum-howto-schema';
    schemaScript.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Calculate Lumpsum Investment Returns",
      "description": "Step by step guide to calculate lumpsum mutual fund investment returns using SmartFintool Lumpsum Calculator",
      "totalTime": "PT2M",
      "step": [
        { "@type": "HowToStep", "position": 1, "name": "Enter Investment Amount", "text": "Input your one-time lumpsum investment amount (₹1,000 to ₹1 Crore)." },
        { "@type": "HowToStep", "position": 2, "name": "Set Expected Return Rate", "text": "Enter the expected annual return rate (typically 10-15% for equity mutual funds)." },
        { "@type": "HowToStep", "position": 3, "name": "Choose Investment Duration", "text": "Select your investment period in years (1 to 40 years)." },
        { "@type": "HowToStep", "position": 4, "name": "Enable Inflation Adjustment", "text": "Toggle on inflation adjustment to see real purchasing power of your returns." },
        { "@type": "HowToStep", "position": 5, "name": "View Results", "text": "Get instant breakdown with charts, year-wise growth, and downloadable PDF report." }
      ]
    });
    document.head.appendChild(schemaScript);

    return () => {
      const schema = document.getElementById('lumpsum-howto-schema');
      if (schema) schema.remove();
    };
  }, []);

  // Memoized chart data
  const chartData = useMemo(() => ({
    labels: ['Invested Amount', 'Wealth Gained'],
    datasets: [{
      data: [result.investedAmount, result.estimatedReturns],
      backgroundColor: ['#1e3a8a', '#8b5cf6'],
      borderColor: ['#1e40af', '#7c3aed'],
      borderWidth: 2,
      hoverOffset: 8,
    }],
  }), [result.investedAmount, result.estimatedReturns]);

  const chartOptions: ChartOptions<'doughnut'> = useMemo(() => ({
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

  const yearWiseData = useMemo(() => ({
    labels: Array.from({ length: Math.min(years, 10) }, (_, i) => `Year ${i + 1}`),
    datasets: [{
      label: 'Investment Value',
      data: Array.from({ length: Math.min(years, 10) }, (_, i) => 
        calculateLumpsum(investment, rateOfReturn, i + 1).totalValue
      ),
      backgroundColor: '#1e3a8a',
      borderRadius: 4,
    }],
  }), [investment, rateOfReturn, years]);

  const barOptions: ChartOptions<'bar'> = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'bar'>) => `Value: \u20B9${formatNumber(Number(context.raw ?? 0))}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: (value: string | number) => formatCurrency(Number(value)) },
      },
    },
  }), []);

  return (
    <article className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb (Visual only - schema handled in App.tsx) */}
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-600">
        <ol className="flex items-center gap-2">
          <li><a href="/" className="hover:text-indigo-600">Home</a></li>
          <li>/</li>
          <li className="text-indigo-700 font-medium">Lumpsum Calculator</li>
        </ol>
      </nav>

      {/* H2 Subheading (H1 is in App.tsx hero section) */}
      <header className="mb-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Lumpsum Calculator - Calculate Mutual Fund Returns Online
        </h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
          Free online lumpsum investment calculator for India. Calculate your one-time mutual fund 
          investment returns with inflation adjustment, year-wise growth charts, and downloadable 
          PDF reports - 100% accurate & free.
        </p>
      </header>

      {/* Calculator */}
      <section aria-labelledby="calculator-heading">
        <h2 id="calculator-heading" className="sr-only">Lumpsum Investment Calculator Tool</h2>
        
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          <Card className="shadow-calculator" id="lumpsum-calculator-card">
            <CardHeader className="bg-gradient-to-r from-indigo-800 to-indigo-600 text-white rounded-t-lg p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <IndianRupee className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" /> 
                Lumpsum Calculator
              </CardTitle>
              <CardDescription className="text-indigo-100 text-xs sm:text-sm">
                Calculate returns on one-time investment
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 space-y-5 sm:space-y-6">
              {/* Investment Amount */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex flex-row justify-between items-center">
                  <label htmlFor="investment-input" className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <Wallet className="w-4 h-4 text-indigo-600 hidden sm:block" aria-hidden="true" /> 
                    Investment Amt.
                  </label>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="text-indigo-900 font-bold" aria-hidden="true">{'\u20B9'}</span>
                    <input
                      id="investment-input"
                      type="number"
                      min={1000}
                      max={10000000}
                      step={1000}
                      value={investment}
                      onChange={(e) => setInvestment(Number(e.target.value))}
                      className="w-24 sm:w-32 px-2 py-1.5 border-2 border-indigo-200 rounded-lg text-right font-semibold text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                      aria-label="Investment amount in rupees"
                    />
                  </div>
                </div>
                <input 
                  type="range" 
                  min="1000" 
                  max="10000000" 
                  step="1000" 
                  value={investment} 
                  onChange={(e) => setInvestment(Number(e.target.value))} 
                  className="w-full accent-indigo-600"
                  aria-label="Investment amount slider"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{'\u20B9'}1,000</span>
                  <span>{'\u20B9'}1 Crore</span>
                </div>
              </div>

              {/* Return Rate */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex flex-row justify-between items-center">
                  <label htmlFor="return-input" className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-indigo-600 hidden sm:block" aria-hidden="true" /> 
                    Return Rate (p.a)
                  </label>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <input
                      id="return-input"
                      type="number"
                      min={1}
                      max={30}
                      step={0.5}
                      value={rateOfReturn}
                      onChange={(e) => setRateOfReturn(Number(e.target.value))}
                      className="w-16 sm:w-20 px-2 py-1.5 border-2 border-indigo-200 rounded-lg text-right font-semibold text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                      aria-label="Expected annual return rate"
                    />
                    <span className="text-indigo-900 font-bold">%</span>
                  </div>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="30" 
                  step="0.5" 
                  value={rateOfReturn} 
                  onChange={(e) => setRateOfReturn(Number(e.target.value))} 
                  className="w-full accent-indigo-600"
                  aria-label="Return rate slider"
                />
                <div className="flex justify-between text-xs text-gray-500"><span>1%</span><span>30%</span></div>
              </div>

              {/* Time Period */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex flex-row justify-between items-center">
                  <label htmlFor="years-input" className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-indigo-600 hidden sm:block" aria-hidden="true" /> 
                    Time Period
                  </label>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <input
                      id="years-input"
                      type="number"
                      min={1}
                      max={40}
                      step={1}
                      value={years}
                      onChange={(e) => setYears(Number(e.target.value))}
                      className="w-16 sm:w-20 px-2 py-1.5 border-2 border-indigo-200 rounded-lg text-right font-semibold text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                      aria-label="Investment duration in years"
                    />
                    <span className="text-indigo-900 font-bold">Yrs</span>
                  </div>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="40" 
                  step="1" 
                  value={years} 
                  onChange={(e) => setYears(Number(e.target.value))} 
                  className="w-full accent-indigo-600"
                  aria-label="Time period slider"
                />
                <div className="flex justify-between text-xs text-gray-500"><span>1 Year</span><span>40 Years</span></div>
              </div>

              {/* Inflation Toggle */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" aria-hidden="true" />
                    <div>
                      <p className="text-sm sm:text-base font-semibold text-gray-800">Inflation Adjust</p>
                    </div>
                  </div>
                  <Switch 
                    checked={adjustForInflation} 
                    onCheckedChange={setAdjustForInflation}
                    aria-label="Toggle inflation adjustment"
                  />
                </div>
                {adjustForInflation && (
                  <div className="mt-4 pt-4 border-t border-amber-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <label htmlFor="inflation-input" className="text-sm font-medium text-gray-700">Inflation Rate</label>
                      <div className="flex items-center gap-2">
                        <input
                          id="inflation-input"
                          type="number"
                          min={1}
                          max={15}
                          step={0.5}
                          value={inflationRate}
                          onChange={(e) => setInflationRate(Number(e.target.value))}
                          className="w-16 sm:w-20 px-2 py-1.5 border-2 border-amber-200 rounded-lg text-right font-semibold text-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
                          aria-label="Inflation rate percentage"
                        />
                        <span className="text-amber-700 font-bold">%</span>
                      </div>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="15" 
                      step="0.5" 
                      value={inflationRate} 
                      onChange={(e) => setInflationRate(Number(e.target.value))} 
                      className="w-full accent-amber-500"
                      aria-label="Inflation rate slider"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            <Card className="shadow-calculator" id="lumpsum-results">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-violet-500 text-white rounded-t-lg p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Target className="w-5 h-5" aria-hidden="true" /> Summary
                  </CardTitle>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => downloadPDF('lumpsum-results', 'Lumpsum-Summary.pdf')} 
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
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Invested</p>
                    <p className="text-xl sm:text-2xl font-bold text-deepblue-900">{'\u20B9'}{formatNumber(result.investedAmount)}</p>
                  </div>
                  <div className="bg-violet-50 p-3 sm:p-4 rounded-xl">
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Returns</p>
                    <p className="text-xl sm:text-2xl font-bold text-violet-600">{'\u20B9'}{formatNumber(result.estimatedReturns)}</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-indigo-700 to-violet-600 p-4 rounded-xl text-white text-center">
                  <p className="text-xs sm:text-sm text-indigo-100 mb-1">Total Value</p>
                  <p className="text-3xl sm:text-4xl font-bold">{'\u20B9'}{formatNumber(result.totalValue)}</p>
                </div>

                {adjustForInflation && (
                  <div className="mt-4 rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50 p-4 sm:p-6 text-center">
                    <p className="mb-2 text-xs sm:text-sm font-semibold uppercase tracking-wide text-amber-700">Inflation Adjusted Value</p>
                    <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-amber-700">{'\u20B9'}{formatNumber(result.inflationAdjustedValue)}</p>
                    <p className="mt-2 text-xs sm:text-sm font-medium text-amber-900/80">Real Wealth Gain: {'\u20B9'}{formatNumber(result.futurePurchasingPower)}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-calculator hidden sm:block">
              <CardContent className="p-4 sm:p-6 h-56 sm:h-64">
                <Suspense fallback={<div className="flex items-center justify-center h-full text-gray-500">Loading chart...</div>}>
                  <Doughnut data={chartData} options={chartOptions} />
                </Suspense>
              </CardContent>
            </Card>

            {years <= 10 && (
              <Card className="shadow-calculator hidden sm:block">
                <CardHeader className="p-4 sm:p-6 pb-0">
                  <CardTitle className="text-base sm:text-lg text-gray-800">Year-wise Growth</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="h-48">
                    <Suspense fallback={<div className="flex items-center justify-center h-full text-gray-500">Loading...</div>}>
                      <Bar data={yearWiseData} options={barOptions} />
                    </Suspense>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* ============ SEO CONTENT ============ */}

      {/* What is Lumpsum */}
      <section className="mt-12" aria-labelledby="what-is-lumpsum">
        <Card className="shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <h3 id="what-is-lumpsum" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-indigo-600" aria-hidden="true" />
              What is Lumpsum Investment?
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              A <strong>Lumpsum Investment</strong> is a one-time investment of a substantial amount of money 
              into mutual funds, stocks, or other financial instruments. Unlike a <strong>Systematic Investment 
              Plan (SIP)</strong> where you invest small amounts regularly, lumpsum investment involves 
              deploying a large sum at once - typically when you have surplus money like a bonus, 
              inheritance, or maturity proceeds.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              A <strong>Lumpsum Calculator</strong> helps you estimate the future value of your one-time 
              investment based on the expected rate of return and investment duration. It uses the 
              compound interest formula to project your wealth growth over time.
            </p>

            <h4 className="text-xl font-bold text-gray-900 mt-6 mb-3">Lumpsum Calculator Formula</h4>
            <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded-r-lg my-4">
              <p className="text-lg font-mono font-bold text-indigo-900">
                A = P × (1 + r)<sup>n</sup>
              </p>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li><strong>A</strong> = Maturity Amount (Future Value)</li>
              <li><strong>P</strong> = Principal / Investment Amount</li>
              <li><strong>r</strong> = Expected Annual Rate of Return (decimal)</li>
              <li><strong>n</strong> = Investment Duration (in years)</li>
            </ul>

            <h4 className="text-xl font-bold text-gray-900 mt-6 mb-3">Example: ₹1 Lakh Lumpsum Investment</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 mb-2">
                If you invest <strong>₹1,00,000</strong> at <strong>12% expected return</strong> for 
                <strong> 10 years</strong>:
              </p>
              <p className="font-mono text-sm text-gray-800 my-2">
                A = 1,00,000 × (1 + 0.12)<sup>10</sup> = <strong>₹3,10,585</strong>
              </p>
              <p className="text-gray-700">
                <strong>Wealth Gained = ₹2,10,585</strong> (3x your investment!)
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* How to Use */}
      <section className="mt-8" aria-labelledby="how-to-use">
        <Card className="shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <h3 id="how-to-use" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-7 h-7 text-indigo-600" aria-hidden="true" />
              How to Use Lumpsum Calculator?
            </h3>
            <ol className="space-y-3 text-gray-700">
              {[
                { title: 'Enter Investment Amount', desc: 'Input your one-time lumpsum investment (₹1,000 to ₹1 Crore).' },
                { title: 'Set Expected Return Rate', desc: 'Enter the expected annual return (typically 10-15% for equity mutual funds).' },
                { title: 'Choose Investment Duration', desc: 'Select investment period in years (1 to 40 years).' },
                { title: 'Enable Inflation Adjustment (Optional)', desc: 'Toggle on inflation adjustment to see real purchasing power of your returns.' },
                { title: 'View Results & Download PDF', desc: 'Get instant breakdown with charts, year-wise growth, and downloadable report.' },
              ].map((step, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="flex-shrink-0 w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">{idx + 1}</span>
                  <span><strong>{step.title}:</strong> {step.desc}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </section>

      {/* Lumpsum vs SIP */}
      <section className="mt-8" aria-labelledby="lumpsum-vs-sip">
        <Card className="shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <h3 id="lumpsum-vs-sip" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Lumpsum vs SIP - Which is Better?
            </h3>
            <p className="text-gray-700 mb-4">
              Both Lumpsum and SIP have their unique advantages. The right choice depends on your 
              financial situation, market conditions, and risk appetite.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-indigo-600 text-white">
                    <th className="p-3 text-left border border-indigo-700">Parameter</th>
                    <th className="p-3 text-left border border-indigo-700">Lumpsum</th>
                    <th className="p-3 text-left border border-indigo-700">SIP</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white">
                    <td className="p-3 border font-semibold">Investment Type</td>
                    <td className="p-3 border">One-time large amount</td>
                    <td className="p-3 border">Small regular installments</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-3 border font-semibold">Best For</td>
                    <td className="p-3 border">Surplus funds, bonuses</td>
                    <td className="p-3 border">Regular salary earners</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-3 border font-semibold">Market Timing</td>
                    <td className="p-3 border">Critical (buy at low)</td>
                    <td className="p-3 border">Not important (averaged)</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-3 border font-semibold">Risk Level</td>
                    <td className="p-3 border">Higher (timing risk)</td>
                    <td className="p-3 border">Lower (rupee cost averaging)</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-3 border font-semibold">Returns in Bull Market</td>
                    <td className="p-3 border text-green-600 font-bold">Higher</td>
                    <td className="p-3 border">Moderate</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-3 border font-semibold">Returns in Volatile Market</td>
                    <td className="p-3 border">Risky</td>
                    <td className="p-3 border text-green-600 font-bold">Better</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-3 border font-semibold">Discipline Required</td>
                    <td className="p-3 border">One-time decision</td>
                    <td className="p-3 border">Automatic</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Benefits */}
      <section className="mt-8" aria-labelledby="benefits">
        <Card className="shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <h3 id="benefits" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-7 h-7 text-indigo-600" aria-hidden="true" />
              Benefits of Lumpsum Investment
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: 'Higher Long-Term Returns', desc: 'Full amount stays invested longer, maximizing compound growth potential.' },
                { title: 'Power of Compounding', desc: 'Entire investment earns returns from day one, unlike staggered investments.' },
                { title: 'Ideal for Surplus Money', desc: 'Perfect for bonuses, inheritance, FD maturity, or property sale proceeds.' },
                { title: 'Simple & Hassle-Free', desc: 'One-time investment, no recurring tracking or monthly deductions needed.' },
                { title: 'Better in Bull Markets', desc: 'Captures full market upside when invested at the right time.' },
                { title: 'Goal-Based Planning', desc: 'Suitable for specific goals like retirement, child education, or home buying.' },
              ].map((item, idx) => (
                <div key={idx} className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                  <h4 className="font-bold text-indigo-900 mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-700">{item.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Why Inflation Matters */}
      <section className="mt-8" aria-labelledby="inflation">
        <Card className="shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <h3 id="inflation" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Why Inflation Adjustment Matters?
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Inflation</strong> erodes the purchasing power of your money over time. ₹1 lakh today 
              won't have the same value 10 years from now. India's average inflation rate has been around 
              <strong> 5-7% annually</strong>.
            </p>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg my-4">
              <p className="text-gray-800 font-semibold mb-2">Real-World Example:</p>
              <p className="text-gray-700">
                If your lumpsum investment grows to <strong>₹10 lakhs</strong> in 10 years with 12% returns, 
                but inflation runs at 6% annually, the <strong>real purchasing power</strong> would be only 
                <strong> ₹5.58 lakhs</strong> in today's terms. Our calculator helps you see this real value!
              </p>
            </div>
            <p className="text-gray-700">
              Always use the <strong>inflation adjustment</strong> feature to make realistic financial 
              plans and ensure your investments truly grow your wealth in real terms.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Expected Returns by Category */}
      <section className="mt-8" aria-labelledby="expected-returns">
        <Card className="shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <h3 id="expected-returns" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Expected Lumpsum Returns by Investment Type
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-indigo-600 text-white">
                    <th className="p-3 text-left border">Investment Type</th>
                    <th className="p-3 text-left border">Expected Return (p.a)</th>
                    <th className="p-3 text-left border">Risk Level</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white"><td className="p-3 border">Equity Mutual Funds</td><td className="p-3 border">12-15%</td><td className="p-3 border text-red-600">High</td></tr>
                  <tr className="bg-gray-50"><td className="p-3 border">Hybrid Mutual Funds</td><td className="p-3 border">9-12%</td><td className="p-3 border text-orange-600">Moderate</td></tr>
                  <tr className="bg-white"><td className="p-3 border">Debt Mutual Funds</td><td className="p-3 border">6-8%</td><td className="p-3 border text-yellow-600">Low-Moderate</td></tr>
                  <tr className="bg-gray-50"><td className="p-3 border">Fixed Deposits (FD)</td><td className="p-3 border">5-7%</td><td className="p-3 border text-green-600">Very Low</td></tr>
                  <tr className="bg-white"><td className="p-3 border">PPF</td><td className="p-3 border">7.1%</td><td className="p-3 border text-green-600">Very Low</td></tr>
                  <tr className="bg-gray-50"><td className="p-3 border">Index Funds (Nifty 50)</td><td className="p-3 border">10-13%</td><td className="p-3 border text-orange-600">Moderate-High</td></tr>
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
              <HelpCircle className="w-7 h-7 text-indigo-600" aria-hidden="true" />
              Frequently Asked Questions (FAQs)
            </h3>
            <div className="space-y-4">
              {[
                {
                  q: 'What is a lumpsum investment?',
                  a: 'A lumpsum investment is a one-time investment of a large amount in mutual funds or other instruments. It\'s different from SIP where you invest small amounts regularly. Lumpsum is ideal when you have surplus money like a bonus, inheritance, or FD maturity proceeds.'
                },
                {
                  q: 'How is lumpsum return calculated?',
                  a: 'Lumpsum returns are calculated using the compound interest formula: A = P(1+r)^n, where P is your initial investment, r is the annual return rate (decimal), and n is the number of years. Our calculator does this instantly for you.'
                },
                {
                  q: 'Is lumpsum investment better than SIP?',
                  a: 'It depends on your situation. Lumpsum works better in rising markets and when you have a large sum to invest. SIP is better for regular income earners and reduces market timing risk through rupee cost averaging. Many investors use both strategies together.'
                },
                {
                  q: 'What is the minimum lumpsum amount for mutual funds?',
                  a: 'Most mutual funds in India allow lumpsum investments starting from ₹500 to ₹5,000. The typical minimum for equity mutual funds is ₹5,000, while some funds accept as low as ₹100 for lumpsum.'
                },
                {
                  q: 'Can I withdraw my lumpsum investment anytime?',
                  a: 'Yes, open-ended mutual funds allow withdrawal anytime. However, exit loads (usually 1%) may apply if you redeem within 1 year. ELSS (tax-saving) funds have a mandatory 3-year lock-in period.'
                },
                {
                  q: 'What returns can I expect from lumpsum mutual fund investment?',
                  a: 'Historically, equity mutual funds in India have delivered 12-15% annual returns over the long term (10+ years). However, returns are market-linked and not guaranteed. Past performance doesn\'t guarantee future returns.'
                },
                {
                  q: 'How much tax do I pay on lumpsum mutual fund returns?',
                  a: 'For equity funds: 20% STCG if sold within 1 year; 12.5% LTCG above ₹1.25 lakh if held over 1 year (new rules). For debt funds: Gains are taxed as per your income tax slab. ELSS investments qualify for ₹1.5 lakh deduction under Section 80C.'
                },
                {
                  q: 'When should I do lumpsum investment?',
                  a: 'Lumpsum is ideal when: (1) Markets are down or fairly valued, (2) You have a long investment horizon (5+ years), (3) You receive a windfall like bonus or inheritance, (4) You want to take advantage of compounding from day one.'
                },
                {
                  q: 'Is this lumpsum calculator free to use?',
                  a: 'Yes! SmartFintool\'s lumpsum calculator is 100% free, accurate, and requires no registration. You can use it unlimited times and download results as PDF reports.'
                },
                {
                  q: 'Does the calculator consider taxes?',
                  a: 'No, the calculator shows pre-tax returns. Actual returns will be lower after applicable capital gains tax. Consult a tax advisor for tax planning.'
                },
              ].map((faq, idx) => (
                <details key={idx} className="group bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors">
                  <summary className="cursor-pointer p-4 font-semibold text-gray-900 flex items-center justify-between">
                    <span>{faq.q}</span>
                    <span className="text-indigo-600 group-open:rotate-180 transition-transform">▼</span>
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

      {/* Related Calculators */}
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
                { name: 'Compound Interest', url: '/compound' },
                { name: 'Simple Interest', url: '/simple' },
                { name: 'Resources & Blog', url: '/resources' },
                { name: 'Comparisons', url: '/comparisons' },
              ].map((calc, idx) => (
                <a 
                  key={idx} 
                  href={calc.url} 
                  className="block p-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-center text-indigo-800 font-medium transition-colors border border-indigo-200"
                >
                  {calc.name}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Disclaimer */}
      <section className="mt-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
          <p className="text-sm text-gray-700">
            <strong>Disclaimer:</strong> Mutual fund investments are subject to market risks. The 
            calculations shown are based on assumed rate of returns and are for illustrative purposes 
            only. Actual returns may vary depending on market conditions. Please read all scheme-related 
            documents carefully and consult a SEBI-registered financial advisor before investing.
          </p>
        </div>
      </section>
    </article>
  );
};

export default LumpsumCalculator;