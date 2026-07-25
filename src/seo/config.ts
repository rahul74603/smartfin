/**
 * Shared SEO configuration.
 *
 * Extracted from App.tsx so that BOTH the runtime app and the build-time
 * prerenderer (scripts/prerender.mjs) read from a single source of truth.
 * Previously this lived only inside App.tsx, which meant the static HTML
 * shipped to Googlebot had generic homepage meta on every URL.
 */

export type FAQ = { question: string; answer: string };

export type SEOEntry = {
  title: string;
  description: string;
  keywords: string;
  canonicalPath: string;
  faqs: FAQ[];
};

export type SEOCopy = {
  heading: string;
  subheading: string;
  paragraphs: string[];
  faqs: FAQ[];
};

export const BASE_URL = 'https://smartfintool.com';

export const seoByRoute: Record<string, SEOEntry> = {
  sip: {
    title: 'SIP Calculator India 2026 – Free Mutual Fund Calculator',
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
    title: 'Compound Interest Calculator India 2026 – Free Tool',
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
    title: 'Lumpsum Calculator India 2026 – One Time Investment',
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
    title: 'Financial Blog & Investment Guides India 2026',
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

  // ───────────────────────────────────────────────────────────────────────────
  // Standalone high-intent tools
  // ───────────────────────────────────────────────────────────────────────────

  emi: {
    title: 'EMI Calculator 2026 – Home, Car & Personal Loan EMI',
    description:
      'Free EMI calculator for home, car, personal and education loans. Get your monthly EMI, total interest, full amortisation schedule and see how much prepayment saves you.',
    keywords:
      'emi calculator, home loan emi calculator, car loan emi calculator, personal loan emi calculator, loan emi calculator india, emi calculator with prepayment, amortisation schedule calculator, education loan emi calculator',
    canonicalPath: '/emi',
    faqs: [
      {
        question: 'How is EMI calculated on a loan?',
        answer:
          'EMI = P x r x (1+r)^n / ((1+r)^n - 1), where P is the loan amount, r is the monthly interest rate and n the tenure in months. Every Indian bank uses this reducing-balance method, charging interest only on the outstanding balance.',
      },
      {
        question: 'What is a good EMI to income ratio?',
        answer:
          'Most Indian lenders cap total EMIs at 50-55% of net monthly income and prefer 40% or below. Keeping a home loan EMI under 35-40% of take-home pay leaves room for SIP investments and an emergency fund.',
      },
      {
        question: 'How much does prepaying a home loan save?',
        answer:
          'On a Rs 50 lakh, 20-year loan at 8.5%, paying just Rs 5,000 extra every month clears the loan about 4 years 5 months early and saves over Rs 13.8 lakh in interest, because interest is front-loaded in the early years.',
      },
      {
        question: 'Should I reduce EMI or tenure when prepaying?',
        answer:
          'Reducing the tenure saves far more interest because you stop paying interest sooner. Reducing the EMI only improves monthly cash flow. Choose tenure reduction unless your budget is genuinely strained.',
      },
      {
        question: 'Why is most of my early EMI going to interest?',
        answer:
          'Interest is charged on the outstanding balance, which is highest at the start. In year one of a 20-year home loan roughly 80% of each EMI is interest, and the principal share rises every month.',
      },
      {
        question: 'Is home loan EMI eligible for tax deduction?',
        answer:
          'Under the old tax regime, interest on a self-occupied home is deductible up to Rs 2 lakh under Section 24(b) and principal repayment counts towards the Rs 1.5 lakh Section 80C limit. The new regime allows neither.',
      },
    ],
  },

  'income-tax': {
    title: 'Income Tax Calculator FY 2026-27 – New vs Old Regime',
    description:
      'Calculate income tax for FY 2026-27 (AY 2027-28) with Budget 2026 slabs. Compare new vs old regime, standard deduction, Section 87A rebate, surcharge and 4% cess instantly.',
    keywords:
      'income tax calculator, income tax calculator fy 2026-27, new vs old tax regime calculator, income tax slab 2026, tax calculator india, section 87a rebate calculator, ay 2027-28 tax calculator, salary tax calculator india',
    canonicalPath: '/income-tax',
    faqs: [
      {
        question: 'Is income up to Rs 12 lakh tax-free in FY 2026-27?',
        answer:
          'Yes, for resident individuals under the new regime. Tax on Rs 12 lakh taxable income is Rs 60,000 and the Section 87A rebate of up to Rs 60,000 cancels it entirely. With the Rs 75,000 standard deduction, a salary up to Rs 12.75 lakh is tax-free.',
      },
      {
        question: 'What are the new regime tax slabs for FY 2026-27?',
        answer:
          'Up to Rs 4 lakh nil, Rs 4-8 lakh 5%, Rs 8-12 lakh 10%, Rs 12-16 lakh 15%, Rs 16-20 lakh 20%, Rs 20-24 lakh 25%, and 30% above Rs 24 lakh. Budget 2026 made no changes to these rates.',
      },
      {
        question: 'Which tax regime is better, old or new?',
        answer:
          'The new regime suits most salaried people because of wider slabs and a Rs 75,000 standard deduction. The old regime only wins once total deductions such as 80C, 80D, HRA and home loan interest exceed roughly Rs 3.5 to 4 lakh.',
      },
      {
        question: 'What is the standard deduction for FY 2026-27?',
        answer:
          'Rs 75,000 under the new regime and Rs 50,000 under the old regime. It is available only to salaried individuals and pensioners, not to business or professional income.',
      },
      {
        question: 'Do senior citizens get a higher exemption in the new regime?',
        answer:
          'No. The new regime applies the same Rs 4 lakh basic exemption to everyone. Higher exemptions of Rs 3 lakh for ages 60-80 and Rs 5 lakh for 80+ apply only under the old regime.',
      },
      {
        question: 'Which deductions are allowed in the new tax regime?',
        answer:
          'Mainly the Rs 75,000 standard deduction and Section 80CCD(2) employer NPS contribution up to 14% of basic salary. Section 80C, 80D, HRA and self-occupied home loan interest are all disallowed.',
      },
    ],
  },

  ppf: {
    title: 'PPF Calculator 2026 – Public Provident Fund Maturity',
    description:
      'Calculate PPF maturity at the current 7.1% rate with year-wise breakdown. See tax-free interest earned, 15-year and extended tenure projections, and the best deposit timing.',
    keywords:
      'ppf calculator, ppf calculator 2026, public provident fund calculator, ppf maturity calculator, ppf interest rate 2026, ppf calculator 15 years, ppf 1.5 lakh per year maturity, ppf vs epf vs nps',
    canonicalPath: '/ppf',
    faqs: [
      {
        question: 'What is the current PPF interest rate?',
        answer:
          'PPF pays 7.1% per annum, unchanged for the July-September 2026 quarter. The Ministry of Finance reviews the rate quarterly, but it has stayed at 7.1% since January 2023.',
      },
      {
        question: 'How much will Rs 1.5 lakh per year in PPF grow to in 15 years?',
        answer:
          'Depositing the full Rs 1.5 lakh limit every year for 15 years at 7.1% gives a maturity of roughly Rs 40.68 lakh, of which Rs 22.5 lakh is your deposit and about Rs 18.18 lakh is tax-free interest.',
      },
      {
        question: 'Is PPF interest tax-free?',
        answer:
          'Yes. PPF has EEE status: the deposit qualifies for Section 80C under the old regime, the annual interest is tax-free and the maturity is tax-free. That makes 7.1% equivalent to about 10.1% pre-tax in the 30% bracket.',
      },
      {
        question: 'When should I deposit to earn maximum PPF interest?',
        answer:
          'Before the 5th of April. PPF interest is calculated on the lowest balance between the 5th and the last day of each month, so a lump sum deposited in early April earns interest for all twelve months.',
      },
      {
        question: 'Can I withdraw from PPF before 15 years?',
        answer:
          'Partial withdrawal is allowed from the 7th financial year, capped at the lower of 50% of the balance at the end of the 4th preceding year or the previous year balance. A loan facility exists between years 3 and 6.',
      },
      {
        question: 'What happens after PPF matures at 15 years?',
        answer:
          'You can withdraw the entire amount tax-free or extend in blocks of 5 years indefinitely, with or without further contributions. In both cases the balance continues to earn interest.',
      },
    ],
  },

  fd: {
    title: 'FD Calculator 2026 – Fixed & Recurring Deposit Returns',
    description:
      'Calculate FD and RD maturity with quarterly compounding as Indian banks do. See interest earned, TDS impact and your real post-tax return at every income slab.',
    keywords:
      'fd calculator, fixed deposit calculator, rd calculator, recurring deposit calculator, fd maturity calculator india, fd interest calculator, post tax fd return calculator, fd vs ppf',
    canonicalPath: '/fd',
    faqs: [
      {
        question: 'How is FD maturity calculated?',
        answer:
          'Indian banks compound FD interest quarterly using A = P(1 + r/n)^(nt), where n is 4. For example Rs 1 lakh at 7% for 5 years matures at about Rs 1,41,478.',
      },
      {
        question: 'Is FD interest taxable in India?',
        answer:
          'Yes, fully. FD interest is added to your income and taxed at your slab rate, so a 7% FD nets only about 4.9% for someone in the 30% bracket. Banks deduct 10% TDS once interest crosses Rs 50,000 a year.',
      },
      {
        question: 'What is the difference between FD and RD?',
        answer:
          'An FD is a single lump-sum deposit locked for a fixed term. An RD lets you deposit monthly. For the same rate and period an FD earns more because the full principal compounds from day one.',
      },
      {
        question: 'Do senior citizens get higher FD rates?',
        answer:
          'Yes, most banks pay senior citizens 0.25% to 0.75% extra, and their TDS threshold is Rs 1 lakh instead of Rs 50,000.',
      },
      {
        question: 'Is a 5-year tax-saving FD worth it?',
        answer:
          'It qualifies for Section 80C but only under the old regime, has a hard 5-year lock-in and the interest is still fully taxable. PPF at 7.1% tax-free is usually a better 80C choice.',
      },
      {
        question: 'What happens if I break an FD early?',
        answer:
          'Banks charge a penalty of typically 0.5% to 1% and pay interest at the rate applicable for the period actually completed, not the originally booked rate.',
      },
    ],
  },

  'goal-sip': {
    title: 'Goal SIP Calculator – How Much SIP For Your Target?',
    description:
      'Reverse SIP calculator: enter your goal amount and timeline to get the exact monthly SIP required. Includes step-up SIP, existing savings and inflation adjustment.',
    keywords:
      'goal sip calculator, reverse sip calculator, how much sip for 1 crore, step up sip calculator, sip required for goal, target sip calculator india, child education sip calculator, retirement sip calculator',
    canonicalPath: '/goal-sip',
    faqs: [
      {
        question: 'How much SIP do I need for 1 crore in 15 years?',
        answer:
          'At a 12% expected return you need roughly Rs 19,800 per month for 15 years. Total invested would be about Rs 35.6 lakh, with the remaining Rs 64 lakh coming from compounding.',
      },
      {
        question: 'What is a step-up SIP?',
        answer:
          'A step-up SIP increases your monthly investment by a fixed percentage every year, usually matching your salary hike. Starting at Rs 10,000 with a 10% annual step-up substantially beats a flat Rs 10,000 SIP over 15 years.',
      },
      {
        question: 'What return rate should I assume for SIP planning?',
        answer:
          'Use 10-12% for a diversified equity mutual fund portfolio over 10 or more years. Use 8% for a conservative plan. Never assume above 15%, as planning on an optimistic rate means under-saving for the actual goal.',
      },
      {
        question: 'Why should I adjust my goal for inflation?',
        answer:
          'Rs 1 crore in 20 years has the purchasing power of roughly Rs 31 lakh today at 6% inflation. For goals like child education or retirement, target the inflation-adjusted amount rather than a number that sounds large today.',
      },
      {
        question: 'What if I cannot afford the required SIP?',
        answer:
          'You have four levers: extend the horizon, lower the target, accept more equity risk for a higher return, or start smaller with a step-up SIP. Extending the horizon is the most powerful because compounding is exponential in time.',
      },
      {
        question: 'Does doubling the time horizon halve the required SIP?',
        answer:
          'No, it reduces it by roughly four times. Rs 1 crore in 10 years needs about Rs 43,000 a month, but in 20 years only about Rs 10,000. This is why starting early matters more than starting big.',
      },
    ],
  },
};


export const calculatorSEOContent: Record<string, SEOCopy> = {
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

export const breadcrumbLabels: Record<string, string> = {
  sip: 'SIP Calculator',
  swp: 'SWP Calculator',
  compound: 'Compound Interest Calculator',
  simple: 'Simple Interest Calculator',
  lumpsum: 'Lumpsum Calculator',
  about: 'About Us',
  'privacy-policy': 'Privacy Policy',
  terms: 'Terms of Service',
  disclaimer: 'Financial Disclaimer',
  emi: 'EMI Calculator',
  'income-tax': 'Income Tax Calculator',
  ppf: 'PPF Calculator',
  fd: 'FD & RD Calculator',
  'goal-sip': 'Goal SIP Planner',
  resources: 'Financial Resources',
  comparisons: 'Investment Comparisons',
  admin: 'Admin Panel',
};
