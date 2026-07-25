import {
  Scale,
  ShieldCheck,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Globe,
  Lock,
  RefreshCw,
  Ban,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

// ── Types ──────────────────────────────────────────────────────────────────────
type TermsSection = {
  id: string;
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  content: { heading?: string; text: string }[];
};

// ── Terms Sections Data ────────────────────────────────────────────────────────
const termsSections: TermsSection[] = [
  {
    id: 'acceptance',
    icon: <ShieldCheck className="w-6 h-6" />,
    iconColor: 'text-blue-600',
    title: 'Acceptance of Terms',
    content: [
      {
        text: 'By accessing or using SmartFintool website, calculators, blog articles, or any associated content, you agree to comply with these Terms of Service. If you do not agree with any part of these terms, you should immediately discontinue use of the platform.',
      },
      {
        text: 'These terms apply to all pages and tools including SIP calculator, SWP calculator, Lumpsum calculator, Compound Interest calculator, Simple Interest calculator, financial guides, blog content, and all informational pages hosted on smartfintool.com.',
      },
    ],
  },
  {
    id: 'permitted-use',
    icon: <CheckCircle2 className="w-6 h-6" />,
    iconColor: 'text-emerald-600',
    title: 'Permitted Use',
    content: [
      {
        text: 'SmartFintool is intended strictly for educational, informational, and personal financial planning purposes. You may use calculator outputs to understand investment scenarios, compare return assumptions, and support your independent financial analysis.',
      },
      {
        text: 'You may not use SmartFintool for any unlawful activity, fraudulent workflow, misleading advisory representation, or commercial redistribution of outputs without written permission. Any misuse of the platform may result in permanent access restriction.',
      },
      {
        heading: 'Allowed',
        text: 'Personal financial planning, educational research, sharing article links, using calculators for individual investment understanding.',
      },
      {
        heading: 'Not Allowed',
        text: 'Automated scraping, reproducing full content, embedding calculators without permission, using outputs as guaranteed financial advice to third parties.',
      },
    ],
  },
  {
    id: 'no-guaranteed-outcomes',
    icon: <AlertTriangle className="w-6 h-6" />,
    iconColor: 'text-amber-500',
    title: 'No Guaranteed Outcomes',
    content: [
      {
        text: 'All calculator outputs on SmartFintool are generated from standard mathematical models based on user-entered assumptions such as expected return rate, tenure, and investment amount. These are projections and estimates only, not guaranteed financial outcomes.',
      },
      {
        text: 'Market-linked investments including mutual funds involve inherent risk including market risk, credit risk, and liquidity risk. Past performance does not guarantee future results. Users must independently validate all assumptions and consult SEBI-registered qualified advisors before making final investment decisions.',
      },
      {
        text: 'SmartFintool is not liable for any financial loss, missed opportunity, or incorrect decision made based on calculator projections or educational content published on this platform.',
      },
    ],
  },
  {
    id: 'intellectual-property',
    icon: <Lock className="w-6 h-6" />,
    iconColor: 'text-purple-600',
    title: 'Intellectual Property and Content Rights',
    content: [
      {
        text: 'SmartFintool website design, written articles, financial guides, calculator logic, source code structure, branding elements, visual assets, and all published content are protected by applicable intellectual property rights.',
      },
      {
        text: 'Unauthorized replication, automated scraping, full-page copying, or republication of SmartFintool protected content on other websites, platforms, or applications is strictly prohibited.',
      },
      {
        text: 'Reasonable quoting with proper attribution and a backlink to original content may be allowed for genuine reviews, educational reference, or journalism. Full reproduction or AI training data collection without explicit written approval from SmartFintool is not permitted.',
      },
    ],
  },
  {
    id: 'third-party',
    icon: <Globe className="w-6 h-6" />,
    iconColor: 'text-indigo-600',
    title: 'Third-Party Services',
    content: [
      {
        text: 'SmartFintool may use third-party services for website analytics, cloud hosting, content delivery, and technical infrastructure. These providers operate under their own independent privacy and terms policies.',
      },
      {
        text: 'SmartFintool is not responsible for the practices, content, or terms of any third-party service providers. Users are encouraged to review policies of third-party tools when interacting with external links or integrations accessed through this platform.',
      },
    ],
  },
  {
    id: 'limitation-liability',
    icon: <Ban className="w-6 h-6" />,
    iconColor: 'text-rose-600',
    title: 'Limitation of Liability',
    content: [
      {
        text: 'SmartFintool provides this platform on an as-is basis without warranties of any kind, express or implied. We do not warrant that the platform will be uninterrupted, error-free, or completely accurate at all times.',
      },
      {
        text: 'To the maximum extent permitted by applicable Indian law, SmartFintool, its founder, and contributors shall not be liable for any direct, indirect, incidental, or consequential damages arising from use of or inability to use the platform or its calculator outputs.',
      },
    ],
  },
  {
    id: 'policy-updates',
    icon: <RefreshCw className="w-6 h-6" />,
    iconColor: 'text-teal-600',
    title: 'Policy Updates',
    content: [
      {
        text: 'These Terms of Service may be revised periodically to reflect legal requirements, technical changes, or product updates. The date of last update will be noted below.',
      },
      {
        text: 'Continued use of SmartFintool after any terms update indicates your acceptance of the revised terms. We recommend reviewing this page at regular intervals, especially before relying on the platform for significant financial planning decisions.',
      },
    ],
  },
];

// ── Quick Reference Bullets ────────────────────────────────────────────────────
const quickPoints = [
  { label: 'Platform Type', value: 'Educational Financial Calculator – Not SEBI Registered Advisor' },
  { label: 'Outputs', value: 'Mathematical projections only – Not guaranteed returns' },
  { label: 'Content Rights', value: 'All content protected – No unauthorized reproduction' },
  { label: 'Jurisdiction', value: 'Governed by laws of India' },
  { label: 'Minimum Age', value: '18+ years recommended for financial planning use' },
  { label: 'Last Updated', value: 'June 2026' },
];

// ── Component ──────────────────────────────────────────────────────────────────
const Terms = () => (
  <article className="max-w-5xl mx-auto space-y-8 py-12 font-inter">

    {/* ── Hero Header ─────────────────────────────────────────────────────── */}
    <Card className="bg-white shadow-2xl border-none rounded-[2.5rem] overflow-hidden">
      <CardHeader className="bg-[#0f172a] text-white p-8 sm:p-14 text-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10">
          <div className="bg-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/30">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <CardTitle asChild>
            <h1 className="text-3xl sm:text-5xl font-black mb-3">Terms of Service</h1>
          </CardTitle>
          <p className="text-purple-200 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Please read these terms carefully before using SmartFintool calculators,
            financial guides, or any content on smartfintool.com
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-widest text-purple-200">
            <RefreshCw className="w-3 h-3" /> Last Updated: July 2026
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-8 sm:p-12 space-y-10">

        {/* ── Intro Summary ──────────────────────────────────────────────── */}
        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6">
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            SmartFintool is a <strong>free educational financial calculator platform</strong> built for
            Indian investors. These terms govern your use of all tools, content, and
            pages on smartfintool.com. By using this platform you confirm you have
            read, understood, and agreed to these terms. SmartFintool is{' '}
            <strong>not a SEBI registered investment advisor</strong> and no content
            here constitutes regulated financial advice.
          </p>
        </div>

        {/* ── Quick Reference Table ──────────────────────────────────────── */}
        <section aria-labelledby="quick-ref-heading">
          <h2
            id="quick-ref-heading"
            className="text-xl sm:text-2xl font-black text-gray-900 mb-5 flex items-center gap-2"
          >
            <FileText className="w-5 h-5 text-purple-600" />
            Quick Reference Summary
          </h2>
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm" role="table">
              <tbody>
                {quickPoints.map((point, idx) => (
                  <tr
                    key={point.label}
                    className={idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}
                  >
                    <td className="px-5 py-3 font-bold text-slate-700 w-2/5 border-r border-slate-200">
                      {point.label}
                    </td>
                    <td className="px-5 py-3 text-slate-600">{point.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Terms Sections ─────────────────────────────────────────────── */}
        {termsSections.map((section, idx) => (
          <section
            key={section.id}
            id={section.id}
            aria-labelledby={`${section.id}-heading`}
            className="space-y-4 border-t pt-8"
          >
            <h2
              id={`${section.id}-heading`}
              className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-3"
            >
              <span className={section.iconColor}>{section.icon}</span>
              {idx + 1}. {section.title}
            </h2>

            {section.content.map((block, bIdx) => (
              <div key={bIdx}>
                {block.heading && (
                  <p className="font-bold text-slate-800 mb-1 text-sm uppercase tracking-wide">
                    {block.heading === 'Allowed' ? (
                      <span className="text-emerald-700">✓ {block.heading}</span>
                    ) : (
                      <span className="text-rose-700">✗ {block.heading}</span>
                    )}
                  </p>
                )}
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  {block.text}
                </p>
              </div>
            ))}
          </section>
        ))}

        {/* ── Governing Law ──────────────────────────────────────────────── */}
        <section
          id="governing-law"
          aria-labelledby="governing-law-heading"
          className="space-y-4 border-t pt-8"
        >
          <h2
            id="governing-law-heading"
            className="text-xl sm:text-2xl font-black text-gray-900"
          >
            Governing Law and Jurisdiction
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            These Terms of Service are governed by and construed in accordance with
            the laws of India. Any dispute arising from use of SmartFintool shall be
            subject to the exclusive jurisdiction of competent Indian courts.
          </p>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            If any provision of these terms is found to be unenforceable under
            applicable law, the remaining provisions shall continue in full force
            and effect.
          </p>
        </section>

        {/* ── Contact ────────────────────────────────────────────────────── */}
        <section
          id="contact"
          aria-labelledby="contact-heading"
          className="space-y-4 border-t pt-8"
        >
          <h2
            id="contact-heading"
            className="text-xl sm:text-2xl font-black text-gray-900"
          >
            Contact for Terms Queries
          </h2>
          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
            For any questions regarding these Terms of Service, permitted use
            clarification, or intellectual property concerns, write to:
          </p>
          <a
            href="mailto:help@smartfintool.com"
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-purple-700 transition-colors"
          >
            <FileText className="w-4 h-4" />
            help@smartfintool.com
          </a>
        </section>

        {/* ── Legal Reminder Banner ──────────────────────────────────────── */}
        <div
          role="alert"
          className="bg-red-50 border border-red-200 rounded-2xl p-6 space-y-3"
        >
          <h2 className="text-lg font-black text-red-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Important Legal Reminder
          </h2>
          <p className="text-red-800 text-sm leading-relaxed">
            SmartFintool is <strong>not a substitute for licensed financial advice</strong>.
            Calculator outputs are mathematical projections based on assumed inputs only.
            Any reliance on SmartFintool content for actual investment decisions is entirely
            at user discretion and risk. Always consult a{' '}
            <strong>SEBI registered financial advisor</strong> before making significant
            investment decisions.
          </p>
        </div>

      </CardContent>
    </Card>

    {/* ── Navigation Cards ────────────────────────────────────────────────── */}
    <nav aria-label="Related pages" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[
        {
          href: '/disclaimer',
          icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
          label: 'Financial Disclaimer',
          sub: 'Risk and liability information',
          color: 'border-amber-100 hover:border-amber-300',
        },
        {
          href: '/privacy-policy',
          icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
          label: 'Privacy Policy',
          sub: 'How your data is handled',
          color: 'border-emerald-100 hover:border-emerald-300',
        },
        {
          href: '/about',
          icon: <FileText className="w-5 h-5 text-blue-500" />,
          label: 'About SmartFintool',
          sub: 'Mission and platform story',
          color: 'border-blue-100 hover:border-blue-300',
        },
      ].map((link) => (
        <a
          key={link.href}
          href={link.href}
          className={`flex items-center gap-4 p-5 bg-white rounded-2xl border-2 transition-all shadow-sm hover:shadow-md ${link.color}`}
        >
          <div className="flex-shrink-0">{link.icon}</div>
          <div>
            <p className="font-bold text-slate-800 text-sm">{link.label}</p>
            <p className="text-xs text-slate-500 mt-0.5">{link.sub}</p>
          </div>
        </a>
      ))}
    </nav>

  </article>
);

export default Terms;