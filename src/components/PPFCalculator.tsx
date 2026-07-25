import { useMemo, useState } from 'react';
import { IndianRupee, Percent, Clock, Download, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { calculatePPF } from '@/lib/calc';
import { formatCurrency, formatNumber, downloadPDF } from '@/lib/utils';
import SliderInput from './calc/SliderInput';
import {
  CalcBreadcrumb,
  CalcContent,
  CalcFAQ,
  RelatedTools,
  ResultStrip,
} from './calc/CalcLayout';

/**
 * Current PPF rate. The Ministry of Finance reviews this quarterly; it has
 * been held at 7.1% since January 2023 and was left unchanged for the
 * July-September 2026 quarter.
 */
const CURRENT_PPF_RATE = 7.1;

const FAQS = [
  {
    q: 'What is the current PPF interest rate?',
    a: 'PPF pays 7.1% per annum, unchanged for the July-September 2026 quarter. The Ministry of Finance reviews the rate every quarter based on government security yields, but it has stayed at 7.1% since January 2023.',
  },
  {
    q: 'How much will ₹1.5 lakh per year in PPF grow to in 15 years?',
    a: 'Depositing the full ₹1.5 lakh limit every year for 15 years at 7.1% gives a maturity of roughly ₹40.68 lakh, of which ₹22.5 lakh is your own deposit and about ₹18.18 lakh is tax-free interest.',
  },
  {
    q: 'Is PPF interest really tax-free?',
    a: 'Yes. PPF has EEE (Exempt-Exempt-Exempt) status — the deposit qualifies for Section 80C deduction under the old regime, the annual interest is tax-free, and the maturity amount is tax-free. This makes its 7.1% equivalent to roughly 10.2% pre-tax for someone in the 30% bracket.',
  },
  {
    q: 'When should I deposit to earn maximum PPF interest?',
    a: 'Deposit before the 5th of April. PPF interest is calculated on the lowest balance between the 5th and the last day of each month, so a lump sum deposited in early April earns interest for all 12 months. Spreading the same amount monthly earns noticeably less — compare both modes above.',
  },
  {
    q: 'Can I withdraw from PPF before 15 years?',
    a: 'Partial withdrawal is allowed from the 7th financial year onwards, capped at the lower of 50% of the balance at the end of the 4th preceding year or the previous year\'s balance. A loan facility is available between years 3 and 6.',
  },
  {
    q: 'What happens after the 15-year PPF maturity?',
    a: 'You can withdraw the whole amount tax-free, or extend in blocks of 5 years indefinitely. If you extend with contributions, both old and new deposits keep earning interest. If you extend without contributions, the balance still earns the full rate.',
  },
  {
    q: 'Is PPF better than ELSS or FD?',
    a: 'PPF is zero-risk and tax-free but capped at ₹1.5 lakh a year with a 15-year lock-in. ELSS has a 3-year lock-in and historically returns 12-15% but carries market risk. A tax-saving FD pays 6.5-7.5% and the interest is fully taxable. PPF suits the debt portion of a long-term portfolio.',
  },
  {
    q: 'Does PPF still make sense under the new tax regime?',
    a: 'The 80C deduction is not available in the new regime, so you lose the upfront benefit. However the interest and maturity remain completely tax-free, so PPF is still a strong risk-free debt option — just less compelling than it was under the old regime.',
  },
];

const RELATED = [
  { to: '/income-tax', label: 'Income Tax Calculator', description: 'See if the 80C deduction on PPF actually helps you.' },
  { to: '/fd', label: 'FD & RD Calculator', description: 'Compare PPF against taxable fixed deposit returns.' },
  { to: '/', label: 'SIP Calculator', description: 'Equity SIP for the growth part of your portfolio.' },
  { to: '/compound', label: 'Compound Interest Calculator', description: 'Understand the maths behind PPF compounding.' },
  { to: '/goal-sip', label: 'Goal SIP Planner', description: 'Work out what monthly saving your goal needs.' },
  { to: '/emi', label: 'EMI Calculator', description: 'Prepay a loan or invest in PPF? Compare both.' },
];

export default function PPFCalculator() {
  const [annual, setAnnual] = useState(150000);
  const [years, setYears] = useState(15);
  const [rate, setRate] = useState(CURRENT_PPF_RATE);
  const [mode, setMode] = useState<'yearly' | 'monthly'>('yearly');

  const result = useMemo(
    () => calculatePPF(annual, years, rate, mode),
    [annual, years, rate, mode]
  );

  // The gap between depositing in April vs spreading monthly is a genuinely
  // useful, under-published insight — worth surfacing explicitly.
  const yearlyRun = useMemo(() => calculatePPF(annual, years, rate, 'yearly'), [annual, years, rate]);
  const monthlyRun = useMemo(() => calculatePPF(annual, years, rate, 'monthly'), [annual, years, rate]);
  const timingGain = yearlyRun.maturity - monthlyRun.maturity;

  return (
    <article className="space-y-10 max-w-6xl mx-auto">
      <CalcBreadcrumb label="PPF Calculator" />

      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-[#0f172a] tracking-tight">
          PPF Calculator 2026 — Public Provident Fund Maturity
        </h1>
        <p className="text-slate-600 leading-relaxed max-w-3xl">
          Calculate your PPF maturity amount at the current <strong>7.1%</strong> rate with a
          full year-by-year breakdown. See exactly how much tax-free interest you earn and how
          deposit timing changes the outcome.
        </p>
      </header>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="rounded-[2.5rem] bg-white border border-slate-100 shadow-xl p-6 sm:p-8 space-y-7">
          <SliderInput
            id="ppf-annual"
            label="Yearly Deposit"
            icon={<IndianRupee className="w-3 h-3" />}
            value={annual}
            onChange={setAnnual}
            min={500}
            max={150000}
            step={500}
            accent="emerald"
            hint={`${formatCurrency(annual)} — max allowed is ₹1.5 lakh per year`}
          />
          <SliderInput
            id="ppf-years"
            label="Investment Period"
            icon={<Clock className="w-3 h-3" />}
            value={years}
            onChange={setYears}
            min={15}
            max={50}
            step={5}
            suffix="Yrs"
            accent="blue"
            hint={years > 15 ? `${years - 15} years of 5-year extensions` : 'Minimum lock-in is 15 years'}
          />
          <SliderInput
            id="ppf-rate"
            label="Interest Rate (p.a.)"
            icon={<Percent className="w-3 h-3" />}
            value={rate}
            onChange={setRate}
            min={5}
            max={10}
            step={0.1}
            suffix="%"
            accent="purple"
            hint={rate === CURRENT_PPF_RATE ? 'Current government rate' : 'Custom rate — current is 7.1%'}
          />

          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              When do you deposit?
            </span>
            <div className="grid grid-cols-2 gap-2">
              {([
                ['yearly', 'Lump sum in April'],
                ['monthly', 'Monthly instalments'],
              ] as const).map(([v, label]) => (
                <button
                  key={v}
                  onClick={() => setMode(v)}
                  aria-pressed={mode === v}
                  className={`rounded-xl border px-3 py-3 text-xs font-black transition-all ${
                    mode === v
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {timingGain > 1 && (
            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
              <p className="text-xs font-bold text-amber-900 leading-relaxed">
                💡 Depositing the full amount before <strong>5th April</strong> instead of monthly
                earns you an extra <strong>{formatCurrency(timingGain)}</strong> over {years} years.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-6" id="ppf-result">
          <ResultStrip
            primary={{
              label: 'Maturity Amount (tax-free)',
              value: formatCurrency(result.maturity),
              sub: `After ${years} years at ${rate}% per annum`,
            }}
            items={[
              { label: 'You Invested', value: formatCurrency(result.totalDeposit) },
              { label: 'Interest Earned', value: formatCurrency(result.totalInterest), tone: 'good' },
              {
                label: 'Growth Multiple',
                value: `${(result.maturity / Math.max(1, result.totalDeposit)).toFixed(2)}×`,
              },
            ]}
          />

          <div className="rounded-[2rem] bg-white border border-slate-100 shadow-xl p-6 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">
              Tax-free advantage
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Because PPF interest is completely tax-free, its {rate}% is equivalent to a taxable
              deposit paying{' '}
              <strong className="text-emerald-700">{(rate / 0.7).toFixed(2)}%</strong> for someone
              in the 30% tax bracket, or{' '}
              <strong className="text-emerald-700">{(rate / 0.8).toFixed(2)}%</strong> in the 20%
              bracket.
            </p>
            <Button
              onClick={() => downloadPDF('ppf-result', 'smartfintool-ppf.pdf')}
              className="w-full gap-2"
            >
              <Download className="w-4 h-4" /> Download as PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Year-wise table */}
      <div className="rounded-[2.5rem] bg-white border border-slate-100 shadow-xl p-6 sm:p-8">
        <h2 className="text-xl font-black text-[#0f172a] mb-5">Year-by-year PPF growth</h2>
        <div className="overflow-x-auto max-h-[26rem] overflow-y-auto rounded-2xl border border-slate-100">
          <table className="w-full text-sm">
            <caption className="sr-only">PPF balance, deposit and interest for each year</caption>
            <thead className="bg-slate-50 sticky top-0">
              <tr className="text-left text-[10px] font-black uppercase tracking-widest text-slate-500">
                <th scope="col" className="p-3">Year</th>
                <th scope="col" className="p-3 text-right">Opening</th>
                <th scope="col" className="p-3 text-right">Deposit</th>
                <th scope="col" className="p-3 text-right">Interest</th>
                <th scope="col" className="p-3 text-right">Closing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {result.schedule.map((r) => (
                <tr key={r.year} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-700">{r.year}</td>
                  <td className="p-3 text-right tabular-nums text-slate-500">₹{formatNumber(r.openingBalance)}</td>
                  <td className="p-3 text-right tabular-nums text-blue-700">₹{formatNumber(r.deposit)}</td>
                  <td className="p-3 text-right tabular-nums text-emerald-600 font-semibold">₹{formatNumber(r.interest)}</td>
                  <td className="p-3 text-right tabular-nums font-black text-slate-900">₹{formatNumber(r.closingBalance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="flex gap-2 text-[11px] text-slate-500 mt-4 leading-relaxed">
          <Info className="w-4 h-4 shrink-0 text-slate-400" />
          Assumes the rate stays constant. PPF rates are revised quarterly by the Ministry of
          Finance, so actual maturity will differ if rates change.
        </p>
      </div>

      <CalcContent>
        <h2>What is PPF?</h2>
        <p>
          The <strong>Public Provident Fund</strong> is a government-backed savings scheme with a
          15-year lock-in, currently paying <strong>7.1% per annum</strong> compounded yearly. It
          is one of the very few Indian instruments with full <strong>EEE</strong> status: the
          deposit is deductible under Section 80C (old regime), the interest is tax-free, and the
          maturity is tax-free.
        </p>

        <h2>PPF rules you should know</h2>
        <ul>
          <li>Minimum deposit <strong>₹500</strong> per year, maximum <strong>₹1.5 lakh</strong></li>
          <li>Only <strong>one account per person</strong> is allowed</li>
          <li>Lock-in of <strong>15 financial years</strong>, extendable in 5-year blocks</li>
          <li>Partial withdrawal permitted from the <strong>7th year</strong></li>
          <li>Loan facility available between <strong>years 3 and 6</strong></li>
          <li>A lapsed account is revived by paying ₹500 per missed year plus a ₹50 penalty</li>
        </ul>

        <h2>The April deposit trick</h2>
        <p>
          PPF interest is calculated on the <strong>lowest balance between the 5th and the last
          day</strong> of each month. Deposit your annual amount before <strong>5 April</strong> and
          it earns interest for all twelve months. Deposit on 20 April and you lose a full month.
        </p>
        <p>
          Over a 15-year term at the ₹1.5 lakh limit, the difference between an early-April lump sum
          and monthly instalments is well over ₹1.5 lakh. Toggle the deposit mode above to see your
          own figure.
        </p>

        <h2>PPF vs EPF vs NPS</h2>
        <ul>
          <li>
            <strong>PPF — 7.1%</strong>, open to everyone, ₹1.5 lakh cap, fully tax-free, zero risk
          </li>
          <li>
            <strong>EPF — 8.25%</strong>, salaried employees only, employer matches your
            contribution, tax-free after 5 years of service
          </li>
          <li>
            <strong>NPS — market-linked</strong>, historically 9-12%, open to ages 18-70, 60% of the
            corpus is tax-free at exit while 40% must buy an annuity that is taxable
          </li>
        </ul>
        <p>
          Most Indian investors benefit from holding all three: EPF automatically through salary,
          PPF for guaranteed tax-free debt, and NPS or equity mutual funds for growth.
        </p>
      </CalcContent>

      <CalcFAQ faqs={FAQS} />
      <RelatedTools links={RELATED} />
    </article>
  );
}
