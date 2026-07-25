import { useMemo, useState } from 'react';
import { IndianRupee, Briefcase, ShieldCheck, Download, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { calculateIncomeTax } from '@/lib/calc';
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

const FAQS = [
  {
    q: 'Is income up to ₹12 lakh really tax-free in FY 2026-27?',
    a: 'Yes, for resident individuals under the new regime. Tax on ₹12 lakh of taxable income works out to ₹60,000, and the Section 87A rebate of up to ₹60,000 wipes it out completely. For a salaried person the ₹75,000 standard deduction pushes the tax-free salary up to ₹12.75 lakh.',
  },
  {
    q: 'What are the new regime income tax slabs for FY 2026-27?',
    a: 'Up to ₹4 lakh nil, ₹4-8 lakh 5%, ₹8-12 lakh 10%, ₹12-16 lakh 15%, ₹16-20 lakh 20%, ₹20-24 lakh 25%, and 30% above ₹24 lakh. Budget 2026 made no changes, so these carry over from Budget 2025.',
  },
  {
    q: 'Which regime is better — old or new?',
    a: 'The new regime wins for most salaried people because the slabs are wider and the standard deduction is ₹75,000. The old regime only pulls ahead once your total deductions (80C, 80D, HRA, home loan interest) exceed roughly ₹3.5-4 lakh. This calculator computes both and tells you the exact difference.',
  },
  {
    q: 'What is the standard deduction for FY 2026-27?',
    a: '₹75,000 under the new regime and ₹50,000 under the old regime. It is available to salaried individuals and pensioners only, not to business or professional income.',
  },
  {
    q: 'Do senior citizens get a higher exemption in the new regime?',
    a: 'No. The new regime applies the same ₹4 lakh basic exemption to everyone regardless of age. The higher exemptions of ₹3 lakh (age 60-80) and ₹5 lakh (age 80+) exist only under the old regime.',
  },
  {
    q: 'Which deductions still work in the new regime?',
    a: 'Very few. The main one is Section 80CCD(2) — your employer\'s NPS contribution, deductible up to 14% of basic salary. Standard deduction of ₹75,000 also applies. 80C, 80D, HRA and home loan interest on a self-occupied property are all disallowed.',
  },
  {
    q: 'How is the 4% cess calculated?',
    a: 'Health and Education Cess is 4% charged on the tax amount after the Section 87A rebate and after any surcharge. It is not charged on your income directly, and it is not reduced by the rebate.',
  },
  {
    q: 'What is marginal relief on surcharge?',
    a: 'Surcharge kicks in at ₹50 lakh income. Without relief, earning ₹1 above the threshold would add far more than ₹1 of tax. Marginal relief caps the extra tax so it never exceeds the extra income. This calculator applies it automatically.',
  },
];

const RELATED = [
  { to: '/emi', label: 'EMI Calculator', description: 'Home loan interest is deductible under the old regime.' },
  { to: '/ppf', label: 'PPF Calculator', description: 'PPF is a Section 80C investment with tax-free returns.' },
  { to: '/', label: 'SIP Calculator', description: 'ELSS funds qualify for 80C with a 3-year lock-in.' },
  { to: '/fd', label: 'FD Calculator', description: 'FD interest is fully taxable at your slab rate.' },
  { to: '/goal-sip', label: 'Goal SIP Planner', description: 'Invest your tax saving towards a real goal.' },
  { to: '/swp', label: 'SWP Calculator', description: 'A tax-efficient way to draw retirement income.' },
];

export default function IncomeTaxCalculator() {
  const [income, setIncome] = useState(1500000);
  const [isSalaried, setIsSalaried] = useState(true);
  const [deductions, setDeductions] = useState(150000);
  const [employerNps, setEmployerNps] = useState(0);
  const [age, setAge] = useState<'below60' | '60to80' | 'above80'>('below60');

  const newRegime = useMemo(
    () => calculateIncomeTax({ grossIncome: income, regime: 'new', isSalaried, age, employerNps }),
    [income, isSalaried, age, employerNps]
  );

  const oldRegime = useMemo(
    () =>
      calculateIncomeTax({
        grossIncome: income,
        regime: 'old',
        isSalaried,
        age,
        deductions,
        employerNps,
      }),
    [income, isSalaried, age, deductions, employerNps]
  );

  const better = newRegime.totalTax <= oldRegime.totalTax ? 'new' : 'old';
  const saving = Math.abs(newRegime.totalTax - oldRegime.totalTax);
  const winner = better === 'new' ? newRegime : oldRegime;

  return (
    <article className="space-y-10 max-w-6xl mx-auto">
      <CalcBreadcrumb label="Income Tax Calculator" />

      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-[#0f172a] tracking-tight">
          Income Tax Calculator FY 2026-27 (AY 2027-28)
        </h1>
        <p className="text-slate-600 leading-relaxed max-w-3xl">
          Compare the new and old tax regimes side by side with the latest Budget 2026 slabs.
          Includes the ₹75,000 standard deduction, Section 87A rebate of ₹60,000, surcharge with
          marginal relief, and 4% cess.
        </p>
      </header>

      <TrustBar
        updated='2026-07-25'
        note='Slabs, the Rs 75,000 standard deduction and the Rs 60,000 Section 87A rebate reflect FY 2026-27 (AY 2027-28). Budget 2026 announced no changes to rates.'
        sources={[
            { label: 'Income Tax Department', href: 'https://www.incometax.gov.in/iec/foportal/' },
            { label: 'Budget 2026 – Slab Rates', href: 'https://www.indiabudget.gov.in/' },
        ]}
      />

      <div className="grid lg:grid-cols-2 gap-8">
        {/* ── Inputs ── */}
        <div className="rounded-[2.5rem] bg-white border border-slate-100 shadow-xl p-6 sm:p-8 space-y-7">
          <SliderInput
            id="tax-income"
            label="Gross Annual Income"
            icon={<IndianRupee className="w-3 h-3" />}
            value={income}
            onChange={setIncome}
            min={100000}
            max={20000000}
            step={25000}
            accent="blue"
            hint={formatCurrency(income)}
          />

          <div className="flex items-center justify-between rounded-2xl bg-slate-50 border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-800">
                  Salaried / Pensioner
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Enables the standard deduction
                </p>
              </div>
            </div>
            <Switch checked={isSalaried} onCheckedChange={setIsSalaried} aria-label="Salaried or pensioner" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              Age group (affects old regime only)
            </span>
            <div className="grid grid-cols-3 gap-2">
              {([
                ['below60', 'Below 60'],
                ['60to80', '60 – 80'],
                ['above80', '80+'],
              ] as const).map(([v, label]) => (
                <button
                  key={v}
                  onClick={() => setAge(v)}
                  aria-pressed={age === v}
                  className={`rounded-xl border px-3 py-2 text-xs font-black transition-all ${
                    age === v
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <SliderInput
            id="tax-deductions"
            label="Old regime deductions (80C, 80D, HRA…)"
            icon={<ShieldCheck className="w-3 h-3" />}
            value={deductions}
            onChange={setDeductions}
            min={0}
            max={500000}
            step={10000}
            accent="emerald"
            hint={`${formatCurrency(deductions)} — ignored by the new regime`}
          />

          <SliderInput
            id="tax-nps"
            label="Employer NPS — 80CCD(2)"
            value={employerNps}
            onChange={setEmployerNps}
            min={0}
            max={300000}
            step={5000}
            accent="purple"
            hint="Allowed in BOTH regimes"
          />
        </div>

        {/* ── Results ── */}
        <div className="space-y-6" id="tax-result">
          <ResultStrip
            primary={{
              label: `${better === 'new' ? 'New' : 'Old'} regime is better for you`,
              value: formatCurrency(winner.totalTax),
              sub:
                saving < 1
                  ? 'Both regimes cost you the same'
                  : `You save ${formatCurrency(saving)} versus the ${better === 'new' ? 'old' : 'new'} regime`,
            }}
            items={[
              { label: 'Taxable Income', value: formatCurrency(winner.taxableIncome) },
              { label: 'Effective Rate', value: `${winner.effectiveRatePct.toFixed(2)}%` },
              { label: 'Monthly Take-home', value: formatCurrency((income - winner.totalTax) / 12), tone: 'good' },
            ]}
          />

          {/* Side-by-side comparison */}
          <div className="grid grid-cols-2 gap-4">
            {([
              ['New Regime', newRegime, better === 'new'] as const,
              ['Old Regime', oldRegime, better === 'old'] as const,
            ]).map(([label, r, isBetter]) => (
              <div
                key={label}
                className={`rounded-[2rem] border-2 p-5 space-y-3 ${
                  isBetter ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">
                    {label}
                  </h3>
                  {isBetter && (
                    <span className="text-[9px] font-black uppercase bg-emerald-600 text-white px-2 py-1 rounded-full">
                      Better
                    </span>
                  )}
                </div>
                <p className="text-2xl font-black text-[#0f172a] tabular-nums">
                  {formatCurrency(r.totalTax)}
                </p>
                <dl className="space-y-1.5 text-[11px] text-slate-600">
                  <div className="flex justify-between">
                    <dt>Std deduction</dt>
                    <dd className="font-bold tabular-nums">₹{formatNumber(r.standardDeduction)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Taxable</dt>
                    <dd className="font-bold tabular-nums">₹{formatNumber(r.taxableIncome)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Slab tax</dt>
                    <dd className="font-bold tabular-nums">₹{formatNumber(r.slabTax)}</dd>
                  </div>
                  {r.rebate87A > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <dt>87A rebate</dt>
                      <dd className="font-bold tabular-nums">−₹{formatNumber(r.rebate87A)}</dd>
                    </div>
                  )}
                  {r.surcharge > 0 && (
                    <div className="flex justify-between">
                      <dt>Surcharge</dt>
                      <dd className="font-bold tabular-nums">₹{formatNumber(r.surcharge)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt>Cess (4%)</dt>
                    <dd className="font-bold tabular-nums">₹{formatNumber(r.cess)}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>

          {/* Slab-wise breakup of the winning regime */}
          {winner.breakdown.length > 0 && (
            <div className="rounded-[2rem] bg-white border border-slate-100 shadow-xl p-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-4">
                Slab-wise tax breakup — {better} regime
              </h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                    <th scope="col" className="pb-2">Income slab</th>
                    <th scope="col" className="pb-2 text-center">Rate</th>
                    <th scope="col" className="pb-2 text-right">Tax</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {winner.breakdown.map((b) => (
                    <tr key={`${b.from}-${b.to}`}>
                      <td className="py-2 text-slate-600 tabular-nums">
                        ₹{formatNumber(b.from)} – ₹{formatNumber(b.to)}
                      </td>
                      <td className="py-2 text-center font-bold text-slate-700">{b.rate}%</td>
                      <td className="py-2 text-right font-black tabular-nums text-slate-900">
                        ₹{formatNumber(b.tax)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Button
                onClick={() => downloadPDF('tax-result', 'smartfintool-income-tax.pdf')}
                className="w-full gap-2 mt-5"
              >
                <Download className="w-4 h-4" /> Download as PDF
              </Button>
            </div>
          )}

          <p className="flex gap-2 text-[11px] text-slate-500 leading-relaxed">
            <Info className="w-4 h-4 shrink-0 text-slate-400" />
            Estimates for resident individuals for FY 2026-27 (AY 2027-28). Capital gains, foreign
            income and business presumptive schemes are not covered. Verify with a CA before filing.
          </p>
        </div>
      </div>

      <CalcContent>
        <h2>Income tax slabs FY 2026-27 (AY 2027-28)</h2>
        <p>
          The Union Budget 2026 made no changes to income tax rates, so the slabs introduced in
          Budget 2025 continue. The <strong>new regime is the default</strong> — if you want the old
          regime you must explicitly opt for it.
        </p>

        <h3>New regime slabs</h3>
        <ul>
          <li>Up to ₹4,00,000 — <strong>Nil</strong></li>
          <li>₹4,00,001 to ₹8,00,000 — <strong>5%</strong></li>
          <li>₹8,00,001 to ₹12,00,000 — <strong>10%</strong></li>
          <li>₹12,00,001 to ₹16,00,000 — <strong>15%</strong></li>
          <li>₹16,00,001 to ₹20,00,000 — <strong>20%</strong></li>
          <li>₹20,00,001 to ₹24,00,000 — <strong>25%</strong></li>
          <li>Above ₹24,00,000 — <strong>30%</strong></li>
        </ul>

        <h3>Old regime slabs</h3>
        <ul>
          <li>Up to ₹2,50,000 — Nil (₹3 lakh if aged 60-80, ₹5 lakh if 80+)</li>
          <li>₹2,50,001 to ₹5,00,000 — 5%</li>
          <li>₹5,00,001 to ₹10,00,000 — 20%</li>
          <li>Above ₹10,00,000 — 30%</li>
        </ul>

        <h2>Why ₹12.75 lakh salary means zero tax</h2>
        <p>
          Two things stack up. First, a salaried person deducts the{' '}
          <strong>₹75,000 standard deduction</strong>, bringing ₹12.75 lakh gross down to ₹12 lakh
          taxable. Second, tax on ₹12 lakh is exactly ₹60,000, and the{' '}
          <strong>Section 87A rebate</strong> of up to ₹60,000 cancels it entirely. Earn even ₹1
          more taxable and the rebate disappears completely.
        </p>

        <h2>Which regime should you choose?</h2>
        <p>
          There is a simple break-even test. The new regime gives you wider slabs and a bigger
          standard deduction but almost no other deductions. The old regime charges more but lets
          you claim 80C, 80D, HRA and home loan interest.
        </p>
        <p>
          As a rule of thumb, the old regime only wins once your total deductions cross roughly{' '}
          <strong>₹3.5 to ₹4 lakh</strong>. If you rent in a metro with a large HRA claim and also
          pay a home loan, run both numbers above — the calculator does the comparison for you.
        </p>

        <h2>Deductions still allowed in the new regime</h2>
        <ul>
          <li>Standard deduction of ₹75,000 for salary and pension income</li>
          <li>Section 80CCD(2) — employer NPS contribution up to 14% of basic salary</li>
          <li>Section 80JJAA — additional employee cost for businesses</li>
          <li>Section 80CCH — Agniveer Corpus Fund deposits</li>
          <li>Interest on a home loan for a <strong>let-out</strong> property under Section 24</li>
        </ul>
        <p>
          Notably <strong>not</strong> allowed: 80C investments (PPF, ELSS, life insurance), 80D
          health insurance, HRA exemption, and Section 24(b) interest on a self-occupied home.
        </p>

        <h2>Surcharge and cess</h2>
        <p>
          Above ₹50 lakh a surcharge applies on top of the tax: 10% (₹50L-1cr), 15% (₹1-2cr), 25%
          (₹2-5cr) and 25% above ₹5cr in the new regime — the old regime goes up to 37%.{' '}
          <strong>Marginal relief</strong> ensures the extra tax never exceeds the extra income
          when you cross a threshold. A <strong>4% Health and Education Cess</strong> is then
          charged on tax plus surcharge.
        </p>
      </CalcContent>

      <CalcFAQ faqs={FAQS} />
      <RelatedTools links={RELATED} />
    </article>
  );
}
