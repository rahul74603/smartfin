import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Calculator,
  TrendingUp,
  Wallet,
  PieChart,
  IndianRupee,
  Mail,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  FileText,
  Scale,
  User,
  Lock,
} from 'lucide-react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import './App.css';

import SIPCalculator from './components/SIPCalculator';
import SWPCalculator from './components/SWPCalculator';
import CompoundInterestCalculator from './components/CompoundInterestCalculator';
import SimpleInterestCalculator from './components/SimpleInterestCalculator';
import LumpsumCalculator from './components/LumpsumCalculator';

import About from './pages/About';
import Disclaimer from './pages/Disclaimer';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import AdminPanel from './pages/AdminPanel';
import Resources from './pages/Resources';
import Comparisons from './pages/Comparisons';
import { NotFoundPage } from './components/Pages';
import { ADMIN_SETTINGS_EVENT, loadAdminSettings } from './lib/adminSettings';
import BlogDetail from './pages/BlogDetail';

// ─── Types ────────────────────────────────────────────────────────────────────
type FAQ = { question: string; answer: string };

type SEOEntry = {
  title: string;
  description: string;
  keywords: string;
  canonicalPath: string;
  faqs: FAQ[];
};

type SEOCopy = {
  heading: string;
  subheading: string;
  paragraphs: string[];
  faqs: FAQ[];
};

// ─── Constants ────────────────────────────────────────────────────────────────
const BASE_URL = 'https://smartfintool.com';

// ─── Calculator Meta (icon + gradient) ────────────────────────────────────────
const calcMeta: Record<
  string,
  { gradient: string; icon: React.ReactNode; label: string }
> = {
  sip: {
    gradient: 'from-blue-500 to-indigo-700',
    icon: <TrendingUp className="w-7 h-7 text-white" />,
    label: 'SIP Calculator',
  },
  swp: {
    gradient: 'from-purple-500 to-fuchsia-700',
    icon: <Wallet className="w-7 h-7 text-white" />,
    label: 'SWP Calculator',
  },
  compound: {
    gradient: 'from-emerald-500 to-teal-700',
    icon: <PieChart className="w-7 h-7 text-white" />,
    label: 'Compound Interest',
  },
  simple: {
    gradient: 'from-rose-500 to-orange-700',
    icon: <Calculator className="w-7 h-7 text-white" />,
    label: 'Simple Interest',
  },
  lumpsum: {
    gradient: 'from-indigo-500 to-blue-800',
    icon: <IndianRupee className="w-7 h-7 text-white" />,
    label: 'Lumpsum Calculator',
  },
};

// ─── Mobile Nav Icons ─────────────────────────────────────────────────────────
const mobileNavIcon: Record<string, React.ReactNode> = {
  sip: <TrendingUp className="w-6 h-6" />,
  swp: <Wallet className="w-6 h-6" />,
  compound: <PieChart className="w-6 h-6" />,
  simple: <Calculator className="w-6 h-6" />,
  lumpsum: <IndianRupee className="w-6 h-6" />,
};

// ─── SEO Data Per Route ───────────────────────────────────────────────────────
const seoByRoute: Record<string, SEOEntry> = {
  sip: {
    title: 'SIP Calculator India 2026 – Free Mutual Fund SIP Return Calculator',
    description:
      'Calculate SIP maturity amount, total invested value, and inflation-adjusted wealth with SmartFintool free SIP calculator. Best SIP calculator India 2026 for long-term mutual fund planning.',
    keywords:
      'sip calculator, sip calculator india, mutual fund sip calculator, sip return calculator, sip maturity calculator, monthly sip calculator, best sip calculator india 2026, sip investment calculator, inflation adjusted sip',
    canonicalPath: '/',
    faqs: [
      {
        question: 'What is a SIP calculator and how does it work?',
        answer:
          'A SIP calculator estimates maturity corpus from monthly investment amount, expected annual return rate, and investment tenure using compound interest formula. It helps plan long-term wealth creation goals.',
      },
      {
        question: 'How much SIP is needed to get 1 crore in 10 years?',
        answer:
          'To accumulate 1 crore in 10 years at 12% expected return, you need approximately ₹43,000 monthly SIP. Use SmartFintool SIP calculator to test different scenarios.',
      },
      {
        question: 'Can SIP calculator show inflation-adjusted returns?',
        answer:
          'Yes. SmartFintool SIP calculator shows both nominal maturity value and inflation-adjusted real value so you understand actual purchasing power of future wealth.',
      },
      {
        question: 'Is SIP better than fixed deposit for long-term investment?',
        answer:
          'SIP in equity mutual funds historically gives higher returns than FD over 10+ years but carries market risk. FD gives guaranteed returns with lower growth potential.',
      },
      {
        question: 'What is the minimum SIP amount in India?',
        answer:
          'Most mutual funds allow SIP starting from ₹100 to ₹500 per month. SmartFintool SIP calculator works for any investment amount to show projected growth.',
      },
      {
        question: 'Are SIP calculator results guaranteed?',
        answer:
          'No. SIP calculator results are mathematical estimates based on assumed return rates. Actual mutual fund returns vary with market conditions and are not guaranteed.',
      },
    ],
  },

  swp: {
    title: 'SWP Calculator India 2026 – Systematic Withdrawal Plan Calculator',
    description:
      'Plan monthly income from mutual fund corpus with SmartFintool free SWP calculator. Calculate total withdrawal, final balance, and sustainability for retirement planning India 2026.',
    keywords:
      'swp calculator, swp calculator india, systematic withdrawal plan calculator, retirement withdrawal calculator, monthly income mutual fund, swp mutual fund calculator, pension withdrawal calculator india',
    canonicalPath: '/swp',
    faqs: [
      {
        question: 'What is SWP in mutual fund?',
        answer:
          'SWP (Systematic Withdrawal Plan) allows investors to withdraw a fixed amount periodically from their mutual fund corpus while remaining investment continues to grow.',
      },
      {
        question: 'How does SWP calculator work?',
        answer:
          'SWP calculator takes corpus amount, expected return rate, monthly withdrawal amount, and tenure to estimate how long the corpus lasts and final remaining balance.',
      },
      {
        question: 'Is SWP good for retirement planning in India?',
        answer:
          'Yes. SWP is one of the most tax-efficient ways to generate regular income in retirement. Long-term capital gains from equity funds are taxed at lower rates than FD interest.',
      },
      {
        question: 'What is the safe withdrawal rate for SWP?',
        answer:
          'A commonly used safe withdrawal rate is 3-4% annually of corpus. For ₹1 crore corpus, ₹25,000-33,000 monthly withdrawal is generally sustainable at 10-12% return.',
      },
      {
        question: 'Can corpus become zero in SWP?',
        answer:
          'Yes. If withdrawal amount exceeds returns generated, corpus depletes over time. SmartFintool SWP calculator shows when corpus may exhaust so you can plan accordingly.',
      },
      {
        question: 'What is difference between SIP and SWP?',
        answer:
          'SIP is for wealth creation where you invest monthly. SWP is for wealth distribution where you withdraw monthly. They are opposite phases of investment lifecycle.',
      },
    ],
  },

  compound: {
    title: 'Compound Interest Calculator India 2026 – Power of Compounding Tool',
    description:
      'Calculate compound interest with monthly, quarterly, and yearly compounding frequency. Free calculator for FD, mutual fund, and investment planning in India 2026.',
    keywords:
      'compound interest calculator, compound interest calculator india, compounding calculator, power of compounding calculator, monthly compounding calculator, fd compound interest calculator, annual compounding calculator india',
    canonicalPath: '/compound',
    faqs: [
      {
        question: 'What is compound interest formula?',
        answer:
          'Compound Interest = P × (1 + r/n)^(nt) − P, where P is principal, r is annual rate, n is compounding frequency per year, and t is time in years.',
      },
      {
        question: 'How does compounding frequency affect returns?',
        answer:
          'Higher compounding frequency means more frequent interest calculation. Monthly compounding gives higher returns than yearly compounding for same annual rate.',
      },
      {
        question: 'What is the Rule of 72 in compound interest?',
        answer:
          'Rule of 72 says divide 72 by annual return rate to estimate years needed to double money. At 12% return, money doubles in approximately 6 years.',
      },
      {
        question: 'Which investments use compound interest in India?',
        answer:
          'Fixed deposits, PPF, EPF, mutual funds, NPS, and savings accounts all use compounding. Frequency varies by product type.',
      },
      {
        question: 'What is the difference between compound and simple interest?',
        answer:
          'Simple interest is calculated only on principal. Compound interest is calculated on principal plus accumulated interest, leading to exponential growth over time.',
      },
      {
        question: 'Is compound interest taxable in India?',
        answer:
          'Yes. Interest income from FD compounding is taxable as per income tax slab. Mutual fund gains have separate capital gains tax rules depending on holding period.',
      },
    ],
  },

  simple: {
    title: 'Simple Interest Calculator India 2026 – SI Formula Calculator',
    description:
      'Calculate simple interest, total interest amount, and maturity value instantly. Free simple interest calculator India 2026 using principal rate time formula for loans and savings.',
    keywords:
      'simple interest calculator, simple interest calculator india, si calculator, principal rate time calculator, interest calculator india, loan interest calculator, simple interest formula calculator',
    canonicalPath: '/simple',
    faqs: [
      {
        question: 'What is simple interest formula?',
        answer:
          'Simple Interest = (Principal × Rate × Time) / 100. Total amount = Principal + Simple Interest. It is linear and calculated only on original principal.',
      },
      {
        question: 'When is simple interest used in India?',
        answer:
          'Simple interest is used in short-term personal loans, vehicle loans initial calculations, some government schemes, and educational understanding of interest concepts.',
      },
      {
        question: 'What is difference between simple and compound interest?',
        answer:
          'Simple interest is calculated on principal only and grows linearly. Compound interest grows on principal plus accumulated interest and increases exponentially.',
      },
      {
        question: 'Is simple interest better for borrowers?',
        answer:
          'Yes. Borrowers pay less with simple interest compared to compound interest for same rate and tenure. Compound interest costs more over long periods.',
      },
      {
        question: 'Does any Indian bank offer simple interest on savings?',
        answer:
          'Most Indian banks offer simple interest on savings accounts calculated daily or quarterly. FDs typically use compound interest for better growth.',
      },
      {
        question: 'How to calculate EMI using simple interest?',
        answer:
          'Basic EMI = (Principal + Simple Interest) / Number of months. For accurate EMI, use compound reducing balance method which most banks use for home and car loans.',
      },
    ],
  },

  lumpsum: {
    title: 'Lumpsum Calculator India 2026 – One Time Investment Return Calculator',
    description:
      'Calculate one-time investment maturity value, inflation-adjusted returns, and year-wise growth with SmartFintool free lumpsum calculator India 2026 for mutual fund and long-term wealth planning.',
    keywords:
      'lumpsum calculator, lumpsum calculator india, one time investment calculator, lumpsum mutual fund calculator, lumpsum investment return calculator, inflation adjusted investment calculator, lumpsum vs sip calculator india',
    canonicalPath: '/lumpsum',
    faqs: [
      {
        question: 'What is lumpsum investment in mutual fund?',
        answer:
          'Lumpsum investment means investing a large one-time amount in mutual fund instead of monthly SIP. It is suitable when you have surplus funds like bonus, inheritance, or maturity proceeds.',
      },
      {
        question: 'Is lumpsum better than SIP?',
        answer:
          'It depends on market conditions. Lumpsum works better when market is at low valuation. SIP works better in volatile markets by averaging purchase cost. Hybrid approach suits most investors.',
      },
      {
        question: 'How does lumpsum calculator work?',
        answer:
          'Lumpsum calculator uses formula: Maturity Value = P × (1 + r)^t where P is invested amount, r is annual return rate, and t is tenure in years.',
      },
      {
        question: 'What is a good return expectation for lumpsum in India?',
        answer:
          'Equity mutual funds have historically given 10-14% CAGR over long term in India. Use 10-12% as moderate assumption for lumpsum planning calculations.',
      },
      {
        question: 'Can lumpsum calculator show inflation-adjusted value?',
        answer:
          'Yes. SmartFintool lumpsum calculator shows both nominal maturity value and inflation-adjusted real value to help you understand actual future purchasing power.',
      },
      {
        question: 'What is minimum lumpsum investment in mutual fund India?',
        answer:
          'Minimum lumpsum investment in most mutual funds in India is ₹1,000 to ₹5,000 depending on fund house and scheme type.',
      },
    ],
  },

  about: {
    title: 'About SmartFintool – Free Financial Calculator Platform India',
    description:
      'SmartFintool is India free financial calculator platform for SIP, SWP, Lumpsum, compound and simple interest planning. Know our mission, vision, and founder story.',
    keywords:
      'about smartfintool, financial calculator india, sip calculator platform, free investment calculator india, smartfintool mission',
    canonicalPath: '/about',
    faqs: [
      {
        question: 'Is SmartFintool actually free, or are there hidden charges?',
        answer:
          'It is 100% free! There are no hidden charges, no premium plans, and you don\'t even need to create an account. Just open the website and start calculating your wealth right away.',
      },
      {
        question: 'I am a total beginner. Is this website for me?',
        answer:
          'Absolutely! We built SmartFintool especially for beginners. Whether you just got your first salary, or you are planning for retirement, our tools are super easy to use. No complicated finance jargon—just simple, clear results.',
      },
      {
        question: 'What kind of calculators can I find here?',
        answer:
          'We have all the essential tools you need! Want to see how your monthly savings grow? Use the SIP Calculator. Got a big bonus? Check the Lumpsum Calculator. Planning to withdraw monthly? Use the SWP tool. We also have standard interest calculators.',
      },
      {
        question: 'Are the calculation results accurate? Can I trust them?',
        answer:
          'Yes, the math is 100% accurate because we use standard financial formulas. However, remember that real-world mutual funds depend on the stock market. So, treat these numbers as a very good estimate for your planning, not a magical guarantee.',
      },
      {
        question: 'Will you tell me which mutual fund to buy?',
        answer:
          'No, we don\'t give investment advice. SmartFintool is strictly an educational tool to help you do your own math. We highly recommend talking to a certified financial advisor before investing your hard-earned money.',
      },
      {
        question: 'Do you update the website regularly?',
        answer:
          'Yes, we do! We constantly improve our calculators, add new features, and write helpful guides to make sure you always have the best and most accurate tools for your financial journey.',
      },
    ],
  },

  'privacy-policy': {
    title: 'Privacy Policy – SmartFintool Financial Calculator India',
    description:
      'Read SmartFintool privacy policy for data handling, cookie usage, calculator input privacy, and visitor rights. We respect your financial data privacy.',
    keywords:
      'smartfintool privacy policy, calculator privacy policy india, financial tool data privacy, cookie policy smartfintool',
    canonicalPath: '/privacy-policy',
    faqs: [
      {
        question: 'Does SmartFintool store my calculator inputs?',
        answer:
          'No. All calculator computations run locally in your browser. Investment values entered in calculators are not sent to or stored on SmartFintool servers.',
      },
      {
        question: 'Does SmartFintool use cookies?',
        answer:
          'SmartFintool may use basic cookies or local storage for functional experience like remembering preferences. No financial data is stored via cookies.',
      },
      {
        question: 'How to contact SmartFintool for privacy concerns?',
        answer:
          'Write to help@smartfintool.com for any privacy related concerns, data removal requests, or questions about data handling.',
      },
      {
        question: 'Does SmartFintool share user data with third parties?',
        answer:
          'SmartFintool does not sell or share personal financial data with third parties. Basic analytics may use anonymized aggregate data only.',
      },
      {
        question: 'Is SmartFintool GDPR compliant?',
        answer:
          'SmartFintool follows best practices for user data privacy. Since no personal financial data is collected through calculators, compliance risk is minimal.',
      },
      {
        question: 'Can I use SmartFintool without creating an account?',
        answer:
          'Yes. All calculators are fully accessible without registration or account creation. No personal information is required to use any calculator.',
      },
    ],
  },

  terms: {
    title: 'Terms of Service – SmartFintool Calculator Platform India',
    description:
      'Review SmartFintool terms of service for calculator usage, content ownership, legal limitations, and acceptable use policy for India users.',
    keywords:
      'smartfintool terms of service, calculator terms india, financial tool terms conditions, legal policy smartfintool',
    canonicalPath: '/terms',
    faqs: [
      {
        question: 'Are SmartFintool calculator outputs investment advice?',
        answer:
          'No. Calculator outputs are mathematical projections for educational planning purposes only. They do not constitute SEBI registered investment advice.',
      },
      {
        question: 'Can SmartFintool terms of service change?',
        answer:
          'Yes. SmartFintool may update terms periodically. Continued use of the platform after changes indicates acceptance of updated terms.',
      },
      {
        question: 'Can SmartFintool content be copied or reproduced?',
        answer:
          'Unauthorized copying, scraping, or republishing of SmartFintool content including calculator outputs, articles, and guides is not permitted.',
      },
      {
        question: 'Who is liable for investment decisions based on calculator results?',
        answer:
          'Users are solely responsible for investment decisions. SmartFintool provides tools for estimation only and bears no liability for financial outcomes.',
      },
      {
        question: 'Can I use SmartFintool for commercial purposes?',
        answer:
          'SmartFintool is intended for personal financial planning use. Commercial use or embedding calculators without permission is not allowed.',
      },
      {
        question: 'What jurisdiction governs SmartFintool terms?',
        answer:
          'SmartFintool terms of service are governed by laws of India. Disputes will be subject to jurisdiction of Indian courts.',
      },
    ],
  },

  disclaimer: {
    title: 'Financial Disclaimer – SmartFintool Investment Calculator India',
    description:
      'Read SmartFintool financial disclaimer for SIP, SWP, Lumpsum, and interest calculators. All outputs are estimates and not guaranteed investment returns.',
    keywords:
      'smartfintool disclaimer, financial calculator disclaimer, mutual fund risk disclaimer, investment calculator india disclaimer',
    canonicalPath: '/disclaimer',
    faqs: [
      {
        question: 'Are SmartFintool calculator returns guaranteed?',
        answer:
          'No. All calculator outputs are mathematical projections based on assumed return rates. Actual mutual fund and market returns are not guaranteed and will vary.',
      },
      {
        question: 'Is SmartFintool a SEBI registered investment advisor?',
        answer:
          'No. SmartFintool is an educational financial calculator platform only. It is not registered with SEBI as an investment advisor.',
      },
      {
        question: 'Should I consult a financial advisor before investing?',
        answer:
          'Yes. Always consult a SEBI registered financial advisor before making investment decisions. SmartFintool calculators are tools for initial planning and education only.',
      },
      {
        question: 'What risks are involved in mutual fund investments?',
        answer:
          'Mutual fund investments are subject to market risk, credit risk, liquidity risk, and inflation risk. Past performance does not guarantee future results.',
      },
      {
        question: 'Does SmartFintool take responsibility for losses?',
        answer:
          'No. SmartFintool bears no liability for financial losses arising from investment decisions made based on calculator projections.',
      },
      {
        question: 'Are tax calculations shown in SmartFintool accurate?',
        answer:
          'Tax illustrations if any are indicative only. Tax laws change frequently. Consult a tax professional for accurate tax planning.',
      },
    ],
  },

  admin: {
    title: 'Admin Panel – SmartFintool',
    description:
      'Protected SmartFintool admin panel for managing calculator defaults, branding, and website settings.',
    keywords: 'smartfintool admin',
    canonicalPath: '/admin',
    faqs: [
      {
        question: 'What is SmartFintool admin panel?',
        answer:
          'A protected internal panel to manage website settings, calculator defaults, and branding configurations.',
      },
      {
        question: 'Is admin panel accessible to public?',
        answer:
          'No. Admin panel is for authorized internal use only and is marked noindex to prevent search engine visibility.',
      },
      {
        question: 'What can be managed from admin panel?',
        answer:
          'Admin panel allows managing site branding, calculator default values, legal text, and hero section content.',
      },
    ],
  },

  resources: {
    title: 'Financial Blog & Investment Guides India 2026 – SmartFintool Resources',
    description:
      'Free financial education, investment guides, SIP tutorials, mutual fund articles, and wealth planning content. Learn financial planning with SmartFintool expert resources India 2026.',
    keywords:
      'financial blog india, investment guides india 2026, mutual fund tutorial, sip guide india, financial planning articles, wealth building tips india, smartfintool resources',
    canonicalPath: '/resources',
    faqs: [
      {
        question: 'What financial topics are covered in SmartFintool resources?',
        answer:
          'Resources cover mutual fund investing, SIP planning, retirement strategy, compound interest, tax saving investments, portfolio allocation, and financial calculator guides.',
      },
      {
        question: 'Are SmartFintool guides updated for 2026?',
        answer:
          'Yes. Financial guides and articles are regularly updated with latest market trends, budget changes, and tax rules applicable for 2026.',
      },
      {
        question: 'Are SmartFintool resources free to read?',
        answer:
          'Yes. All articles, guides, and educational content on SmartFintool resources section are completely free with no subscription required.',
      },
      {
        question: 'Can I share SmartFintool articles?',
        answer:
          'Yes. You can share article links freely. Copying full article content for republishing without permission is not allowed.',
      },
      {
        question: 'Does SmartFintool publish SIP beginner guides?',
        answer:
          'Yes. SmartFintool publishes step-by-step guides for SIP beginners including how to start, how much to invest, and how to use SIP calculator effectively.',
      },
      {
        question: 'Is there a newsletter for SmartFintool financial updates?',
        answer:
          'SmartFintool is working on email newsletter for financial tips and calculator updates. Check resources section for latest content.',
      },
    ],
  },

  comparisons: {
    title: 'SIP vs Lumpsum vs SWP Investment Comparison Guide India 2026',
    description:
      'Complete investment strategy comparison guide India 2026. Compare SIP monthly investing, Lumpsum one-time investment, and SWP withdrawal planning to choose best strategy for your goals.',
    keywords:
      'sip vs lumpsum comparison india, investment strategy comparison 2026, sip vs lumpsum returns, lumpsum vs sip which is better, swp vs sip comparison, best investment strategy india',
    canonicalPath: '/comparisons',
    faqs: [
      {
        question: 'Which investment strategy is best in India: SIP, Lumpsum, or SWP?',
        answer:
          'No single strategy is universally best. SIP suits regular income earners. Lumpsum suits those with surplus capital. SWP suits retirees needing periodic income.',
      },
      {
        question: 'Can I combine SIP and Lumpsum investment strategies?',
        answer:
          'Yes. A hybrid approach like investing annual bonus as lumpsum while continuing monthly SIP is an effective strategy used by many successful investors in India.',
      },
      {
        question: 'Does market condition affect SIP vs Lumpsum decision?',
        answer:
          'Yes. Lumpsum timing matters significantly. In falling markets, lumpsum can give excellent returns. SIP averages cost in all market conditions reducing timing risk.',
      },
      {
        question: 'What is better for first-time investors in India?',
        answer:
          'SIP is generally better for first-time investors as it requires smaller amounts, builds investment discipline, and reduces risk through rupee cost averaging.',
      },
      {
        question: 'When should I switch from SIP to SWP?',
        answer:
          'Consider switching to SWP when you reach your wealth target and need regular income, typically at retirement or when passive income goal is achieved.',
      },
      {
        question: 'How does SmartFintool comparison guide help investors?',
        answer:
          'SmartFintool comparison guide explains pros and cons of each strategy with real examples, helping investors make informed decisions based on their goals and income profile.',
      },
    ],
  },
};

// ─── SEO Copy for Calculator Pages ───────────────────────────────────────────
const calculatorSEOContent: Record<string, SEOCopy> = {
  sip: {
    heading: 'SIP Calculator India 2026: Complete Guide to Monthly SIP Investment',
    subheading:
      'How much SIP do you need for 1 crore, retirement, or child education?',
    paragraphs: [
      'SmartFintool SIP calculator is designed for investors looking for practical answers like how much SIP is needed to achieve 1 crore, plan child education fund, or build retirement corpus. You can test multiple return assumptions from 8% to 15%, different tenure combinations from 5 to 30 years, and see exact impact of inflation on your future wealth.',
      'Whether you are a salaried employee starting first SIP, a business owner planning disciplined savings, or an experienced investor optimizing portfolio allocation, this SIP calculator gives detailed breakdown of total invested amount, estimated returns, and maturity value. Inflation-adjusted output shows real purchasing power of your future wealth.',
      'Use SmartFintool SIP calculator results alongside SWP calculator for complete financial lifecycle planning. Build wealth through SIP phase then systematically withdraw through SWP phase in retirement. Combine with Lumpsum calculator when deploying annual bonuses alongside regular SIP.',
    ],
    faqs: seoByRoute.sip.faqs,
  },
  swp: {
    heading: 'SWP Calculator India 2026: Monthly Income and Retirement Withdrawal Guide',
    subheading:
      'How long will your retirement corpus last with monthly SWP withdrawals?',
    paragraphs: [
      'SmartFintool SWP calculator helps estimate how long your accumulated corpus can sustain regular monthly withdrawals. This is critical for retirement planning, passive income strategy, and post-retirement financial stability. Enter your corpus, expected return rate, monthly withdrawal need, and tenure to see total amount withdrawn and final remaining balance.',
      'Most Indian retirees face the challenge of making their retirement corpus last 25-30 years. SWP provides a structured withdrawal approach that is more tax-efficient than FD interest income. Equity fund long-term capital gains up to ₹1.25 lakh are tax-free and above that taxed at 12.5%, much lower than FD interest taxed at income slab rate.',
      'Test multiple scenarios with conservative 8%, moderate 10%, and optimistic 12% return assumptions to understand best case and worst case sustainability. If corpus runs out too early in projection, you need either higher corpus, lower withdrawal, or better return target before retirement.',
    ],
    faqs: seoByRoute.swp.faqs,
  },
  compound: {
    heading: 'Compound Interest Calculator India 2026: Power of Compounding Guide',
    subheading:
      'How does compounding frequency affect your investment growth over time?',
    paragraphs: [
      'Albert Einstein reportedly called compound interest the eighth wonder of the world. SmartFintool compound interest calculator helps you visualize exactly how money multiplies over time through compounding effect. Compare principal invested, total interest earned, and final maturity amount across different compounding frequencies.',
      'Compounding frequency makes significant difference over long periods. Monthly compounding gives higher returns than yearly compounding for same annual rate because interest is calculated and added more frequently. For example, 12% annual rate with monthly compounding gives effective annual yield of 12.68%.',
      'Use compound interest calculator for FD planning, PPF projections, and understanding mutual fund CAGR returns. For market-linked instruments, combine compound projections with realistic return assumptions and always factor in inflation to understand real wealth growth versus nominal number growth.',
    ],
    faqs: seoByRoute.compound.faqs,
  },
  simple: {
    heading: 'Simple Interest Calculator India 2026: SI Formula and Loan Interest Guide',
    subheading:
      'Quick simple interest calculation using principal, rate, and time formula.',
    paragraphs: [
      'SmartFintool simple interest calculator provides instant computation for principal, rate, and time-based linear interest problems. Whether you need to verify loan interest charges, understand basic interest concepts, or quickly calculate short-term lending amounts, this calculator gives clean and transparent breakdown.',
      'Simple interest formula SI = PRT/100 is straightforward and used for educational understanding, short-term personal loans, and some government schemes. Unlike compound interest which grows exponentially, simple interest grows linearly making it easier to calculate and verify manually.',
      'For long-term wealth creation through market-linked instruments, compound interest and SIP calculators provide more realistic projections because mutual funds, FDs, and most savings instruments use compounding. Use simple interest calculator for basic financial literacy and short-term planning scenarios.',
    ],
    faqs: seoByRoute.simple.faqs,
  },
  lumpsum: {
    heading: 'Lumpsum Calculator India 2026: One-Time Investment and Inflation-Adjusted Return Guide',
    subheading:
      'Calculate how much your one-time investment will grow with inflation adjustment.',
    paragraphs: [
      'SmartFintool lumpsum calculator helps estimate future value of a one-time investment with year-wise growth breakdown and inflation-adjusted maturity value. Ideal for planning deployment of annual bonus, inheritance received, property sale proceeds, or any surplus capital into mutual funds or long-term investments.',
      'Lumpsum investing requires market timing awareness that SIP does not. When markets are at fair or low valuation, lumpsum deployment can generate superior returns compared to spreading same amount over monthly SIPs. However during peak market conditions, lumpsum carries higher short-term risk of buying at high prices.',
      'Use inflation-adjusted output in SmartFintool lumpsum calculator to evaluate real purchasing power of projected maturity value. A nominal return of 1 crore after 20 years may have real value of 37 lakhs at 5% inflation. Understanding this gap helps set realistic financial goals and plan adequately for actual lifestyle needs.',
    ],
    faqs: seoByRoute.lumpsum.faqs,
  },
};

// ─── DOM SEO Helpers ──────────────────────────────────────────────────────────
const setMetaByName = (name: string, value: string) => {
  let el = document.querySelector(
    `meta[name="${name}"]`
  ) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
};

const setMetaByProperty = (property: string, value: string) => {
  let el = document.querySelector(
    `meta[property="${property}"]`
  ) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
};

const setCanonical = (href: string) => {
  let link = document.querySelector(
    'link[rel="canonical"]'
  ) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
};

const setJsonLd = (id: string, payload: object) => {
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(payload, null, 0);
};

const removeJsonLd = (id: string) => {
  document.getElementById(id)?.remove();
};

// ─── Breadcrumb Labels ────────────────────────────────────────────────────────
const breadcrumbLabels: Record<string, string> = {
  sip: 'SIP Calculator',
  swp: 'SWP Calculator',
  compound: 'Compound Interest Calculator',
  simple: 'Simple Interest Calculator',
  lumpsum: 'Lumpsum Calculator',
  about: 'About Us',
  'privacy-policy': 'Privacy Policy',
  terms: 'Terms of Service',
  disclaimer: 'Financial Disclaimer',
  resources: 'Financial Resources',
  comparisons: 'Investment Comparisons',
  admin: 'Admin Panel',
};

// ─── Trust Signals ────────────────────────────────────────────────────────────
const trustSignals = [
  {
    icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
    label: '100% Free',
    sub: 'No registration needed',
  },
  {
    icon: <Calculator className="w-5 h-5 text-blue-500" />,
    label: 'Browser-based',
    sub: 'Your data stays private',
  },
  {
    icon: <TrendingUp className="w-5 h-5 text-purple-500" />,
    label: 'India Focused',
    sub: 'INR and Indian norms',
  },
  {
    icon: <Sparkles className="w-5 h-5 text-amber-500" />,
    label: 'Inflation Aware',
    sub: 'Real value projections',
  },
];

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [adminSettings, setAdminSettings] = useState(() => loadAdminSettings());

  // ── Route Classification ────────────────────────────────────────────────────
  const infoPages = ['about', 'privacy-policy', 'terms', 'disclaimer'];
  const coreCalculators = ['sip', 'swp', 'compound', 'simple', 'lumpsum'];
  const adminPages = ['admin'];
  const contentPages = ['resources', 'comparisons'];
  const allValidPages = [
    ...infoPages,
    ...coreCalculators,
    ...adminPages,
    ...contentPages,
  ];

  const currentPath =
    location.pathname === '/'
      ? 'sip'
      : location.pathname.replace(/^\/|\/$/g, '');

  const isBlogPage = location.pathname.startsWith('/blog/');
  const isInfoPage = infoPages.includes(currentPath);
  const isAdminPage = adminPages.includes(currentPath);
  const isCalculatorPage =
    coreCalculators.includes(currentPath) || location.pathname === '/';
  const isContentPage = contentPages.includes(currentPath);
  const isValidPath =
    allValidPages.includes(currentPath) ||
    location.pathname === '/' ||
    isBlogPage;

  const activeTab = isCalculatorPage ? currentPath : isBlogPage ? 'resources' : '';
  const seoContent = calculatorSEOContent[activeTab] ?? calculatorSEOContent.sip;

  // ── Navigation ──────────────────────────────────────────────────────────────
  const handleNavigation = (id: string) => {
    navigate(id === 'sip' ? '/' : `/${id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Admin Settings Sync ─────────────────────────────────────────────────────
  useEffect(() => {
    const sync = () => setAdminSettings(loadAdminSettings());
    window.addEventListener(ADMIN_SETTINGS_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(ADMIN_SETTINGS_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  // ── SEO Effect ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isBlogPage) return;

    if (!isValidPath) {
      document.title = '404 Page Not Found | SmartFintool';
      setMetaByName(
        'description',
        'Page not found. Visit SmartFintool for free SIP, SWP, Lumpsum and interest calculators India.'
      );
      setMetaByName('robots', 'noindex, follow');
      setCanonical(`${BASE_URL}${location.pathname}`);
      removeJsonLd('sft-webpage');
      removeJsonLd('sft-faq');
      removeJsonLd('sft-breadcrumb');
      removeJsonLd('sft-organization');
      removeJsonLd('sft-sitelinks');
      return;
    }

    const seo = seoByRoute[currentPath] ?? seoByRoute.sip;
    const pageUrl = `${BASE_URL}${seo.canonicalPath}`;

    // ── Primary Meta ────────────────────────────────────────────────────────
    document.title = seo.title;
    setMetaByName('description', seo.description);
    setMetaByName('keywords', seo.keywords);
    setMetaByName(
      'robots',
      isAdminPage
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    );
    setMetaByName('author', adminSettings.brand.founderName);
    setMetaByName('language', 'en-IN');
    setMetaByName('geo.region', 'IN');
    setMetaByName('geo.country', 'India');

    // ── Canonical ───────────────────────────────────────────────────────────
    setCanonical(pageUrl);

    // ── Open Graph ──────────────────────────────────────────────────────────
    setMetaByProperty('og:type', 'website');
    setMetaByProperty('og:site_name', adminSettings.brand.siteName);
    setMetaByProperty('og:title', seo.title);
    setMetaByProperty('og:description', seo.description);
    setMetaByProperty('og:url', pageUrl);
    setMetaByProperty('og:image', `${BASE_URL}/banner.png`);
    setMetaByProperty('og:image:width', '1200');
    setMetaByProperty('og:image:height', '630');
    setMetaByProperty(
      'og:image:alt',
      `${adminSettings.brand.siteName} – Financial Calculator India`
    );
    setMetaByProperty('og:locale', 'en_IN');

    // ── Twitter Card ────────────────────────────────────────────────────────
    setMetaByName('twitter:card', 'summary_large_image');
    setMetaByName('twitter:site', '@smartfintool');
    setMetaByName('twitter:creator', '@smartfintool');
    setMetaByName('twitter:title', seo.title);
    setMetaByName('twitter:description', seo.description);
    setMetaByName('twitter:image', `${BASE_URL}/banner.png`);
    setMetaByName(
      'twitter:image:alt',
      `${adminSettings.brand.siteName} Calculator`
    );

    // ── Schema: WebPage / WebApplication ───────────────────────────────────
    setJsonLd('sft-webpage', {
      '@context': 'https://schema.org',
      '@type': isCalculatorPage ? 'WebApplication' : 'WebPage',
      name: seo.title,
      description: seo.description,
      url: pageUrl,
      inLanguage: 'en-IN',
      ...(isCalculatorPage && {
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web Browser',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
      }),
      isPartOf: {
        '@type': 'WebSite',
        name: adminSettings.brand.siteName,
        url: BASE_URL,
      },
      publisher: {
        '@type': 'Organization',
        name: adminSettings.brand.siteName,
        url: BASE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${BASE_URL}/logo192.png`,
          width: 192,
          height: 192,
        },
      },
      dateModified: new Date().toISOString().split('T')[0],
    });

    // ── Schema: FAQPage (SINGLE SOURCE - no duplicates) ─────────────────────
    setJsonLd('sft-faq', {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: seo.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    });

    // ── Schema: BreadcrumbList ──────────────────────────────────────────────
    const breadcrumbItems: object[] = [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
    ];
    if (currentPath !== 'sip') {
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 2,
        name: breadcrumbLabels[currentPath] ?? currentPath,
        item: pageUrl,
      });
    }
    setJsonLd('sft-breadcrumb', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems,
    });

    // ── Schema: Organization + SiteLinks (homepage only) ───────────────────
    if (currentPath === 'sip') {
      setJsonLd('sft-organization', {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: adminSettings.brand.siteName,
        url: BASE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${BASE_URL}/logo192.png`,
          width: 192,
          height: 192,
        },
        foundingDate: '2024',
        founder: { '@type': 'Person', name: adminSettings.brand.founderName },
        contactPoint: {
          '@type': 'ContactPoint',
          email: adminSettings.brand.supportEmail,
          contactType: 'customer support',
          availableLanguage: ['English', 'Hindi'],
        },
        areaServed: { '@type': 'Country', name: 'India' },
        sameAs: ['https://twitter.com/smartfintool'],
        description:
          'SmartFintool is India free financial calculator platform offering SIP, SWP, Lumpsum, Compound Interest and Simple Interest calculators.',
      });

      setJsonLd('sft-sitelinks', {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: adminSettings.brand.siteName,
        url: BASE_URL,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${BASE_URL}/?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      });
    } else {
      removeJsonLd('sft-organization');
      removeJsonLd('sft-sitelinks');
    }
  }, [
    adminSettings.brand.founderName,
    adminSettings.brand.siteName,
    adminSettings.brand.supportEmail,
    currentPath,
    isAdminPage,
    isBlogPage,
    isCalculatorPage,
    isValidPath,
    location.pathname,
  ]);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 md:pb-0 font-inter text-[#0f172a]">

      {/* ══ HEADER ═══════════════════════════════════════════════════════════ */}
      <header className="bg-[#0f172a] text-white sticky top-0 z-50 border-b border-white/5 shadow-2xl backdrop-blur-md bg-opacity-95">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">

          {/* Logo – using span not h1 to preserve h1 for page content */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate('/')}
            role="link"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
            aria-label="SmartFintool home"
          >
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-2xl group-hover:rotate-12 transition-transform shadow-lg shadow-blue-500/20">
              <Calculator className="w-8 h-8 md:w-7 md:h-7 text-white" />
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl md:text-2xl font-black leading-tight tracking-tighter">
                {adminSettings.brand.siteName}
              </span>
              <span className="block text-[11px] sm:text-[12px] md:text-[10px] text-blue-400 font-black uppercase tracking-[0.2em]">
                {adminSettings.brand.tagline}
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav
            className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/10"
            aria-label="Main navigation"
          >
            {coreCalculators.map((id) => (
              <button
                key={id}
                onClick={() => handleNavigation(id)}
                aria-label={`Open ${calcMeta[id].label}`}
                aria-current={activeTab === id ? 'page' : undefined}
                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === id
                    ? 'bg-blue-600 text-white shadow-xl scale-105'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {id}
              </button>
            ))}
            <div className="border-l border-white/10 ml-2 pl-2 flex gap-1">
              <button
                onClick={() => navigate('/resources')}
                aria-current={currentPath === 'resources' ? 'page' : undefined}
                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  currentPath === 'resources'
                    ? 'bg-blue-600 text-white shadow-xl scale-105'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Resources
              </button>
              <button
                onClick={() => navigate('/comparisons')}
                aria-current={currentPath === 'comparisons' ? 'page' : undefined}
                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  currentPath === 'comparisons'
                    ? 'bg-blue-600 text-white shadow-xl scale-105'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                Compare
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* ══ MAIN ═════════════════════════════════════════════════════════════ */}
      <main id="main-content" className="container mx-auto px-4 py-8">

        {/* 404 */}
        {!isValidPath ? (
          <div className="py-12">
            <NotFoundPage goHome={() => navigate('/')} />
          </div>

        /* Info pages */
        ) : isInfoPage ? (
          <div className="max-w-5xl mx-auto py-12">
            {currentPath === 'about' && <About />}
            {currentPath === 'privacy-policy' && <Privacy />}
            {currentPath === 'terms' && <Terms />}
            {currentPath === 'disclaimer' && <Disclaimer />}
          </div>

        /* Admin */
        ) : isAdminPage ? (
          <div className="max-w-6xl mx-auto">
            <AdminPanel />
          </div>

        /* Content pages */
        ) : isContentPage ? (
          <div className="py-12">
            {currentPath === 'resources' && <Resources />}
            {currentPath === 'comparisons' && <Comparisons />}
          </div>

        /* Blog detail */
        ) : isBlogPage ? (
          <BlogDetail />

        /* ── Calculator Pages ── */
        ) : (
          <>
            {/* Hero */}
            <section
              className="relative overflow-hidden bg-[#0f172a] text-white py-16 sm:py-24 rounded-[3.5rem] mb-16 shadow-2xl border border-white/5"
              aria-label="Financial calculator selection"
            >
              <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

              <div className="container mx-auto px-4 relative z-10 text-center">
                <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full px-6 py-2 mb-8 shadow-inner">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                    Precision Financial Modeling
                  </span>
                </div>

                <h1 className="text-5xl sm:text-8xl font-black mb-8 tracking-tighter leading-[1.1]">
                  {activeTab === 'sip' && 'Free SIP'}
                  {activeTab === 'swp' && 'Free SWP'}
                  {activeTab === 'compound' && 'Compound Interest'}
                  {activeTab === 'simple' && 'Simple Interest'}
                  {activeTab === 'lumpsum' && 'Lumpsum'}
                  {' '}
                  <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                    Calculator India
                  </span>
                </h1>

                <p className="text-lg sm:text-2xl text-gray-400 max-w-3xl mx-auto mb-16 font-medium leading-relaxed">
                  {adminSettings.hero.subtitle}
                </p>

                {/* Calculator Picker */}
                <div className="hidden md:grid grid-cols-5 gap-6 max-w-6xl mx-auto">
                  {coreCalculators.map((id) => {
                    const meta = calcMeta[id];
                    return (
                      <button
                        key={id}
                        onClick={() => handleNavigation(id)}
                        aria-label={`Switch to ${meta.label}`}
                        aria-pressed={activeTab === id}
                        className={`group p-8 rounded-[2.5rem] transition-all border ${
                          activeTab === id
                            ? 'bg-white/10 border-white/20 shadow-2xl scale-110 backdrop-blur-xl ring-2 ring-blue-500/50'
                            : 'bg-[#1e293b]/40 border-white/5 hover:bg-white/5 hover:-translate-y-2'
                        }`}
                      >
                        <div
                          className={`mb-5 inline-flex p-5 rounded-3xl bg-gradient-to-br shadow-2xl transition-transform group-hover:scale-110 ${meta.gradient}`}
                        >
                          {meta.icon}
                        </div>
                        <span className="block text-[11px] font-black uppercase tracking-[0.2em] text-white">
                          {id}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Calculator Tabs */}
            <div className="max-w-[1400px] mx-auto">
              <Tabs value={activeTab} className="space-y-12">
                <TabsContent
                  value="sip"
                  className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-700"
                >
                  <SIPCalculator />
                </TabsContent>
                <TabsContent
                  value="swp"
                  className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-700"
                >
                  <SWPCalculator />
                </TabsContent>
                <TabsContent
                  value="compound"
                  className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-700"
                >
                  <CompoundInterestCalculator />
                </TabsContent>
                <TabsContent
                  value="simple"
                  className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-700"
                >
                  <SimpleInterestCalculator />
                </TabsContent>
                <TabsContent
                  value="lumpsum"
                  className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-700"
                >
                  <LumpsumCalculator />
                </TabsContent>
              </Tabs>
            </div>

            {/* SEO Content Section */}
            <section
              className="max-w-6xl mx-auto mt-20 rounded-[2.5rem] bg-white shadow-2xl border border-slate-100 p-8 sm:p-12 space-y-8"
              aria-labelledby="seo-heading"
            >
              <header>
                <h2
                  id="seo-heading"
                  className="text-2xl sm:text-4xl font-black text-[#0f172a]"
                >
                  {seoContent.heading}
                </h2>
                <p className="text-blue-600 font-bold mt-2 text-base sm:text-lg">
                  {seoContent.subheading}
                </p>
              </header>

              {seoContent.paragraphs.map((text, idx) => (
                <p
                  key={idx}
                  className="text-gray-700 leading-relaxed text-base sm:text-lg"
                >
                  {text}
                </p>
              ))}

              {/* FAQ */}
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-black text-blue-900 mb-5">
                  Frequently Asked Questions
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {seoContent.faqs.map((faq) => (
                    <article
                      key={faq.question}
                      className="rounded-xl bg-white border border-blue-100 p-4 space-y-2"
                    >
                      <h4 className="font-bold text-slate-900">{faq.question}</h4>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </article>
                  ))}
                </div>
              </div>

              {/* Trust Signals */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                {trustSignals.map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col items-center text-center p-4 rounded-2xl bg-slate-50 border border-slate-100"
                  >
                    <div className="mb-2">{item.icon}</div>
                    <span className="font-black text-sm text-slate-800">
                      {item.label}
                    </span>
                    <span className="text-xs text-slate-500 mt-1">
                      {item.sub}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      {/* ══ FOOTER ═══════════════════════════════════════════════════════════ */}
      <footer
        className="bg-[#0f172a] text-white pt-24 pb-12 border-t border-white/5 relative overflow-hidden"
        aria-label="Site footer"
      >
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500" />
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-16 mb-20">

            {/* Brand */}
            <div className="space-y-6 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-3">
                <div className="bg-blue-600 p-2.5 rounded-2xl shadow-xl shadow-blue-600/20">
                  <Calculator className="w-6 h-6" />
                </div>
                <span className="text-3xl font-black tracking-tighter">
                  {adminSettings.brand.siteName}
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed font-medium">
                India focused free financial planning toolkit with SIP, SWP,
                Lumpsum, Compound and Simple Interest calculators for smart
                wealth building.
              </p>
            </div>

            {/* Calculators */}
            <div className="text-center sm:text-left">
              <h3 className="font-black mb-8 text-blue-400 uppercase tracking-[0.3em] text-[10px]">
                Calculators
              </h3>
              <ul className="space-y-4 text-sm font-bold text-gray-400">
                {coreCalculators.map((id) => (
                  <li key={id}>
                    <button
                      onClick={() => handleNavigation(id)}
                      className="hover:text-blue-400 transition-colors uppercase tracking-widest text-[11px]"
                    >
                      {id} Calculator
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Learn & Compare */}
            <div className="text-center sm:text-left">
              <h3 className="font-black mb-8 text-blue-400 uppercase tracking-[0.3em] text-[10px]">
                Learn & Compare
              </h3>
              <ul className="space-y-4 text-sm font-bold text-gray-400">
                <li>
                  <button
                    onClick={() => navigate('/resources')}
                    className="hover:text-blue-400 flex items-center justify-center sm:justify-start gap-3 uppercase tracking-widest text-[11px]"
                  >
                    <FileText className="w-4 h-4 text-blue-500" />
                    Resources & Blog
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/comparisons')}
                    className="hover:text-blue-400 flex items-center justify-center sm:justify-start gap-3 uppercase tracking-widest text-[11px]"
                  >
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    Strategy Comparisons
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="text-center sm:text-left">
              <h3 className="font-black mb-8 text-blue-400 uppercase tracking-[0.3em] text-[10px]">
                Legal & Info
              </h3>
              <ul className="space-y-4 text-sm font-bold text-gray-400">
                {[
                  { path: '/about', icon: <User className="w-4 h-4 text-blue-500" />, label: 'About Us' },
                  { path: '/privacy-policy', icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />, label: 'Privacy Policy' },
                  { path: '/terms', icon: <FileText className="w-4 h-4 text-purple-500" />, label: 'Terms of Service' },
                  { path: '/disclaimer', icon: <Scale className="w-4 h-4 text-rose-500" />, label: 'Disclaimer' },
                  { path: '/admin', icon: <Lock className="w-4 h-4 text-amber-400" />, label: 'Admin' },
                ].map((link) => (
                  <li key={link.path}>
                    <button
                      onClick={() => navigate(link.path)}
                      className="hover:text-white flex items-center justify-center sm:justify-start gap-3"
                    >
                      {link.icon} {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Founder */}
            <div className="text-center sm:text-left">
              <h3 className="font-black mb-8 text-blue-400 uppercase tracking-[0.3em] text-[10px]">
                Founder
              </h3>
              <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 shadow-inner">
                <p className="text-white font-black mb-3 uppercase text-xs tracking-wider">
                  {adminSettings.brand.founderName}
                </p>
                <a
                  href={`mailto:${adminSettings.brand.supportEmail}`}
                  className="text-gray-400 text-[10px] flex items-center justify-center sm:justify-start gap-3 hover:text-blue-400 transition-all uppercase tracking-[0.2em] font-black italic"
                >
                  <Mail className="w-4 h-4" />
                  {adminSettings.brand.supportEmail}
                </a>
              </div>
            </div>
          </div>

          {/* Risk Disclaimer */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-[2.5rem] p-8 mb-16 max-w-5xl mx-auto backdrop-blur-md">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center sm:text-left">
              <div className="bg-red-500/20 p-3 rounded-2xl flex-shrink-0">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-xs text-gray-400 font-bold italic leading-relaxed">
                {adminSettings.legal.riskDisclaimer}
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-gray-600 text-[10px] font-black uppercase tracking-[0.4em] pb-8">
            {new Date().getFullYear()}{' '}
            {adminSettings.brand.siteName.toUpperCase()} INDIA | ALL RIGHTS
            RESERVED
          </div>
        </div>
      </footer>

      {/* ══ MOBILE BOTTOM NAV ════════════════════════════════════════════════ */}
      {isCalculatorPage && (
        <nav
          className="lg:hidden fixed bottom-6 left-6 right-6 bg-[#0f172a] border border-white/10 flex justify-around items-center px-4 py-4 z-50 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl bg-opacity-95 ring-1 ring-white/10"
          aria-label="Mobile calculator navigation"
        >
          {coreCalculators.map((id) => (
            <button
              key={id}
              onClick={() => handleNavigation(id)}
              aria-label={calcMeta[id].label}
              aria-pressed={activeTab === id}
              className={`flex flex-col items-center p-3 rounded-2xl transition-all ${
                activeTab === id
                  ? 'bg-blue-600 text-white scale-110 shadow-2xl shadow-blue-600/40'
                  : 'text-gray-500 hover:text-white'
              }`}
            >
              {mobileNavIcon[id]}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}

export default App;