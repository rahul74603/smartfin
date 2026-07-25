import { useMemo, useState } from 'react';
import { IndianRupee, Percent, Clock, Download, Info, PiggyBank } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { calculateFD, calculateRD } from '@/lib/calc';
import { formatCurrency, formatNumber, downloadPDF } from '@/lib/utils';
import SliderInput from './calc/SliderInput';
import {
  CalcBreadcrumb,
  CalcContent,
  CalcFAQ,
  RelatedTools,
  ResultStrip,
} from './calc/CalcLayout';

const FAQS = [
  {
    q: 'How is FD maturity calculated?',
    a: 'Indian banks compound FD interest quarterly using A = P(1 + r/n)^(nt), where P is the deposit, r the annual rate, n = 4 compounding periods a year, and t the tenure in years. ₹1 lakh at 7% for 5 years matures at about ₹1,41,478.',
  },
  {
    q: 'Is FD interest taxable?',
    a: 'Yes, fully. FD interest is added to your income and taxed at your slab rate — so a 7% FD nets only about 4.9% for someone in the 30% bracket. Banks also deduct 10% TDS once interest crosses ₹50,000 in a year (₹1 lakh for senior citizens).',
  },
  {
    q: 'What is the difference between FD and RD?',
    a: 'An FD is a single lump-sum deposit locked for a fixed term. An RD lets you deposit a fixed amount every month, which suits salaried savers. For the same rate and period an FD earns more, because your full principal starts compounding on day one.',
  },
  {
    q: 'Do senior citizens get a higher FD rate?',
    a: 'Yes. Most banks pay senior citizens 0.25% to 0.75% extra, and their TDS threshold is ₹1 lakh instead of ₹50,000. Adjust the rate slider above to model your bank\'s actual senior citizen rate.',
  },
  {
    q: 'Is a 5-year tax-saving FD worth it?',
    a: 'A tax-saving FD qualifies for the ₹1.5 lakh Section 80C deduction but only under the old tax regime, has a hard 5-year lock-in with no premature withdrawal, and the interest is still fully taxable. PPF at 7.1% tax-free is usually the better 80C choice.',
  },
  {
    q: 'What happens if I break an FD early?',
    a: 'Banks apply a penalty, typically 0.5% to 1%, and pay interest at the rate applicable for the period actually completed rather than the originally booked rate. Laddering across several smaller FDs avoids breaking one large deposit.',
  },
  {
    q: 'FD or debt mutual fund?',
    a: 'FDs give a guaranteed return with zero market risk. Debt funds can yield slightly more and were historically more tax-efficient, but since April 2023 gains on most debt funds are taxed at your slab rate too. For short horizons with capital safety as the priority, an FD is simpler.',
  },
];

const RELATED = [
  { to: '/ppf', label: 'PPF Calculator', description: 'Tax-free 7.1% versus a fully taxable FD.' },
  { to: '/income-tax', label: 'Income Tax Calculator', description: 'Work out the tax you owe on FD interest.' },
  { to: '/compound', label: 'Compound Interest Calculator', description: 'See how compounding frequency changes returns.' },
  { to: '/', label: 'SIP Calculator', description: 'Compare guaranteed FD returns against equity SIP.' },
  { to: '/swp', label: 'SWP Calculator', description: 'A more tax-efficient way to draw regular income.' },
  { to: '/emi', label: 'EMI Calculator', description: 'Loan rates are always higher than deposit rates.' },
];

export default function FDCalculator() {
  const [tab, setTab] = useState<'fd' | 'rd'>('fd');

  const [principal, setPrincipal] = useState(500000);
  const [fdRate, setFdRate] = useState(7);
  const [fdYears, setFdYears] = useState(5);
  const [freq, setFreq] = useState<1 | 2 | 4 | 12>(4);

  const [monthly, setMonthly] = useState(10000);
  const [rdRate, setRdRate] = useState(7);
  const [rdMonths, setRdMonths] = useState(60);

  const [taxSlab, setTaxSlab] = useState(30);

  const fd = useMemo(
    () => calculateFD(principal, fdRate, fdYears, freq),
    [principal, fdRate, fdYears, freq]
  );
  const rd = useMemo(() => calculateRD(monthly, rdRate, rdMonths), [monthly, rdRate, rdMonths]);

  const isFD = tab === 'fd';
  const interest = isFD ? fd.interest : rd.interest;
  const maturity = isFD ? fd.maturity : rd.maturity;
  const invested = isFD ? principal : rd.totalDeposit;

  // FD interest is taxed at slab, which is the single biggest thing most
  // FD calculators leave out.
  const taxOnInterest = interest * (taxSlab / 100);
  const postTaxMaturity = maturity - taxOnInterest;
  const effectiveRate = isFD ? fdRate * (1 - taxSlab / 100) : rdRate * (1 - taxSlab / 100);

  return (
    <article className="space-y-10 max-w-6xl mx-auto">
      <CalcBreadcrumb label="FD & RD Calculator" />

      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-[#0f172a] tracking-tight">
          FD &amp; RD Calculator — Fixed and Recurring Deposit Returns
        </h1>
        <p className="text-slate-600 leading-relaxed max-w-3xl">
          Calculate fixed deposit and recurring deposit maturity with quarterly compounding, the
          method Indian banks actually use — plus the <strong>post-tax return</strong> that most
          FD calculators quietly ignore.
        </p>
      </header>

      {/* FD / RD switch */}
      <div className="grid grid-cols-2 gap-3 max-w-md">
        {([
          ['fd', 'Fixed Deposit', IndianRupee] as const,
          ['rd', 'Recurring Deposit', PiggyBank] as const,
        ]).map(([v, label, Icon]) => (
          <button
            key={v}
            onClick={() => setTab(v)}
            aria-pressed={tab === v}
            className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-xs font-black uppercase tracking-wider transition-all ${
              tab === v
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg'
                : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="rounded-[2.5rem] bg-white border border-slate-100 shadow-xl p-6 sm:p-8 space-y-7">
          {isFD ? (
            <>
              <SliderInput
                id="fd-principal"
                label="Deposit Amount"
                icon={<IndianRupee className="w-3 h-3" />}
                value={principal}
                onChange={setPrincipal}
                min={5000}
                max={10000000}
                step={5000}
                accent="blue"
                hint={formatCurrency(principal)}
              />
              <SliderInput
                id="fd-rate"
                label="Interest Rate (p.a.)"
                icon={<Percent className="w-3 h-3" />}
                value={fdRate}
                onChange={setFdRate}
                min={3}
                max={12}
                step={0.05}
                suffix="%"
                accent="emerald"
              />
              <SliderInput
                id="fd-years"
                label="Tenure"
                icon={<Clock className="w-3 h-3" />}
                value={fdYears}
                onChange={setFdYears}
                min={1}
                max={20}
                step={1}
                suffix="Yrs"
                accent="purple"
              />
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                  Compounding frequency
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {([
                    [1, 'Yearly'],
                    [2, 'Half-yr'],
                    [4, 'Quarterly'],
                    [12, 'Monthly'],
                  ] as const).map(([v, label]) => (
                    <button
                      key={v}
                      onClick={() => setFreq(v)}
                      aria-pressed={freq === v}
                      className={`rounded-xl border px-2 py-2 text-[11px] font-black transition-all ${
                        freq === v
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] font-bold text-slate-500">
                  Most Indian banks compound quarterly
                </p>
              </div>
            </>
          ) : (
            <>
              <SliderInput
                id="rd-monthly"
                label="Monthly Deposit"
                icon={<IndianRupee className="w-3 h-3" />}
                value={monthly}
                onChange={setMonthly}
                min={500}
                max={200000}
                step={500}
                accent="blue"
                hint={formatCurrency(monthly)}
              />
              <SliderInput
                id="rd-rate"
                label="Interest Rate (p.a.)"
                icon={<Percent className="w-3 h-3" />}
                value={rdRate}
                onChange={setRdRate}
                min={3}
                max={12}
                step={0.05}
                suffix="%"
                accent="emerald"
              />
              <SliderInput
                id="rd-months"
                label="Tenure"
                icon={<Clock className="w-3 h-3" />}
                value={rdMonths}
                onChange={setRdMonths}
                min={6}
                max={120}
                step={6}
                suffix="Mo"
                accent="purple"
                hint={`${(rdMonths / 12).toFixed(1)} years`}
              />
            </>
          )}

          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5 space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-amber-900">
              Your income tax slab
            </span>
            <div className="grid grid-cols-4 gap-2">
              {[0, 5, 20, 30].map((s) => (
                <button
                  key={s}
                  onClick={() => setTaxSlab(s)}
                  aria-pressed={taxSlab === s}
                  className={`rounded-xl border px-2 py-2 text-xs font-black transition-all ${
                    taxSlab === s
                      ? 'bg-amber-600 border-amber-600 text-white'
                      : 'bg-white border-amber-200 text-amber-900 hover:border-amber-400'
                  }`}
                >
                  {s}%
                </button>
              ))}
            </div>
            <p className="text-[11px] font-bold text-amber-800">
              Deposit interest is taxed at your slab rate
            </p>
          </div>
        </div>

        <div className="space-y-6" id="fd-result">
          <ResultStrip
            primary={{
              label: `${isFD ? 'FD' : 'RD'} Maturity Amount`,
              value: formatCurrency(maturity),
              sub: isFD
                ? `${fdYears} years at ${fdRate}% compounded ${freq === 1 ? 'yearly' : freq === 2 ? 'half-yearly' : freq === 4 ? 'quarterly' : 'monthly'}`
                : `${rdMonths} monthly deposits at ${rdRate}%`,
            }}
            items={[
              { label: 'You Deposit', value: formatCurrency(invested) },
              { label: 'Interest Earned', value: formatCurrency(interest), tone: 'good' },
              { label: 'Tax on Interest', value: formatCurrency(taxOnInterest), tone: 'bad' },
            ]}
          />

          <div className="rounded-[2rem] bg-white border border-slate-100 shadow-xl p-6 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">
              What you actually keep
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                  Post-tax maturity
                </p>
                <p className="text-xl font-black text-[#0f172a] mt-1 tabular-nums">
                  {formatCurrency(postTaxMaturity)}
                </p>
              </div>
              <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4">
                <p className="text-[9px] font-black uppercase tracking-widest text-rose-700">
                  Effective post-tax rate
                </p>
                <p className="text-xl font-black text-rose-700 mt-1 tabular-nums">
                  {effectiveRate.toFixed(2)}%
                </p>
              </div>
            </div>
            {taxSlab >= 20 && (
              <p className="text-sm text-slate-600 leading-relaxed">
                At a {taxSlab}% slab your {isFD ? fdRate : rdRate}% deposit really returns{' '}
                <strong className="text-rose-600">{effectiveRate.toFixed(2)}%</strong>. With
                inflation near 6%, that is close to zero real growth — consider{' '}
                <a href="/ppf" className="text-blue-600 font-semibold underline">
                  PPF
                </a>{' '}
                for tax-free returns.
              </p>
            )}
            <Button
              onClick={() => downloadPDF('fd-result', `smartfintool-${tab}.pdf`)}
              className="w-full gap-2"
            >
              <Download className="w-4 h-4" /> Download as PDF
            </Button>
          </div>
        </div>
      </div>

      {isFD && (
        <div className="rounded-[2.5rem] bg-white border border-slate-100 shadow-xl p-6 sm:p-8">
          <h2 className="text-xl font-black text-[#0f172a] mb-5">Year-wise FD growth</h2>
          <div className="overflow-x-auto max-h-80 overflow-y-auto rounded-2xl border border-slate-100">
            <table className="w-full text-sm">
              <caption className="sr-only">Fixed deposit balance at the end of each year</caption>
              <thead className="bg-slate-50 sticky top-0">
                <tr className="text-left text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <th scope="col" className="p-3">Year</th>
                  <th scope="col" className="p-3 text-right">Balance</th>
                  <th scope="col" className="p-3 text-right">Interest so far</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fd.yearly.map((r) => (
                  <tr key={r.year} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-700">{r.year}</td>
                    <td className="p-3 text-right tabular-nums font-black text-slate-900">
                      ₹{formatNumber(r.balance)}
                    </td>
                    <td className="p-3 text-right tabular-nums text-emerald-600 font-semibold">
                      ₹{formatNumber(r.balance - principal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <CalcContent>
        <h2>How fixed deposit interest is calculated</h2>
        <p>
          Indian banks compound FD interest <strong>quarterly</strong> by default, using:
        </p>
        <p>
          <strong>A = P × (1 + r/n)^(n×t)</strong>
        </p>
        <p>
          where P is your deposit, r the annual rate as a decimal, n the number of compounding
          periods per year (4 for quarterly) and t the tenure in years. Higher compounding
          frequency gives a slightly higher maturity for the same headline rate — switch the
          frequency above to see the difference.
        </p>

        <h2>The tax problem nobody mentions</h2>
        <p>
          FD interest is <strong>fully taxable at your income slab rate</strong>. This is the single
          biggest reason FDs underperform. A 7% FD returns only:
        </p>
        <ul>
          <li><strong>7.00%</strong> if you pay no tax</li>
          <li><strong>6.65%</strong> in the 5% slab</li>
          <li><strong>5.60%</strong> in the 20% slab</li>
          <li><strong>4.90%</strong> in the 30% slab</li>
        </ul>
        <p>
          With retail inflation around 5-6%, a 30%-bracket taxpayer earning 4.9% post-tax is
          effectively <strong>losing purchasing power</strong>. That is the case for keeping only
          your emergency fund and short-term needs in FDs.
        </p>

        <h2>TDS on FD interest</h2>
        <p>
          Banks deduct <strong>10% TDS</strong> once your interest crosses ₹50,000 in a financial
          year (₹1 lakh for senior citizens). If your total income is below the taxable limit,
          submit <strong>Form 15G</strong> (or 15H if you are a senior citizen) to avoid the
          deduction. TDS is not the final tax — you still settle the balance at your slab rate when
          filing.
        </p>

        <h2>FD vs RD — which suits you?</h2>
        <ul>
          <li>
            <strong>FD</strong> — one lump sum, the whole amount compounds from day one. Best when
            you already have the money.
          </li>
          <li>
            <strong>RD</strong> — a fixed sum every month. Best for building a habit out of monthly
            salary. Each instalment compounds only for its remaining months, so total interest is
            lower than an equivalent FD.
          </li>
        </ul>
      </CalcContent>

      <CalcFAQ faqs={FAQS} />
      <RelatedTools links={RELATED} />

      <p className="flex gap-2 text-[11px] text-slate-500 leading-relaxed">
        <Info className="w-4 h-4 shrink-0 text-slate-400" />
        Rates vary by bank and tenure. Check your bank&apos;s current card rate before depositing.
      </p>
    </article>
  );
}
