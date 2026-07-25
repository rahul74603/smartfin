import { Link } from 'react-router-dom';
import { CalendarCheck, ShieldCheck, BookOpenCheck } from 'lucide-react';

/**
 * Visible E-E-A-T signals for calculator pages.
 *
 * WHY THIS EXISTS
 * ---------------
 * Financial calculators are YMYL ("Your Money or Your Life") content, which
 * Google holds to the strictest quality bar — its raters are told to check who
 * produced the content, whether they are qualified, and whether claims are
 * sourced. Before this, the only author signal on the site was a
 * <meta name="author"> tag, which no human rater sees and which carries little
 * weight on its own.
 *
 * This surfaces, in the DOM where both raters and users can see it:
 *   - who maintains the page and a link to their bio,
 *   - when the numbers were last verified,
 *   - which official source the rates came from.
 *
 * The `sources` links are the important part: citing incometax.gov.in or the
 * RBI for a tax slab or interest rate is exactly the "cite your sources"
 * behaviour the YMYL guidelines ask for.
 */

export type Source = { label: string; href: string };

export default function TrustBar({
  updated,
  sources = [],
  note,
}: {
  /** ISO date the figures on this page were last checked. */
  updated: string;
  sources?: Source[];
  /** Optional extra line, e.g. which financial year the rates apply to. */
  note?: string;
}) {
  const pretty = new Date(updated).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-3 text-sm">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <span className="flex items-center gap-2 text-slate-700">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          Maintained by{' '}
          <Link to="/about" className="font-bold text-blue-700 underline underline-offset-2">
            Rahul Kumar
          </Link>
        </span>

        <span className="flex items-center gap-2 text-slate-700">
          <CalendarCheck className="w-4 h-4 text-blue-600 shrink-0" />
          Figures verified <time dateTime={updated}>{pretty}</time>
        </span>
      </div>

      {note && <p className="text-slate-600 leading-relaxed">{note}</p>}

      {sources.length > 0 && (
        <div className="flex flex-wrap items-start gap-2 pt-1 border-t border-slate-200">
          <span className="flex items-center gap-2 text-slate-500 font-semibold pt-2">
            <BookOpenCheck className="w-4 h-4 shrink-0" />
            Sources:
          </span>
          <ul className="flex flex-wrap gap-x-4 gap-y-1 pt-2">
            {sources.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 underline underline-offset-2 hover:text-blue-900"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
