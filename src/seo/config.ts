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
  resources: 'Financial Resources',
  comparisons: 'Investment Comparisons',
  admin: 'Admin Panel',
};
