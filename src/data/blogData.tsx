// Yeh line aur baki unused imports hata dein
export interface BlogPost {
  id: string;
  title: string;
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