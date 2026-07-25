import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * Shared chrome for a calculator page: breadcrumb, result strip, FAQ block and
 * the internal-link cluster.
 *
 * The internal linking here is deliberate. Google discovers and ranks deep
 * pages largely through internal links, and every calculator linking to its
 * most related siblings (rather than a generic footer dump) spreads crawl
 * equity along topically relevant paths.
 */

export type RelatedLink = { to: string; label: string; description: string };

export function CalcBreadcrumb({ label }: { label: string }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link to="/" className="hover:text-blue-600 font-medium">
            Home
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li className="text-blue-600 font-semibold" aria-current="page">
          {label}
        </li>
      </ol>
    </nav>
  );
}

/** Big headline number plus supporting figures. */
export function ResultStrip({
  primary,
  items,
}: {
  primary: { label: string; value: string; sub?: string };
  items: { label: string; value: string; tone?: 'default' | 'good' | 'bad' }[];
}) {
  return (
    <div className="rounded-[2.5rem] bg-[#0f172a] text-white p-8 sm:p-10 shadow-2xl">
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">
        {primary.label}
      </p>
      <p className="text-4xl sm:text-6xl font-black tracking-tighter mt-3 tabular-nums">
        {primary.value}
      </p>
      {primary.sub && <p className="text-sm text-slate-400 mt-2 font-medium">{primary.sub}</p>}

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {items.map((it) => (
          <div key={it.label} className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
              {it.label}
            </p>
            <p
              className={`text-lg font-black mt-1 tabular-nums ${
                it.tone === 'good'
                  ? 'text-emerald-400'
                  : it.tone === 'bad'
                    ? 'text-rose-400'
                    : 'text-white'
              }`}
            >
              {it.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Visible FAQ block.
 *
 * The answers are rendered in the DOM rather than hidden behind an accordion.
 * Google requires FAQ content to be visible on the page to honour FAQPage
 * structured data, and this is also the text that can win a featured snippet.
 */
export function CalcFAQ({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <section className="rounded-[2.5rem] border border-blue-100 bg-blue-50 p-6 sm:p-10">
      <h2 className="text-2xl sm:text-3xl font-black text-blue-900 mb-6">
        Frequently Asked Questions
      </h2>
      <div className="grid md:grid-cols-2 gap-5">
        {faqs.map((f) => (
          <article key={f.q} className="rounded-2xl bg-white border border-blue-100 p-5 space-y-2">
            <h3 className="font-bold text-slate-900">{f.q}</h3>
            <p className="text-sm text-slate-700 leading-relaxed">{f.a}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/** Topically-related internal links. */
export function RelatedTools({ links, title = 'Related free calculators' }: { links: RelatedLink[]; title?: string }) {
  return (
    <section className="rounded-[2.5rem] bg-white border border-slate-100 shadow-xl p-6 sm:p-10">
      <h2 className="text-2xl font-black text-[#0f172a] mb-6">{title}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="group rounded-2xl border border-slate-100 bg-slate-50 p-5 hover:bg-blue-50 hover:border-blue-200 transition-all"
          >
            <p className="font-black text-[#0f172a] flex items-center gap-2">
              {l.label}
              <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
            </p>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">{l.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

/** Long-form SEO copy under the tool. */
export function CalcContent({ children }: { children: ReactNode }) {
  return (
    <section className="rounded-[2.5rem] bg-white border border-slate-100 shadow-xl p-6 sm:p-10 space-y-5 [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-[#0f172a] [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-slate-900 [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:text-slate-700 [&_p]:leading-relaxed [&_li]:text-slate-700 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_strong]:text-slate-900">
      {children}
    </section>
  );
}
