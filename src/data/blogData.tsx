// Yeh line aur baki unused imports hata dein
export interface BlogPost {
  id: string;
  title: string;
  /**
   * Optional shorter title used for the <title> tag only.
   *
   * Google truncates SERP titles at roughly 60 characters. The `title` field
   * above is the on-page H1 and is intentionally descriptive, but several
   * articles ran 80-93 chars, so the keyword-bearing tail was being cut off in
   * search results. When set, this is used for <title>; `title` stays the H1.
   */
  seoTitle?: string;
  description: string;
  category: string;
  readTime: number;
  icon: React.ReactNode;
  keyTopics: string[];
  seoKeywords: string[];
  content: string;
  faqs: { q: string; a: string }[];
  publishDate: string;
  author: string;
  authorTitle: string;
}

import { sipVsLumpsumPost } from '../pages/blog/sip-vs-lumpsum';
import { retirementPlanningGuidePost } from '../pages/blog/retirement-planning-guide';
import { powerOfCompoundingPost } from '../pages/blog/power-of-compounding';
import { financialGoalSettingPost } from '../pages/blog/financial-goal-setting';
import { inflationImpactInvestmentsPost } from '../pages/blog/inflation-impact-investments';
import { mutualFundGuidePost } from '../pages/blog/mutual-fund-guide';
import { emergencyFundPlanningPost } from '../pages/blog/emergency-fund-planning';
import { investmentCalculatorGuidePost } from '../pages/blog/investment-calculator-guide';

export const blogPosts: BlogPost[] = [
  sipVsLumpsumPost,
  retirementPlanningGuidePost,
  powerOfCompoundingPost,
  financialGoalSettingPost,
  inflationImpactInvestmentsPost,
  mutualFundGuidePost,
  emergencyFundPlanningPost,
  investmentCalculatorGuidePost
];