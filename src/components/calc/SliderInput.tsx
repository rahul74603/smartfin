import type { ReactNode } from 'react';

/**
 * Paired number-input + range-slider control.
 *
 * The existing calculators each hand-rolled this ~40-line block per field
 * (SIP alone repeats it four times). Extracting it keeps the five new tools
 * consistent and makes the a11y wiring — label association, aria-labels,
 * clamped values — correct in one place instead of twelve.
 */
export type SliderInputProps = {
  id: string;
  label: string;
  icon?: ReactNode;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  /** Text shown after the number box, e.g. "%" or "Yrs". */
  suffix?: string;
  /** Optional formatted value shown under the slider, e.g. "₹12.5 Lakh". */
  hint?: string;
  accent?: 'blue' | 'indigo' | 'emerald' | 'amber' | 'rose' | 'purple';
};

const accentMap = {
  blue: { border: 'border-blue-200', ring: 'focus:ring-blue-500', slider: 'accent-blue-600' },
  indigo: { border: 'border-indigo-200', ring: 'focus:ring-indigo-500', slider: 'accent-indigo-600' },
  emerald: { border: 'border-emerald-200', ring: 'focus:ring-emerald-500', slider: 'accent-emerald-600' },
  amber: { border: 'border-amber-200', ring: 'focus:ring-amber-500', slider: 'accent-amber-600' },
  rose: { border: 'border-rose-200', ring: 'focus:ring-rose-500', slider: 'accent-rose-600' },
  purple: { border: 'border-purple-200', ring: 'focus:ring-purple-500', slider: 'accent-purple-600' },
} as const;

export default function SliderInput({
  id,
  label,
  icon,
  value,
  onChange,
  min,
  max,
  step = 1,
  suffix,
  hint,
  accent = 'blue',
}: SliderInputProps) {
  const c = accentMap[accent];

  // Typing in the number box must not let the value escape [min, max] —
  // an out-of-range figure silently produces nonsense results downstream.
  const commit = (raw: string) => {
    const n = Number(raw);
    if (Number.isNaN(n)) return;
    onChange(Math.min(max, Math.max(min, n)));
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
        <label htmlFor={id} className="flex items-center gap-2">
          {icon}
          {label}
        </label>
        <div className="flex items-center gap-2 shrink-0">
          <input
            id={id}
            type="number"
            inputMode="decimal"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => commit(e.target.value)}
            className={`w-24 rounded-xl border-2 ${c.border} px-2 py-1 text-right text-sm font-black text-[#0f172a] focus:outline-none focus:ring-2 ${c.ring}`}
          />
          {suffix && <span className="text-[#0f172a] font-black normal-case">{suffix}</span>}
        </div>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full ${c.slider} h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer`}
        aria-label={`${label} slider`}
      />

      {hint && <p className="text-[11px] font-bold text-slate-500">{hint}</p>}
    </div>
  );
}
