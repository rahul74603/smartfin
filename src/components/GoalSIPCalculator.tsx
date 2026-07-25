import { useMemo, useState } from 'react';
import {
  Target,
  Percent,
  Clock,
  TrendingUp,
  Download,
  Home,
  GraduationCap,
  Plane,
  Umbrella,
  Car,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { requiredSIP, requiredStepUpSIP, stepUpSIPFutureValue, realValue } from '@/lib/calc';
import { formatCurrency, formatNumber, downloadPDF } from '@/lib/utils';
import SliderInput from './calc/SliderInput';
import {
  CalcBreadcrumb,
  CalcContent,
  CalcFAQ,
  RelatedTools,
  ResultStrip,
} from './calc/CalcLayout';

/** Goal presets matched to how people actually search for this. */
const GOALS = [
  { id: 'crore', label: '₹1 Crore', icon: TrendingUp, amount: 10000000, years: 15 },
  { id: 'house', label: 'House Down Payment', icon: Home, amount: 2000000, years: 7 },
  { id: 'child', label: 'Child Education', icon: GraduationCap, amount: 5000000, years: 15 },
  { id: 'retire', label: 'Retirement Corpus', icon: Umbrella, amount: 30000000, years: 25 },
  { id: 'car', label: 'New Car', icon: Car, amount: 1500000, years: 5 },
  { id: 'travel', label: 'World Trip', icon: Plane, amount: 800000, years: 3 },
] as const;

const FAQS = [
  {
    q: 'How much SIP do I need for ₹1 crore in 15 years?',
    a: 'At a 12% expected return you need roughly ₹19,800 per month for 15 years to reach ₹1 crore. Total invested would be about ₹35.6 lakh, with the remaining ₹64 lakh coming from compounding. Shorten the horizon to 10 years and the requirement jumps to about ₹43,000 a month.',
  },
  {
    q: 'What is a step-up SIP and why does it help so much?',
    a: 'A step-up SIP increases your monthly investment by a fixed percentage every year, usually matching your salary hike. Starting at ₹10,000 with a 10% annual step-up beats a flat ₹10,000 SIP by a very wide margin over 15 years, because the later contributions are far larger while still getting years of compounding.',
  },
  {
    q: 'What return rate should I assume for planning?',
    a: 'Use 10-12% for a diversified equity mutual fund portfolio over 10+ years, which is broadly in line with long-term Indian equity history. Use 8% if you want a conservative plan, and never assume above 15% — planning on an optimistic rate means under-saving for the actual goal.',
  },
  {
    q: 'Why does the calculator ask about inflation?',
    a: 'Because ₹1 crore in 20 years will not buy what ₹1 crore buys today. At 6% inflation it has the purchasing power of roughly ₹31 lakh in today\'s money. For goals like child education or retirement you should target the inflation-adjusted amount, not the number that sounds nice today.',
  },
  {
    q: 'Should I count my existing savings?',
    a: 'Yes. Enter your current corpus and the calculator projects its growth and subtracts it from the target, so you only fund the remaining gap. Existing investments do a lot of the work, especially over long horizons.',
  },
  {
    q: 'What if I cannot afford the required SIP?',
    a: 'You have four levers: extend the time horizon, lower the target, increase the assumed return by taking more equity risk, or start smaller and use a step-up SIP. Extending the horizon is by far the most powerful because compounding is exponential in time.',
  },
  {
    q: 'Is a goal-based SIP better than just investing randomly?',
    a: 'Yes, for two reasons. It tells you the exact amount required rather than a vague "save more", and it makes you far less likely to stop the SIP during a market fall because the money is attached to something concrete.',
  },
];

const RELATED = [
  { to: '/', label: 'SIP Calculator', description: 'Project what a given monthly SIP will grow into.' },
  { to: '/lumpsum', label: 'Lumpsum Calculator', description: 'Deploying a bonus or windfall instead?' },
  { to: '/swp', label: 'SWP Calculator', description: 'Once the corpus is built, plan withdrawals.' },
  { to: '/ppf', label: 'PPF Calculator', description: 'Add a guaranteed tax-free debt component.' },
  { to: '/income-tax', label: 'Income Tax Calculator', description: 'ELSS SIPs qualify for 80C under the old regime.' },
  { to: '/emi', label: 'EMI Calculator', description: 'Balance loan EMIs against your SIP capacity.' },
];

export default function GoalSIPCalculator() {
  const [target, setTarget] = useState(10000000);
  const [years, setYears] = useState(15);
  const [rate, setRate] = useState(12);
  const [existing, setExisting] = useState(0);
  const [useStepUp, setUseStepUp] = useState(false);
  const [stepUp, setStepUp] = useState(10);
  const [adjustInflation, setAdjustInflation] = useState(false);
  const [inflation, setInflation] = useState(6);

  // When inflation adjustment is on, the goal must grow to preserve today's
  // purchasing power — otherwise you hit the number but miss the goal.
  const effectiveTarget = adjustInflation
    ? target * Math.pow(1 + inflation / 100, years)
    : target;

  const flatSIP = useMemo(
    () => requiredSIP(effectiveTarget, rate, years, existing),
    [effectiveTarget, rate, years, existing]
  );

  const stepSIP = useMemo(
    () => requiredStepUpSIP(effectiveTarget, rate, years, stepUp, existing),
    [effectiveTarget, rate, years, stepUp, existing]
  );

  const monthly = useStepUp ? stepSIP : flatSIP;

  const projection = useMemo(
    () => stepUpSIPFutureValue(monthly, rate, years, useStepUp ? stepUp : 0),
    [monthly, rate, years, useStepUp, stepUp]
  );

  const totalInvested = projection.totalInvested;
  const gains = Math.max(0, projection.futureValue - totalInvested);
  const todayValue = realValue(effectiveTarget, inflation, years);

  return (
    <article className="space-y-10 max-w-6xl mx-auto">
      <CalcBreadcrumb label="Goal SIP Planner" />

      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-[#0f172a] tracking-tight">
          Goal SIP Calculator — How Much Monthly SIP Do You Need?
        </h1>
        <p className="text-slate-600 leading-relaxed max-w-3xl">
          Work backwards from your goal. Enter the amount you need and by when, and this reverse
          SIP calculator tells you the exact monthly investment required — with step-up and
          inflation adjustment built in.
        </p>
      </header>

      {/* Goal presets */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {GOALS.map((g) => {
          const Icon = g.icon;
          const active = target === g.amount && years === g.years;
          return (
            <button
              key={g.id}
              onClick={() => {
                setTarget(g.amount);
                setYears(g.years);
              }}
              aria-pressed={active}
              className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                active
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg'
                  : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-white' : 'text-blue-600'}`} />
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-wide truncate">{g.label}</p>
                <p className={`text-[10px] font-bold ${active ? 'text-blue-100' : 'text-slate-500'}`}>
                  {formatCurrency(g.amount)} · {g.years}y
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="rounded-[2.5rem] bg-white border border-slate-100 shadow-xl p-6 sm:p-8 space-y-7">
          <SliderInput
            id="goal-target"
            label="Target Amount"
            icon={<Target className="w-3 h-3" />}
            value={target}
            onChange={setTarget}
            min={100000}
            max={100000000}
            step={100000}
            accent="blue"
            hint={formatCurrency(target)}
          />
          <SliderInput
            id="goal-years"
            label="Time to Goal"
            icon={<Clock className="w-3 h-3" />}
            value={years}
            onChange={setYears}
            min={1}
            max={40}
            step={1}
            suffix="Yrs"
            accent="indigo"
          />
          <SliderInput
            id="goal-rate"
            label="Expected Return (p.a.)"
            icon={<Percent className="w-3 h-3" />}
            value={rate}
            onChange={setRate}
            min={1}
            max={20}
            step={0.5}
            suffix="%"
            accent="emerald"
            hint="10-12% is realistic for long-term equity funds"
          />
          <SliderInput
            id="goal-existing"
            label="Existing Savings"
            value={existing}
            onChange={setExisting}
            min={0}
            max={50000000}
            step={50000}
            accent="purple"
            hint={existing > 0 ? `${formatCurrency(existing)} already saved` : 'Starting from zero'}
          />

          {/* Step-up */}
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-emerald-700" />
                <span className="text-xs font-black uppercase tracking-widest text-emerald-900">
                  Step-up SIP every year?
                </span>
              </div>
              <Switch checked={useStepUp} onCheckedChange={setUseStepUp} aria-label="Enable annual step-up" />
            </div>
            {useStepUp && (
              <SliderInput
                id="goal-stepup"
                label="Annual increase"
                value={stepUp}
                onChange={setStepUp}
                min={1}
                max={25}
                step={1}
                suffix="%"
                accent="emerald"
                hint="Match this to your expected salary hike"
              />
            )}
          </div>

          {/* Inflation */}
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-amber-900">
                Adjust goal for inflation?
              </span>
              <Switch
                checked={adjustInflation}
                onCheckedChange={setAdjustInflation}
                aria-label="Adjust target for inflation"
              />
            </div>
            {adjustInflation && (
              <>
                <SliderInput
                  id="goal-inflation"
                  label="Inflation rate"
                  value={inflation}
                  onChange={setInflation}
                  min={1}
                  max={12}
                  step={0.5}
                  suffix="%"
                  accent="amber"
                />
                <p className="text-[11px] font-bold text-amber-800 leading-relaxed">
                  To have {formatCurrency(target)} of today&apos;s purchasing power in {years} years,
                  you actually need <strong>{formatCurrency(effectiveTarget)}</strong>.
                </p>
              </>
            )}
          </div>
        </div>

        <div className="space-y-6" id="goal-result">
          <ResultStrip
            primary={{
              label: useStepUp ? 'Starting monthly SIP' : 'Required monthly SIP',
              value: `₹${formatNumber(monthly)}`,
              sub: useStepUp
                ? `Increasing ${stepUp}% every year for ${years} years`
                : `Fixed for ${years} years at ${rate}% expected return`,
            }}
            items={[
              { label: 'Target', value: formatCurrency(effectiveTarget) },
              { label: 'You Invest', value: formatCurrency(totalInvested) },
              { label: 'Compounding Adds', value: formatCurrency(gains), tone: 'good' },
            ]}
          />

          {/* Flat vs step-up */}
          <div className="rounded-[2rem] bg-white border border-slate-100 shadow-xl p-6 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">
              Flat SIP vs step-up SIP
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`rounded-2xl border-2 p-4 ${!useStepUp ? 'border-blue-400 bg-blue-50' : 'border-slate-200'}`}
              >
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                  Flat SIP
                </p>
                <p className="text-xl font-black text-[#0f172a] mt-1 tabular-nums">
                  ₹{formatNumber(flatSIP)}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">same every month</p>
              </div>
              <div
                className={`rounded-2xl border-2 p-4 ${useStepUp ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200'}`}
              >
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                  Step-up {stepUp}%
                </p>
                <p className="text-xl font-black text-emerald-700 mt-1 tabular-nums">
                  ₹{formatNumber(stepSIP)}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">start lower, grow yearly</p>
              </div>
            </div>
            {stepSIP < flatSIP && (
              <p className="text-sm text-slate-600 leading-relaxed">
                A {stepUp}% annual step-up lets you start{' '}
                <strong className="text-emerald-700">
                  {formatCurrency(flatSIP - stepSIP)} lower
                </strong>{' '}
                per month and still reach the same goal.
              </p>
            )}
            {adjustInflation && (
              <p className="text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                In today&apos;s money that {formatCurrency(effectiveTarget)} is worth about{' '}
                <strong>{formatCurrency(todayValue)}</strong>.
              </p>
            )}
            <Button
              onClick={() => downloadPDF('goal-result', 'smartfintool-goal-sip.pdf')}
              className="w-full gap-2"
            >
              <Download className="w-4 h-4" /> Download as PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Year-wise projection */}
      <div className="rounded-[2.5rem] bg-white border border-slate-100 shadow-xl p-6 sm:p-8">
        <h2 className="text-xl font-black text-[#0f172a] mb-5">Year-by-year projection</h2>
        <div className="overflow-x-auto max-h-80 overflow-y-auto rounded-2xl border border-slate-100">
          <table className="w-full text-sm">
            <caption className="sr-only">Projected invested amount and corpus value each year</caption>
            <thead className="bg-slate-50 sticky top-0">
              <tr className="text-left text-[10px] font-black uppercase tracking-widest text-slate-500">
                <th scope="col" className="p-3">Year</th>
                <th scope="col" className="p-3 text-right">Invested</th>
                <th scope="col" className="p-3 text-right">Value</th>
                <th scope="col" className="p-3 text-right">Gain</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projection.yearly.map((r) => (
                <tr key={r.year} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-700">{r.year}</td>
                  <td className="p-3 text-right tabular-nums text-slate-600">₹{formatNumber(r.invested)}</td>
                  <td className="p-3 text-right tabular-nums font-black text-slate-900">₹{formatNumber(r.value)}</td>
                  <td className="p-3 text-right tabular-nums text-emerald-600 font-semibold">
                    ₹{formatNumber(r.value - r.invested)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CalcContent>
        <h2>What is a goal-based SIP calculator?</h2>
        <p>
          A normal SIP calculator asks &quot;I invest ₹X, what do I get?&quot;. This one works the
          other way round: <strong>you state the goal, it tells you the SIP</strong>. That is
          usually the more useful question, because real financial goals — a house deposit, your
          child&apos;s college fees, retirement — come with a fixed amount and a fixed deadline.
        </p>
        <p>The formula solves the standard SIP future-value equation for the monthly amount:</p>
        <p>
          <strong>P = FV / [((1+r)ⁿ − 1) / r × (1+r)]</strong>
        </p>
        <p>
          where FV is your target, r is the monthly return and n the number of months.
        </p>

        <h2>How much SIP for ₹1 crore?</h2>
        <p>At an assumed 12% annual return:</p>
        <ul>
          <li><strong>10 years</strong> — about ₹43,000 per month</li>
          <li><strong>15 years</strong> — about ₹19,800 per month</li>
          <li><strong>20 years</strong> — about ₹10,000 per month</li>
          <li><strong>25 years</strong> — about ₹5,300 per month</li>
        </ul>
        <p>
          Notice the pattern: <strong>doubling the time horizon cuts the required SIP by roughly
          four times</strong>, not two. That is compounding working exponentially in time, and it
          is the single strongest argument for starting early rather than starting big.
        </p>

        <h2>Why a step-up SIP is easier</h2>
        <p>
          Committing ₹20,000 a month today may be impossible, but ₹12,000 rising 10% each year is
          very achievable if your salary also rises. Since your later contributions are much
          larger, a step-up SIP reaches the same target with a noticeably smaller starting amount.
        </p>
        <p>
          Set the step-up percentage to match your realistic annual hike and toggle it above to
          compare both approaches side by side.
        </p>

        <h2>Do not forget inflation</h2>
        <p>
          If your child&apos;s engineering degree costs ₹20 lakh today, at 8% education inflation it
          will cost roughly <strong>₹43 lakh in 10 years</strong>. Planning for ₹20 lakh means
          falling short by more than half. Switch on inflation adjustment above so the target grows
          to preserve today&apos;s purchasing power.
        </p>
      </CalcContent>

      <CalcFAQ faqs={FAQS} />
      <RelatedTools links={RELATED} />
    </article>
  );
}
