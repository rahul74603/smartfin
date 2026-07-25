import { ShieldCheck, Lock, EyeOff, Database, Mail, FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const Privacy = () => (
  <div className="max-w-6xl mx-auto">
    <Card className="bg-white shadow-2xl border-none rounded-[2.5rem] overflow-hidden">
      <CardHeader className="bg-emerald-600 text-white p-8 sm:p-12 text-center">
        <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>
        <CardTitle asChild>
          <h1 className="text-3xl sm:text-4xl font-black mb-2">Privacy Policy</h1>
        </CardTitle>
        <p className="text-emerald-100 font-medium italic">Transparent Data Practices for SmartFintool Users</p>
      </CardHeader>

      <CardContent className="p-8 sm:p-12 space-y-10 text-gray-700 leading-relaxed">
        <section className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-2">
            <Lock className="text-emerald-600 w-6 h-6" /> Our Privacy Commitment
          </h2>
          <p>
            At <strong>SmartFintool.com</strong>, privacy is treated as a core trust factor, not a checkbox. This Privacy Policy explains what information may be collected, how we use it, and how we safeguard user trust while delivering calculator features for SIP, SWP, Lumpsum, Compound Interest, and Simple Interest planning.
          </p>
          <p>
            This document is written for clarity so users searching terms like "calculator privacy policy", "financial website data policy", and "how online SIP calculator handles data" can understand our approach without legal confusion.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
            <EyeOff className="w-8 h-8 text-emerald-600 mb-3" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Input Data Handling</h3>
            <p className="text-sm">
              Calculator fields are processed primarily in browser context. We design tools so users can test investment scenarios without sharing sensitive banking information. Your investment amounts, expected returns, and time periods remain private and are not transmitted to our servers during standard calculator usage.
            </p>
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
            <Database className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Analytics and Logs</h3>
            <p className="text-sm">
              We may use aggregate analytics for performance and UX improvements. These metrics are used to improve page speed, readability, and user intent fulfillment. We utilize privacy-focused analytics solutions that do not track individual users across websites.
            </p>
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">What We Collect</h2>
          <p>
            We may collect basic technical metadata such as browser type, device class, rough geographic region, referral source, and on-site navigation events. This helps improve content quality and calculator usability. We do not collect personally identifiable information (PII) unless voluntarily provided through contact forms.
          </p>
          <p>
            We do <strong>not</strong> ask for or require confidential financial credentials like bank account passwords, card PINs, OTPs, or trading platform login secrets. All financial calculations occur client-side in your browser.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Cookies, Local Storage, and Session Data</h2>
          <p>
            SmartFintool may use cookies or local storage for functional behavior such as interface preferences (like dark/light mode), calculator input history for session continuity, and consent management. These mechanisms are intended to improve user experience and reduce repetitive actions.
          </p>
          <p>
            Users can control cookie behavior via browser settings. Disabling cookies may impact certain convenience features but core content and calculator functionality should remain accessible. We do not use cookies for advertising or cross-site tracking.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Third-Party Integrations</h2>
          <p>
            Some pages may use trusted third-party services for content delivery (CDN), performance monitoring, and essential functionality. Each provider operates under its own privacy policy. We select integrations based on utility, reliability, and privacy commitments.
          </p>
          <p>
            We do not knowingly sell personal user data to advertising brokers, data miners, or any third parties. Any future change in data policy will be communicated by updating this page with a clear revision date.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">User Rights and Controls</h2>
          <p>
            You can clear browser data, disable cookies, stop using the platform at any time, and request deletion of any voluntarily submitted information (such as contact form submissions). If you need clarification on data use, write to our support email.
          </p>
          <p>
            We periodically revise this privacy policy to keep it aligned with platform updates, regulatory expectations (including GDPR and Indian data protection principles), and industry best practices for financial technology platforms.
          </p>
        </section>

        <section className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-3">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2"><FileText className="w-6 h-6" /> Quick Privacy FAQ</h2>
          <p><strong>Do you store my calculator values permanently?</strong> No. Core calculator usage is built for local processing and estimate visualization. Any temporary session storage is cleared when you close your browser tab or after a period of inactivity.</p>
          <p><strong>Do you guarantee zero data sharing?</strong> We only share aggregate, anonymized usage statistics with trusted partners for service improvement. We never share individual user data, investment scenarios, or personally identifiable information.</p>
          <p><strong>How to raise a privacy concern?</strong> Contact us directly at help@smartfintool.com and we will review the request promptly, typically within 3-5 business days.</p>
          <p><strong>Is this website GDPR compliant?</strong> While primarily serving Indian users, we respect GDPR principles for any European visitors including data minimization, purpose limitation, and user rights regarding their information.</p>
          <p><strong>Do you use tracking pixels or fingerprinting?</strong> No. We reject invasive tracking technologies that compromise user privacy. Our approach prioritizes user anonymity while maintaining service quality.</p>
        </section>

        <section className="bg-[#0f172a] text-white p-8 rounded-3xl">
          <h3 className="text-xl font-bold mb-3 flex items-center gap-2"><Mail className="text-blue-400" /> Privacy Contact</h3>
          <p className="text-gray-300 mb-4">If you have additional questions regarding privacy policy or data handling, contact:</p>
          <a href="mailto:help@smartfintool.com" className="text-blue-400 font-bold text-lg hover:underline underline-offset-4">help@smartfintool.com</a>
          <p className="mt-4 text-sm text-gray-400">We take privacy concerns seriously and respond to all inquiries.</p>
        </section>
      </CardContent>
    </Card>
  </div>
);

export default Privacy;