import { Scale, AlertTriangle, ShieldAlert, FileWarning } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const Disclaimer = () => (
  <div className="max-w-6xl mx-auto">
    <Card className="bg-white shadow-2xl border-none rounded-[2.5rem] overflow-hidden">
      <CardHeader className="bg-red-600 text-white p-8 sm:p-12 text-center">
        <Scale className="w-12 h-12 mx-auto mb-4" />
        <CardTitle className="text-3xl sm:text-4xl font-black">Financial Disclaimer</CardTitle>
        <p className="text-red-100 mt-2">Important Risk Notice for SmartFintool Calculator Users</p>
      </CardHeader>

      <CardContent className="p-8 sm:p-12 space-y-8 text-gray-700 leading-relaxed">
        <div className="bg-red-50 border-l-8 border-red-500 p-6 rounded-r-3xl flex gap-4 items-start">
          <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-black text-red-900 mb-2 uppercase tracking-wide">Market Risk Warning</h3>
            <p className="text-red-800 font-bold italic">
              Mutual Fund investments are subject to market risks. Read all scheme related documents carefully before investing.
            </p>
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-2">
            <ShieldAlert className="text-red-600" /> Educational Use Only
          </h2>
          <p>
            SmartFintool calculators are developed for educational, informational, and preliminary planning purposes. Outputs from SIP, SWP, Lumpsum, Compound Interest, and Simple Interest calculators are not investment guarantees.
          </p>
          <p>
            Any financial decision based on these values should be validated with your own research, risk profile, and professional consultation.
          </p>
        </section>

        <section className="space-y-4 border-t pt-8">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">No Advisor-Client Relationship</h2>
          <p>
            Use of SmartFintool does not create an advisor-client relationship. Platform ownership and content do not constitute personalized investment advice, tax advice, or legal advisory.
          </p>
          <p>
            For portfolio allocation, retirement strategy, tax-efficient planning, and regulatory compliance, users should consult a certified financial professional.
          </p>
        </section>

        <section className="space-y-4 border-t pt-8">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Assumption and Data Limitations</h2>
          <p>
            Calculator models use user-entered assumptions like expected return, tenure, inflation, and withdrawal amount. If assumptions are unrealistic, projections can deviate significantly from real-world outcomes.
          </p>
          <p>
            Historical market performance, benchmark comparisons, and mathematical projections do not ensure future returns.
          </p>
        </section>

        <section className="space-y-4 border-t pt-8">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Limitation of Liability</h2>
          <p>
            SmartFintool, its owner, contributors, and affiliates are not liable for direct, indirect, incidental, or consequential losses arising from use of calculator results or content interpretation.
          </p>
          <p>
            By continuing to use this website, you acknowledge and accept full responsibility for independent financial decision making.
          </p>
        </section>

        <section className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-3">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2"><FileWarning className="w-5 h-5" /> Quick Disclaimer FAQ</h2>
          <p><strong>Are SmartFintool returns guaranteed?</strong> No, projections are estimate based and market outcomes vary.</p>
          <p><strong>Can this replace professional advice?</strong> No, use this platform as a planning aid, not as a substitute for certified advisory.</p>
          <p><strong>Should I verify before investing?</strong> Yes, always verify assumptions and consult experts for major financial decisions.</p>
        </section>
      </CardContent>
    </Card>
  </div>
);

export default Disclaimer;
