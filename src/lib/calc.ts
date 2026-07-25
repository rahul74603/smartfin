/**
 * Pure calculation engine for SmartFintool.
 *
 * Every function here is side-effect free and independently testable. Keeping
 * the maths out of the React components means a formula bug can be caught by
 * `npm run test:calc` instead of by a user filing a complaint.
 *
 * All rates are entered as percentages (12 means 12%), never as decimals.
 */

// ─────────────────────────────────────────────────────────────────────────────
// EMI / Loans
// ─────────────────────────────────────────────────────────────────────────────

export type AmortRow = {
  period: number;
  openingBalance: number;
  emi: number;
  principalPaid: number;
  interestPaid: number;
  closingBalance: number;
};

export type EMIResult = {
  emi: number;
  totalInterest: number;
  totalPayment: number;
  schedule: AmortRow[];
  /** Year-wise aggregation, handy for charts and the yearly table. */
  yearly: { year: number; principal: number; interest: number; balance: number }[];
};

/**
 * Standard reducing-balance EMI, the method every Indian bank uses.
 *
 *   EMI = P × r × (1+r)^n / ((1+r)^n − 1)
 *
 * where r is the MONTHLY rate and n the number of months. The zero-rate case
 * is handled separately because the formula divides by zero there.
 */
export function calculateEMI(
  principal: number,
  annualRatePct: number,
  tenureMonths: number
): EMIResult {
  const P = Math.max(0, principal);
  const n = Math.max(1, Math.round(tenureMonths));
  const r = annualRatePct / 100 / 12;

  const emi = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

  const schedule: AmortRow[] = [];
  let balance = P;
  let totalInterest = 0;

  for (let i = 1; i <= n; i++) {
    const interest = balance * r;
    // Final instalment absorbs floating-point drift so the balance lands on 0.
    const principalPaid = i === n ? balance : emi - interest;
    const closing = i === n ? 0 : balance - principalPaid;

    schedule.push({
      period: i,
      openingBalance: balance,
      emi: i === n ? principalPaid + interest : emi,
      principalPaid,
      interestPaid: interest,
      closingBalance: closing,
    });

    totalInterest += interest;
    balance = closing;
  }

  const yearly: EMIResult['yearly'] = [];
  for (let y = 0; y * 12 < n; y++) {
    const slice = schedule.slice(y * 12, (y + 1) * 12);
    yearly.push({
      year: y + 1,
      principal: slice.reduce((s, x) => s + x.principalPaid, 0),
      interest: slice.reduce((s, x) => s + x.interestPaid, 0),
      balance: slice[slice.length - 1]?.closingBalance ?? 0,
    });
  }

  return { emi, totalInterest, totalPayment: P + totalInterest, schedule, yearly };
}

/**
 * Effect of paying a lump sum towards principal, or increasing the EMI.
 * Returns months saved and interest saved versus the base loan.
 */
export function calculatePrepaymentSaving(
  principal: number,
  annualRatePct: number,
  tenureMonths: number,
  extraPerMonth: number
): { monthsSaved: number; interestSaved: number; newTenureMonths: number } {
  const base = calculateEMI(principal, annualRatePct, tenureMonths);
  if (extraPerMonth <= 0) {
    return { monthsSaved: 0, interestSaved: 0, newTenureMonths: tenureMonths };
  }

  const r = annualRatePct / 100 / 12;
  const pay = base.emi + extraPerMonth;
  let balance = principal;
  let interest = 0;
  let months = 0;
  // Cap the loop so a pathological input cannot hang the UI.
  const maxMonths = Math.round(tenureMonths) + 1;

  while (balance > 0 && months < maxMonths) {
    const i = balance * r;
    const p = Math.min(pay - i, balance);
    if (p <= 0) break; // EMI does not even cover interest.
    balance -= p;
    interest += i;
    months++;
  }

  return {
    monthsSaved: Math.max(0, Math.round(tenureMonths) - months),
    interestSaved: Math.max(0, base.totalInterest - interest),
    newTenureMonths: months,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Income Tax — FY 2026-27 (AY 2027-28)
// ─────────────────────────────────────────────────────────────────────────────

export type TaxSlab = { upTo: number; rate: number };

/**
 * New regime slabs for FY 2026-27 (AY 2027-28).
 * Budget 2026 made no changes, so these carry over from Budget 2025.
 */
export const NEW_REGIME_SLABS_FY2627: TaxSlab[] = [
  { upTo: 400000, rate: 0 },
  { upTo: 800000, rate: 5 },
  { upTo: 1200000, rate: 10 },
  { upTo: 1600000, rate: 15 },
  { upTo: 2000000, rate: 20 },
  { upTo: 2400000, rate: 25 },
  { upTo: Infinity, rate: 30 },
];

/** Old regime slabs. The basic exemption varies with age. */
export function oldRegimeSlabs(age: 'below60' | '60to80' | 'above80'): TaxSlab[] {
  const exempt = age === 'above80' ? 500000 : age === '60to80' ? 300000 : 250000;
  return [
    { upTo: exempt, rate: 0 },
    { upTo: 500000, rate: 5 },
    { upTo: 1000000, rate: 20 },
    { upTo: Infinity, rate: 30 },
  ].filter((s, i, arr) => i === 0 || s.upTo > arr[0].upTo) as TaxSlab[];
}

export type SlabBreakdown = { from: number; to: number; rate: number; tax: number };

export function taxFromSlabs(
  income: number
  , slabs: TaxSlab[]
): { tax: number; breakdown: SlabBreakdown[] } {
  let tax = 0;
  let lower = 0;
  const breakdown: SlabBreakdown[] = [];

  for (const slab of slabs) {
    if (income <= lower) break;
    const taxableInThisSlab = Math.min(income, slab.upTo) - lower;
    if (taxableInThisSlab > 0) {
      const t = (taxableInThisSlab * slab.rate) / 100;
      tax += t;
      breakdown.push({ from: lower, to: Math.min(income, slab.upTo), rate: slab.rate, tax: t });
    }
    lower = slab.upTo;
  }

  return { tax, breakdown };
}

/**
 * Surcharge on high incomes, with marginal relief.
 *
 * Marginal relief matters: without it, earning ₹1 above ₹50 lakh would add far
 * more than ₹1 of tax. The relief caps the extra tax at the extra income.
 * New regime surcharge is capped at 25%; the old regime goes to 37%.
 */
export function calculateSurcharge(
  taxableIncome: number,
  baseTax: number,
  regime: 'new' | 'old'
): number {
  let rate = 0;
  if (taxableIncome > 50000000 / 10) {
    // thresholds in rupees
  }
  if (taxableIncome > 5000000 && taxableIncome <= 10000000) rate = 10;
  else if (taxableIncome > 10000000 && taxableIncome <= 20000000) rate = 15;
  else if (taxableIncome > 20000000 && taxableIncome <= 50000000) rate = 25;
  else if (taxableIncome > 50000000) rate = regime === 'new' ? 25 : 37;

  if (rate === 0) return 0;

  const surcharge = (baseTax * rate) / 100;

  // Marginal relief: tax+surcharge must not exceed the tax at the threshold
  // plus the income above that threshold.
  const thresholds = [5000000, 10000000, 20000000, 50000000];
  const threshold = thresholds.filter((t) => taxableIncome > t).pop();
  if (threshold === undefined) return surcharge;

  const slabs = regime === 'new' ? NEW_REGIME_SLABS_FY2627 : oldRegimeSlabs('below60');
  const taxAtThreshold = taxFromSlabs(threshold, slabs).tax;
  const prevRate =
    threshold === 5000000 ? 0 : threshold === 10000000 ? 10 : threshold === 20000000 ? 15 : 25;
  const surchargeAtThreshold = (taxAtThreshold * prevRate) / 100;

  const maxTotal = taxAtThreshold + surchargeAtThreshold + (taxableIncome - threshold);
  const actualTotal = baseTax + surcharge;

  return actualTotal > maxTotal ? Math.max(0, maxTotal - baseTax) : surcharge;
}

export type TaxRegimeResult = {
  grossIncome: number;
  standardDeduction: number;
  otherDeductions: number;
  taxableIncome: number;
  slabTax: number;
  rebate87A: number;
  taxAfterRebate: number;
  surcharge: number;
  cess: number;
  totalTax: number;
  effectiveRatePct: number;
  breakdown: SlabBreakdown[];
};

/**
 * Full income tax computation for FY 2026-27 (AY 2027-28).
 *
 * Order of operations matters and is a common source of wrong calculators:
 *   gross → minus deductions → taxable → slab tax → 87A rebate →
 *   surcharge (with marginal relief) → 4% cess.
 * The rebate is applied BEFORE cess, not after.
 */
export function calculateIncomeTax(opts: {
  grossIncome: number;
  regime: 'new' | 'old';
  isSalaried: boolean;
  age?: 'below60' | '60to80' | 'above80';
  /** Old-regime deductions: 80C, 80D, HRA, home-loan interest, NPS etc. */
  deductions?: number;
  /** 80CCD(2) employer NPS — allowed in BOTH regimes. */
  employerNps?: number;
}): TaxRegimeResult {
  const {
    grossIncome,
    regime,
    isSalaried,
    age = 'below60',
    deductions = 0,
    employerNps = 0,
  } = opts;

  const gross = Math.max(0, grossIncome);
  const standardDeduction = isSalaried ? (regime === 'new' ? 75000 : 50000) : 0;

  // The new regime allows only 80CCD(2); the old regime allows the full set.
  const otherDeductions = regime === 'new' ? employerNps : deductions + employerNps;

  const taxableIncome = Math.max(0, gross - standardDeduction - otherDeductions);

  const slabs = regime === 'new' ? NEW_REGIME_SLABS_FY2627 : oldRegimeSlabs(age);
  const { tax: slabTax, breakdown } = taxFromSlabs(taxableIncome, slabs);

  // Section 87A: ₹60,000 up to ₹12L taxable (new), ₹12,500 up to ₹5L (old).
  // Resident individuals only.
  let rebate87A = 0;
  if (regime === 'new' && taxableIncome <= 1200000) {
    rebate87A = Math.min(slabTax, 60000);
  } else if (regime === 'old' && taxableIncome <= 500000) {
    rebate87A = Math.min(slabTax, 12500);
  }

  const taxAfterRebate = Math.max(0, slabTax - rebate87A);
  const surcharge = calculateSurcharge(taxableIncome, taxAfterRebate, regime);
  const cess = (taxAfterRebate + surcharge) * 0.04;
  const totalTax = taxAfterRebate + surcharge + cess;

  return {
    grossIncome: gross,
    standardDeduction,
    otherDeductions,
    taxableIncome,
    slabTax,
    rebate87A,
    taxAfterRebate,
    surcharge,
    cess,
    totalTax,
    effectiveRatePct: gross > 0 ? (totalTax / gross) * 100 : 0,
    breakdown,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// PPF
// ─────────────────────────────────────────────────────────────────────────────

export type PPFYear = {
  year: number;
  openingBalance: number;
  deposit: number;
  interest: number;
  closingBalance: number;
};

/**
 * PPF maturity projection.
 *
 * PPF interest is compounded ANNUALLY and credited on 31 March. Deposits made
 * before the 5th of a month earn interest for that month, so a lump-sum
 * deposit in April earns a full year while monthly deposits earn progressively
 * less. This models the common case: `monthly` spreads the deposit across 12
 * months (roughly 6.5 months of average interest), `yearly` assumes an April
 * deposit earning the full year.
 */
export function calculatePPF(
  annualDeposit: number,
  years: number,
  ratePct: number,
  mode: 'yearly' | 'monthly' = 'yearly'
): { maturity: number; totalDeposit: number; totalInterest: number; schedule: PPFYear[] } {
  const rate = ratePct / 100;
  const schedule: PPFYear[] = [];
  let balance = 0;
  let totalDeposit = 0;

  for (let y = 1; y <= years; y++) {
    const opening = balance;
    let interest: number;

    if (mode === 'monthly') {
      const monthly = annualDeposit / 12;
      // Deposit in month k earns interest for (12 − k + 1) months.
      let monthInterestBase = 0;
      for (let m = 1; m <= 12; m++) monthInterestBase += monthly * ((13 - m) / 12);
      interest = (opening + monthInterestBase) * rate;
    } else {
      interest = (opening + annualDeposit) * rate;
    }

    balance = opening + annualDeposit + interest;
    totalDeposit += annualDeposit;

    schedule.push({
      year: y,
      openingBalance: opening,
      deposit: annualDeposit,
      interest,
      closingBalance: balance,
    });
  }

  return {
    maturity: balance,
    totalDeposit,
    totalInterest: balance - totalDeposit,
    schedule,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Fixed Deposit / Recurring Deposit
// ─────────────────────────────────────────────────────────────────────────────

/**
 * FD maturity. Indian banks compound quarterly by default.
 *   A = P (1 + r/n)^(nt)
 */
export function calculateFD(
  principal: number,
  annualRatePct: number,
  years: number,
  compoundsPerYear: 1 | 2 | 4 | 12 = 4
): { maturity: number; interest: number; yearly: { year: number; balance: number }[] } {
  const r = annualRatePct / 100;
  const n = compoundsPerYear;
  const maturity = principal * Math.pow(1 + r / n, n * years);

  const yearly: { year: number; balance: number }[] = [];
  for (let y = 1; y <= Math.ceil(years); y++) {
    const t = Math.min(y, years);
    yearly.push({ year: y, balance: principal * Math.pow(1 + r / n, n * t) });
  }

  return { maturity, interest: maturity - principal, yearly };
}

/**
 * RD maturity. Each monthly instalment compounds quarterly for the remaining
 * term, which is how banks actually compute it.
 */
export function calculateRD(
  monthlyDeposit: number,
  annualRatePct: number,
  months: number
): { maturity: number; totalDeposit: number; interest: number } {
  const r = annualRatePct / 100;
  const n = 4; // quarterly compounding
  let maturity = 0;

  for (let m = 1; m <= months; m++) {
    const monthsRemaining = months - m + 1;
    maturity += monthlyDeposit * Math.pow(1 + r / n, (n * monthsRemaining) / 12);
  }

  const totalDeposit = monthlyDeposit * months;
  return { maturity, totalDeposit, interest: maturity - totalDeposit };
}

// ─────────────────────────────────────────────────────────────────────────────
// Goal SIP (reverse SIP)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * How much monthly SIP is needed to reach a target corpus?
 *
 *   FV = P × [((1+r)^n − 1) / r] × (1+r)      →  solve for P
 *
 * This is the inverse of the standard SIP future-value formula, assuming
 * contributions at the START of each month (which is how SIP mandates work).
 */
export function requiredSIP(
  targetAmount: number,
  annualReturnPct: number,
  years: number,
  existingCorpus = 0
): number {
  const r = annualReturnPct / 100 / 12;
  const n = Math.round(years * 12);

  // Whatever the existing corpus grows into reduces what the SIP must cover.
  const futureValueOfExisting = existingCorpus * Math.pow(1 + r, n);
  const gap = Math.max(0, targetAmount - futureValueOfExisting);

  if (gap === 0) return 0;
  if (r === 0) return gap / n;

  return gap / (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
}

/**
 * Future value of a SIP that steps up by a fixed percentage every year —
 * the realistic case for a salaried investor whose income rises annually.
 */
export function stepUpSIPFutureValue(
  monthlyInvestment: number,
  annualReturnPct: number,
  years: number,
  annualStepUpPct: number
): { futureValue: number; totalInvested: number; yearly: { year: number; invested: number; value: number }[] } {
  const r = annualReturnPct / 100 / 12;
  let balance = 0;
  let invested = 0;
  let sip = monthlyInvestment;
  const yearly: { year: number; invested: number; value: number }[] = [];

  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) {
      balance = (balance + sip) * (1 + r);
      invested += sip;
    }
    yearly.push({ year: y, invested, value: balance });
    sip *= 1 + annualStepUpPct / 100;
  }

  return { futureValue: balance, totalInvested: invested, yearly };
}

/** Required monthly step-up SIP to hit a target — solved numerically. */
export function requiredStepUpSIP(
  targetAmount: number,
  annualReturnPct: number,
  years: number,
  annualStepUpPct: number,
  existingCorpus = 0
): number {
  const r = annualReturnPct / 100 / 12;
  const fvExisting = existingCorpus * Math.pow(1 + r, years * 12);
  const gap = Math.max(0, targetAmount - fvExisting);
  if (gap === 0) return 0;

  // FV scales linearly with the starting SIP, so one probe gives the answer.
  const probe = stepUpSIPFutureValue(1000, annualReturnPct, years, annualStepUpPct).futureValue;
  return probe > 0 ? (gap / probe) * 1000 : 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Value of `amount` after `years` of `inflationPct` erosion. */
export function realValue(amount: number, inflationPct: number, years: number): number {
  return amount / Math.pow(1 + inflationPct / 100, years);
}
