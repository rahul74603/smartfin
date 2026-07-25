import { ShieldCheck, AlertTriangle, User, Target, CheckCircle2, FileText, Scale, Calculator } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// ==================== 1. ABOUT US (Authority & Trust) ====================
export const AboutUs = () => (
  <Card className="bg-white shadow-lg mx-2 sm:mx-0 border-t-4 border-deepblue-600">
    <CardHeader>
      <CardTitle className="text-2xl sm:text-3xl font-bold flex items-center gap-3 text-deepblue-900">
        <User className="w-8 h-8 text-deepblue-600" /> About SmartFintool
      </CardTitle>
      <CardDescription className="text-base text-gray-500 italic">Leading the way in Financial Literacy in India</CardDescription>
    </CardHeader>
    <CardContent className="space-y-6 text-sm sm:text-base text-gray-700 leading-relaxed">
      <p>
        Welcome to <strong>SmartFintool.com</strong>, founded by <strong>Rahul Kumar</strong>. We are dedicated to providing the most accurate, transparent, and user-friendly financial planning tools for the Indian investor community.
      </p>

      <div className="grid md:grid-cols-2 gap-6 py-4">
        <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 shadow-sm">
          <h3 className="text-lg font-bold text-deepblue-900 flex items-center gap-2 mb-3">
            <Target className="w-5 h-5" /> Our Vision
          </h3>
          <p className="text-sm leading-relaxed">
            In a country where financial literacy is still growing, our vision is to simplify complex calculations. We want to help you understand the <strong>Power of Compounding</strong> so you can retire wealthy and secure.
          </p>
        </div>
        <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100 shadow-sm">
          <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5" /> Why SmartFintool?
          </h3>
          <ul className="text-sm space-y-2">
            <li className="flex items-start gap-2"><span>•</span> <strong>No Hidden Costs:</strong> All our tools are 100% free, forever.</li>
            <li className="flex items-start gap-2"><span>•</span> <strong>Privacy Focused:</strong> Your data never leaves your browser.</li>
            <li className="flex items-start gap-2"><span>•</span> <strong>Expert Grade:</strong> Formulas verified against industry standards.</li>
          </ul>
        </div>
      </div>

      <p className="border-l-4 border-deepblue-200 pl-4 py-2 italic bg-gray-50 rounded-r-lg">
        "Our goal is to ensure that every Indian, regardless of their financial background, has access to professional-grade tools to plan their SIP, SWP, and retirement goals accurately." — <strong>Rahul Kumar</strong>
      </p>
    </CardContent>
  </Card>
);

// ==================== 2. PRIVACY POLICY (Data Safety) ====================
export const PrivacyPolicy = () => (
  <Card className="bg-white shadow-lg mx-2 sm:mx-0">
    <CardHeader className="border-b border-gray-100">
      <CardTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-deepblue-900">
        <ShieldCheck className="w-7 h-7 text-emerald-600" /> Privacy Policy
      </CardTitle>
      <CardDescription>Last Updated: {new Date().toLocaleDateString()}</CardDescription>
    </CardHeader>
    <CardContent className="space-y-6 text-sm sm:text-base text-gray-700 pt-6">
      <section>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Zero Data Collection Policy</h3>
        <p>
          SmartFintool follows a strict <strong>Privacy-by-Design</strong> approach. We are a 100% client-side application. This means:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
          <li>We do NOT store your investment amounts or tenures on any server.</li>
          <li>We do NOT ask for your name, email, or bank details.</li>
          <li>All calculations happen locally within your device's browser.</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Google Analytics & Cookies</h3>
        <p>
          We use Google Analytics to monitor traffic patterns and improve our user interface. This data is anonymous and includes browser types, pages visited, and time spent on the site. We use local storage only to remember your theme preferences.
        </p>
      </section>

      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-xs text-gray-500">
          By using this website, you hereby consent to our Privacy Policy and agree to its terms.
        </p>
      </div>
    </CardContent>
  </Card>
);

// ==================== 3. TERMS OF SERVICE (Usage Rules) ====================
export const TermsOfService = () => (
  <Card className="bg-white shadow-lg mx-2 sm:mx-0">
    <CardHeader className="border-b border-gray-100">
      <CardTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-deepblue-900">
        <FileText className="w-7 h-7 text-blue-600" /> Terms of Service
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-6 text-sm sm:text-base text-gray-700 pt-6">
      <section>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Acceptance of Terms</h3>
        <p>
          By accessing <strong>SmartFintool.com</strong>, you agree to be bound by these terms. If you do not agree, please stop using the site immediately.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Permitted Use</h3>
        <p>
          The calculators are provided for personal, educational, and informational use only. You may not:
        </p>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
          <li>Use our tools for any illegal financial advisory services.</li>
          <li>Attempt to scrape or reverse-engineer the calculator algorithms.</li>
          <li>Republish our tool interface without written permission from Rahul Kumar.</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Modifications</h3>
        <p>
          We reserve the right to change these terms at any time. Your continued use of the site signifies acceptance of any updates.
        </p>
      </section>
    </CardContent>
  </Card>
);

// ==================== 4. DISCLAIMER (Legal & SEO Protection) ====================
export const Disclaimer = () => (
  <Card className="bg-white shadow-lg mx-2 sm:mx-0 border-l-4 border-red-500">
    <CardHeader>
      <CardTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-red-700">
        <Scale className="w-7 h-7" /> Financial Disclaimer
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-6 text-sm sm:text-base text-gray-700">
      <div className="bg-red-50 border border-red-200 p-5 rounded-xl shadow-inner">
        <div className="flex items-center gap-2 text-red-700 font-extrabold mb-2 uppercase tracking-wide">
          <AlertTriangle className="w-6 h-6" /> Market Risk Warning
        </div>
        <p className="text-red-900 font-medium leading-relaxed">
          Mutual Fund investments are subject to market risks. Read all scheme-related documents carefully. 
          The projections provided by SmartFintool are estimates based on mathematical models and historical trends. 
          <strong> They do not guarantee future returns.</strong>
        </p>
      </div>

      <section>
        <h3 className="text-lg font-bold text-gray-900 mb-2">No Financial Advice</h3>
        <p>
          The information on this website is provided as general information only. It should not be considered as professional financial advice. <strong>SmartFintool</strong> and its owner <strong>Rahul Kumar</strong> are not SEBI-registered advisors. Always consult a certified financial planner before making any actual investment.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Limitation of Liability</h3>
        <p>
          SmartFintool will not be liable for any direct or indirect loss or damage arising from the use of our calculators or reliance on the results generated.
        </p>
      </section>

      <section className="bg-gray-100 p-4 rounded-lg">
        <p className="font-bold text-gray-900">Legal Contact:</p>
        <p className="text-blue-600 font-medium underline">help@SmartFintool.com</p>
      </section>
    </CardContent>
  </Card>
);

// ==================== 404 PAGE (Error Handling) ====================
export const NotFoundPage = ({ goHome }: { goHome: () => void }) => (
  <div className="text-center py-20 px-4">
    <div className="flex justify-center mb-6 scale-110">
      <div className="relative">
        <Calculator className="w-24 h-24 text-gray-200" />
        <AlertTriangle className="w-12 h-12 text-amber-500 absolute bottom-0 right-0" />
      </div>
    </div>
    <h2 className="text-3xl sm:text-5xl font-extrabold text-deepblue-900 mb-4 tracking-tight">404 - Calculation Error!</h2>
    <p className="text-base sm:text-xl text-gray-600 mb-10 max-w-md mx-auto leading-relaxed">
      Oops! It looks like our calculator couldn't find that page. Let's get your financial planning back on track.
    </p>
    <Button 
      onClick={goHome} 
      className="bg-deepblue-900 hover:bg-deepblue-800 text-white px-10 py-7 text-lg rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95"
    >
      Return to Home
    </Button>
  </div>
);