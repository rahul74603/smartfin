import { useMemo, useState } from 'react';
import {
  IndianRupee,
  Percent,
  Clock,
  Home,
  Car,
  GraduationCap,
  User,
  TrendingDown,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { calculateEMI, calculatePrepaymentSaving } from '@/lib/calc';
import { formatCurrency, formatNumber, downloadPDF } from '@/lib/utils';
import SliderInput from './calc/SliderInput';
import TrustBar from './calc/TrustBar';
import {
  CalcBreadcrumb,
  CalcContent,
  CalcFAQ,
  RelatedTools,
  ResultStrip,
} from './calc/CalcLayout';

/** Presets tuned to how Indians actually search: "home loan emi", "car loan emi". */
const LOAN_PRESETS = [
  { id: 'home', label: 'Home Loan', icon: Home, amount: 5000000, rate: 8.5, years: 20 },
  { id: 'car', label: 'Car Loan', icon: Car, amount: 800000, rate: 9.5, years: 7 },
  { id: 'personal', label: 'Personal Loan', icon: User, amount: 500000, rate: 13, years: 5 },
  { id: 'education', label: 'Education Loan', icon: GraduationCap, amount: 1500000, rate: 10.5, years: 10 },
] as const;

const FAQS = [
  {
    q: 'How is EMI calculated on a loan?',
    a: 'EMI = P × r × (1+r)^n / ((1+r)^n − 1), where P is the loan amount, r is the monthly interest rate (annual rate ÷ 12 ÷ 100) and n is the tenure in months. Every Indian bank uses this reducing-balance method, so the interest each month is charged only on the outstanding balance.',
  },
  {
    q: 'What is a good EMI to income ratio?',
    a: 'Most Indian lenders cap total EMIs at 50-55% of your net monthly income, and prefer 40% or below. For a home loan specifically, keeping the EMI under 35-40% of take-home pay leaves room for other goals like SIP investments and an emergency fund.',
  },
  {
    q: 'Does prepaying a home loan actually save money?',
    a: 'Yes, and the saving is largest in the early years because that is when the interest portion of each EMI is highest. On a ₹50 lakh, 20-year loan at 8.5%, paying just ₹5,000 extra every month clears the loan roughly 4.5 years early and saves over ₹13 lakh in interest.',
  },
  {
    q: 'Should I reduce the EMI or the tenure when prepaying?',
    a: 'Reducing the tenure saves far more interest because you stop paying interest sooner. Reducing the EMI only improves monthly cash flow. Choose tenure reduction unless your monthly budget is genuinely strained.',
  },
  {
    q: 'Why is most of my early EMI going to interest?',
    a: 'Interest is charged on the outstanding balance, which is highest at the start. In year one of a 20-year home loan roughly 80% of each EMI is interest. The principal share rises every month, which is why the amortisation schedule below is worth reading.',
  },
  {
    q: 'Is a floating or fixed rate better in India?',
    a: 'Floating rates are usually 1-2% cheaper and most Indian home loans are floating, linked to the RBI repo rate. Fixed rates give certainty but cost more. If you expect rates to fall, floating is generally better; if you need budget certainty, fixed is safer.',
  },
];

const RELATED = [
  { to: '/', label: 'SIP Calculator', description: 'Invest the money you save by prepaying your loan.' },
  { to: '/income-tax', label: 'Income Tax Calculator', description: 'Home loan interest can be deducted under the old regime.' },
  { to: '/fd', label: 'FD Calculator', description: 'Compare loan interest against safe deposit returns.' },
  { to: '/goal-sip', label: 'Goal SIP Planner', description: 'Plan the down payment for your next big purchase.' },
  { to: '/ppf', label: 'PPF Calculator', description: 'Build a tax-free corpus alongside loan repayment.' },
  { to: '/lumpsum', label: 'Lumpsum Calculator', description: 'Should a bonus go to prepayment or investment?' },
];

export default function EMICalculator() {
  const [amount, setAmount] = useState(5000000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);
  const [extra, setExtra] = useState(0);
  const [showSchedule, setShowSchedule] = useState(false);

  const result = useMemo(
    () => calculateEMI(amount, rate, years * 12),
    [amount, rate, years]
  );

  const prepay = useMemo(
    () => calculatePrepaymentSaving(amount, rate, years * 12, extra),
    [amount, rate, years, extra]
  );

  const applyPreset = (p: (typeof LOAN_PRESETS)[number]) => {
    setAmount(p.amount);
    setRate(p.rate);
    setYears(p.years);
  };

  const interestPct = result.totalPayment > 0 ? (result.totalInterest / result.totalPayment) * 100 : 0;

  return (
    <article className="space-y-10 max-w-6xl mx-auto">
      <CalcBreadcrumb label="EMI Calculator" />

      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-[#0f172a] tracking-tight">
          EMI Calculator — Home, Car, Personal &amp; Education Loan
        </h1>
        <p className="text-slate-600 leading-relaxed max-w-3xl">
          Calculate your monthly EMI, total interest payable and full amortisation schedule using
          the reducing-balance method every Indian bank uses. Then see exactly how much a small
          monthly prepayment would save you.
        </p>
      </header>

      <TrustBar
        updated='2026-07-25'
        note="EMI uses the reducing-balance method mandated for retail loans in India. Interest rates shown in presets are indicative — check your lender's current card rate."
        sources={[
            { label: 'RBI – Interest Rate Rules', href: 'https://www.rbi.org.in/Scripts/BS_ViewMasDirections.aspx' },
            { label: 'Income Tax Act Sec 24(b)', href: 'https://incometaxindia.gov.in/' },
        ]}
      />

      {/* Loan type presets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {LOAN_PRESETS.map((p) => {
          const Icon = p.icon;
          const active = amount === p.amount && rate === p.rate && years === p.years;
          return (
            <button
              key={p.id}
              onClick={() => applyPreset(p)}
              aria-pressed={active}
              className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                active
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg'
                  : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-white' : 'text-blue-600'}`} />
              <span className="text-xs font-black uppercase tracking-wider">{p.label}</span>
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* ── Inputs ── */}
        <div className="rounded-[2.5rem] bg-white border border-slate-100 shadow-xl p-6 sm:p-8 space-y-7">
          <SliderInput
            id="emi-amount"
            label="Loan Amount"
            icon={<IndianRupee className="w-3 h-3" />}
            value={amount}
            onChange={setAmount}
            min={50000}
            max={50000000}
            step={50000}
            accent="blue"
            hint={formatCurrency(amount)}
          />
          <SliderInput
            id="emi-rate"
            label="Interest Rate (p.a.)"
            icon={<Percent className="w-3 h-3" />}
            value={rate}
            onChange={setRate}
            min={1}
            max={25}
            step={0.05}
            suffix="%"
            accent="indigo"
          />
          <SliderInput
            id="emi-years"
            label="Loan Tenure"
            icon={<Clock className="w-3 h-3" />}
            value={years}
            onChange={setYears}
            min={1}
            max={30}
            step={1}
            suffix="Yrs"
            accent="purple"
            hint={`${years * 12} monthly instalments`}
          />

          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-black uppercase tracking-widest text-emerald-900">
                Prepayment: pay extra each month
              </span>
            </div>
            <SliderInput
              id="emi-extra"
              label="Extra per month"
              value={extra}
              onChange={setExtra}
              min={0}
              max={50000}
              step={500}
              accent="emerald"
              hint={extra > 0 ? formatCurrency(extra) : 'Move the slider to see your saving'}
            />
            {extra > 0 && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="rounded-xl bg-white border border-emerald-200 p-3">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                    Loan closes early by
                  </p>
                  <p className="text-lg font-black text-emerald-700">
                    {Math.floor(prepay.monthsSaved / 12)}y {prepay.monthsSaved % 12}m
                  </p>
                </div>
                <div className="rounded-xl bg-white border border-emerald-200 p-3">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                    Interest saved
                  </p>
                  <p className="text-lg font-black text-emerald-700">
                    {formatCurrency(prepay.interestSaved)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Results ── */}
        <div className="space-y-6" id="emi-result">
          <ResultStrip
            primary={{
              label: 'Your Monthly EMI',
              value: `₹${formatNumber(result.emi)}`,
              sub: `${years * 12} instalments at ${rate}% per annum`,
            }}
            items={[
              { label: 'Principal', value: formatCurrency(amount) },
              { label: 'Total Interest', value: formatCurrency(result.totalInterest), tone: 'bad' },
              { label: 'Total Payable', value: formatCurrency(result.totalPayment) },
            ]}
          />

          {/* Principal vs interest split */}
          <div className="rounded-[2rem] bg-white border border-slate-100 shadow-xl p-6 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">
              Where your money goes
            </h3>
            <div
              className="flex h-6 rounded-full overflow-hidden border border-slate-200"
              role="img"
              aria-label={`Principal ${(100 - interestPct).toFixed(0)} percent, interest ${interestPct.toFixed(0)} percent`}
            >
              <div className="bg-blue-600" style={{ width: `${100 - interestPct}%` }} />
              <div className="bg-rose-500" style={{ width: `${interestPct}%` }} />
            </div>
            <div className="flex justify-between text-xs font-bold">
              <span className="text-blue-700">
                Principal {(100 - interestPct).toFixed(1)}%
              </span>
              <span className="text-rose-600">Interest {interestPct.toFixed(1)}%</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              You will pay{' '}
              <strong className="text-rose-600">{formatCurrency(result.totalInterest)}</strong> in
              interest — that is{' '}
              <strong>{(result.totalInterest / amount).toFixed(2)}×</strong> for every rupee
              borrowed.
            </p>
            <Button
              onClick={() => downloadPDF('emi-result', 'smartfintool-emi.pdf')}
              className="w-full gap-2"
            >
              <Download className="w-4 h-4" /> Download as PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Year-wise breakdown */}
      <div className="rounded-[2.5rem] bg-white border border-slate-100 shadow-xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <h2 className="text-xl font-black text-[#0f172a]">Year-wise repayment schedule</h2>
          <Button variant="outline" size="sm" onClick={() => setShowSchedule((s) => !s)}>
            {showSchedule ? 'Show yearly summary' : 'Show all months'}
          </Button>
        </div>

        <div className="overflow-x-auto max-h-[26rem] overflow-y-auto rounded-2xl border border-slate-100">
          <table className="w-full text-sm">
            <caption className="sr-only">
              Loan amortisation schedule showing principal and interest per period
            </caption>
            <thead className="bg-slate-50 sticky top-0">
              <tr className="text-left text-[10px] font-black uppercase tracking-widest text-slate-500">
                <th scope="col" className="p-3">{showSchedule ? 'Month' : 'Year'}</th>
                <th scope="col" className="p-3 text-right">Principal</th>
                <th scope="col" className="p-3 text-right">Interest</th>
                <th scope="col" className="p-3 text-right">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(showSchedule ? result.schedule : result.yearly).map((row) => {
                const isMonth = 'period' in row;
                return (
                  <tr key={isMonth ? `m${row.period}` : `y${row.year}`} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-700">
                      {isMonth ? row.period : row.year}
                    </td>
                    <td className="p-3 text-right tabular-nums text-blue-700 font-semibold">
                      ₹{formatNumber(isMonth ? row.principalPaid : row.principal)}
                    </td>
                    <td className="p-3 text-right tabular-nums text-rose-600 font-semibold">
                      ₹{formatNumber(isMonth ? row.interestPaid : row.interest)}
                    </td>
                    <td className="p-3 text-right tabular-nums text-slate-600">
                      ₹{formatNumber(isMonth ? row.closingBalance : row.balance)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <CalcContent>
        <h2>How the EMI calculator works</h2>
        <p>
          An EMI (Equated Monthly Instalment) is a fixed payment you make every month until the
          loan is fully repaid. Each instalment is split between interest and principal. The
          interest is charged on the <strong>outstanding balance</strong>, so in the early years
          most of your EMI goes towards interest and very little reduces the actual loan.
        </p>
        <p>
          This calculator uses the standard reducing-balance formula that every bank and NBFC in
          India applies:
        </p>
        <p>
          <strong>EMI = P × r × (1+r)ⁿ / ((1+r)ⁿ − 1)</strong>
        </p>
        <p>
          where <strong>P</strong> is the loan amount, <strong>r</strong> is the monthly interest
          rate (annual rate divided by 12 and by 100) and <strong>n</strong> is the tenure in
          months.
        </p>

        <h2>Why prepayment saves so much</h2>
        <p>
          Because interest is front-loaded, any extra rupee you pay early goes straight against
          principal and removes all the future interest that principal would have attracted. On a
          ₹50 lakh home loan at 8.5% for 20 years, an extra ₹5,000 a month closes the loan about
          4 years and 5 months early and saves roughly ₹13.9 lakh in interest — for a total extra
          outlay of about ₹9.4 lakh.
        </p>
        <p>
          Use the prepayment slider above to model your own number. If your lender lets you choose,
          always pick <strong>tenure reduction</strong> over EMI reduction.
        </p>

        <h2>How much EMI can you afford?</h2>
        <ul>
          <li>
            <strong>Under 40% of take-home pay</strong> — comfortable, leaves room for SIP and
            emergency savings.
          </li>
          <li>
            <strong>40-50%</strong> — manageable but tight; most lenders will still approve.
          </li>
          <li>
            <strong>Above 50%</strong> — risky. A job change or medical emergency becomes hard to
            absorb, and most banks will reject the application.
          </li>
        </ul>

        <h2>Tax benefit on a home loan</h2>
        <p>
          Under the <strong>old tax regime</strong>, home loan interest on a self-occupied property
          is deductible up to ₹2 lakh a year under Section 24(b), and principal repayment counts
          towards the ₹1.5 lakh Section 80C limit. The <strong>new tax regime does not allow</strong>{' '}
          either deduction for a self-occupied property. Check both regimes with our{' '}
          <a href="/income-tax" className="text-blue-600 font-semibold underline">
            income tax calculator
          </a>{' '}
          before deciding.
        </p>
      </CalcContent>

      <CalcFAQ faqs={FAQS} />
      <RelatedTools links={RELATED} />
    </article>
  );
}
