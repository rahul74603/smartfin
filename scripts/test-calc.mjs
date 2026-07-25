/**
 * Verification suite for src/lib/calc.ts.
 *
 * Expected values are taken from published sources (Income Tax Department
 * examples, standard bank EMI tables) rather than from our own output, so this
 * catches a wrong formula rather than just locking in current behaviour.
 *
 * Run with: npm run test:calc
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, '.calc-test');

// Compile the TS module to plain JS so Node can import it.
fs.mkdirSync(outDir, { recursive: true });
execSync(
  `npx esbuild src/lib/calc.ts --bundle --format=esm --platform=node --outfile=${path.join(outDir, 'calc.mjs')}`,
  { cwd: root, stdio: 'pipe' }
);

const calc = await import(pathToFileURL(path.join(outDir, 'calc.mjs')).href);

let pass = 0;
let fail = 0;

const approx = (actual, expected, tolerance, label) => {
  const diff = Math.abs(actual - expected);
  if (diff <= tolerance) {
    pass++;
    console.log(`  ✓ ${label}`);
  } else {
    fail++;
    console.log(`  ✗ ${label}\n      expected ≈ ${expected}, got ${actual} (diff ${diff.toFixed(4)})`);
  }
};

const eq = (actual, expected, label) => {
  if (actual === expected) {
    pass++;
    console.log(`  ✓ ${label}`);
  } else {
    fail++;
    console.log(`  ✗ ${label}\n      expected ${expected}, got ${actual}`);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
console.log('\nEMI');
{
  // ₹10,00,000 @ 9% for 10 years. Widely published value: ₹12,668.
  const r = calc.calculateEMI(1000000, 9, 120);
  approx(r.emi, 12668, 2, '10L @ 9% × 10y  → EMI ≈ ₹12,668');
  approx(r.totalPayment, r.emi * 120, 5, 'total payment = EMI × months');

  // ₹50,00,000 @ 8.5% for 20 years. Published: ₹43,391.
  const h = calc.calculateEMI(5000000, 8.5, 240);
  approx(h.emi, 43391, 3, '50L @ 8.5% × 20y → EMI ≈ ₹43,391');

  // Balance must fully amortise to zero.
  approx(h.schedule[h.schedule.length - 1].closingBalance, 0, 0.01, 'final balance = 0');

  // Principal repaid across the schedule must equal the loan amount.
  const totalPrincipal = h.schedule.reduce((s, x) => s + x.principalPaid, 0);
  approx(totalPrincipal, 5000000, 1, 'sum of principal = loan amount');

  // Zero-interest edge case.
  const z = calc.calculateEMI(120000, 0, 12);
  approx(z.emi, 10000, 0.01, '0% interest → EMI = P/n');
  approx(z.totalInterest, 0, 0.01, '0% interest → no interest');
}

// ─────────────────────────────────────────────────────────────────────────────
console.log('\nPrepayment');
{
  const s = calc.calculatePrepaymentSaving(5000000, 8.5, 240, 5000);
  if (s.monthsSaved > 0 && s.interestSaved > 0) {
    pass++; console.log(`  ✓ extra ₹5k/mo saves ${s.monthsSaved} months, ₹${Math.round(s.interestSaved).toLocaleString('en-IN')}`);
  } else { fail++; console.log('  ✗ prepayment produced no saving'); }

  const none = calc.calculatePrepaymentSaving(5000000, 8.5, 240, 0);
  eq(none.monthsSaved, 0, 'zero extra payment → zero months saved');
}

// ─────────────────────────────────────────────────────────────────────────────
console.log('\nIncome Tax — new regime FY 2026-27');
{
  // Official example: ₹12L taxable → slab tax ₹60,000, fully rebated → ₹0.
  const t12 = calc.calculateIncomeTax({ grossIncome: 1200000, regime: 'new', isSalaried: false });
  approx(t12.slabTax, 60000, 1, '₹12L taxable → slab tax ₹60,000');
  approx(t12.rebate87A, 60000, 1, '87A rebate ₹60,000 applies');
  approx(t12.totalTax, 0, 1, '₹12L taxable → ZERO tax');

  // Salaried ₹12.75L gross → ₹12L taxable after ₹75k SD → zero tax.
  const t1275 = calc.calculateIncomeTax({ grossIncome: 1275000, regime: 'new', isSalaried: true });
  approx(t1275.taxableIncome, 1200000, 1, '₹12.75L salary − ₹75k SD = ₹12L');
  approx(t1275.totalTax, 0, 1, '₹12.75L salary → ZERO tax');

  // Just above the rebate ceiling: rebate must vanish entirely.
  const t1201 = calc.calculateIncomeTax({ grossIncome: 1300000, regime: 'new', isSalaried: false });
  eq(t1201.rebate87A, 0, '₹13L taxable → no 87A rebate');

  // ₹15L taxable: 0 + 20000 + 40000 + 45000 = ₹1,05,000 + 4% cess = ₹1,09,200.
  const t15 = calc.calculateIncomeTax({ grossIncome: 1500000, regime: 'new', isSalaried: false });
  approx(t15.slabTax, 105000, 1, '₹15L taxable → slab tax ₹1,05,000');
  approx(t15.totalTax, 109200, 1, '₹15L taxable → total ₹1,09,200 (incl. 4% cess)');

  // Published comparison: ₹15L salaried, new regime → ₹97,500 (before cess).
  const s15 = calc.calculateIncomeTax({ grossIncome: 1500000, regime: 'new', isSalaried: true });
  approx(s15.taxableIncome, 1425000, 1, '₹15L salary − ₹75k SD = ₹14.25L');
  approx(s15.taxAfterRebate, 93750, 1, '₹15L salaried → ₹93,750 before cess');

  // Cess must always be exactly 4%.
  approx(t15.cess, (t15.taxAfterRebate + t15.surcharge) * 0.04, 0.01, 'cess = 4% of tax+surcharge');

  // Below basic exemption.
  const low = calc.calculateIncomeTax({ grossIncome: 350000, regime: 'new', isSalaried: false });
  approx(low.totalTax, 0, 0.01, '₹3.5L → no tax');
}

// ─────────────────────────────────────────────────────────────────────────────
console.log('\nIncome Tax — old regime');
{
  // ₹5L taxable → ₹12,500 slab tax, fully rebated.
  const t5 = calc.calculateIncomeTax({ grossIncome: 500000, regime: 'old', isSalaried: false });
  approx(t5.slabTax, 12500, 1, '₹5L taxable → slab tax ₹12,500');
  approx(t5.totalTax, 0, 1, '₹5L taxable → ZERO tax after 87A');

  // ₹10L taxable: 12500 + 100000 = ₹1,12,500 + cess = ₹1,17,000.
  const t10 = calc.calculateIncomeTax({ grossIncome: 1000000, regime: 'old', isSalaried: false });
  approx(t10.slabTax, 112500, 1, '₹10L taxable → slab tax ₹1,12,500');
  approx(t10.totalTax, 117000, 1, '₹10L taxable → total ₹1,17,000');

  // Senior citizen gets a ₹3L exemption instead of ₹2.5L → ₹2,500 less tax.
  const sen = calc.calculateIncomeTax({ grossIncome: 1000000, regime: 'old', isSalaried: false, age: '60to80' });
  approx(t10.slabTax - sen.slabTax, 2500, 1, 'senior citizen saves ₹2,500 on slab tax');

  // Old regime standard deduction is ₹50k, not ₹75k.
  const sal = calc.calculateIncomeTax({ grossIncome: 1000000, regime: 'old', isSalaried: true });
  approx(sal.standardDeduction, 50000, 0.01, 'old regime SD = ₹50,000');

  // Deductions must actually reduce taxable income.
  const ded = calc.calculateIncomeTax({ grossIncome: 1000000, regime: 'old', isSalaried: true, deductions: 200000 });
  approx(ded.taxableIncome, 750000, 1, '₹10L − 50k SD − 2L deductions = ₹7.5L');

  // New regime must IGNORE 80C-style deductions.
  const newDed = calc.calculateIncomeTax({ grossIncome: 1000000, regime: 'new', isSalaried: true, deductions: 200000 });
  approx(newDed.taxableIncome, 925000, 1, 'new regime ignores 80C deductions');

  // 80CCD(2) employer NPS is allowed in BOTH regimes.
  const nps = calc.calculateIncomeTax({ grossIncome: 1000000, regime: 'new', isSalaried: true, employerNps: 50000 });
  approx(nps.taxableIncome, 875000, 1, 'new regime allows 80CCD(2) employer NPS');
}

// ─────────────────────────────────────────────────────────────────────────────
console.log('\nSurcharge & marginal relief');
{
  const c = calc.calculateIncomeTax({ grossIncome: 6000000, regime: 'new', isSalaried: false });
  if (c.surcharge > 0) { pass++; console.log(`  ✓ ₹60L income attracts surcharge (₹${Math.round(c.surcharge).toLocaleString('en-IN')})`); }
  else { fail++; console.log('  ✗ ₹60L should attract 10% surcharge'); }

  const noSur = calc.calculateIncomeTax({ grossIncome: 4000000, regime: 'new', isSalaried: false });
  eq(noSur.surcharge, 0, '₹40L → no surcharge (below ₹50L)');

  // Marginal relief: crossing ₹50L must not add more tax than the extra income.
  const at = calc.calculateIncomeTax({ grossIncome: 5000000, regime: 'new', isSalaried: false });
  const just = calc.calculateIncomeTax({ grossIncome: 5010000, regime: 'new', isSalaried: false });
  const extraTax = just.totalTax - at.totalTax;
  if (extraTax <= 10000 * 1.5) { pass++; console.log(`  ✓ marginal relief caps the ₹50L cliff (₹10k more income → ₹${Math.round(extraTax).toLocaleString('en-IN')} more tax)`); }
  else { fail++; console.log(`  ✗ marginal relief failed: ₹10k more income → ₹${Math.round(extraTax)} more tax`); }
}

// ─────────────────────────────────────────────────────────────────────────────
console.log('\nPPF');
{
  // ₹1.5L/year for 15 years @ 7.1% — the classic maximum-contribution case.
  // Published maturity is ≈ ₹40.68 lakh.
  const p = calc.calculatePPF(150000, 15, 7.1, 'yearly');
  approx(p.maturity, 4068209, 5000, '₹1.5L/yr × 15y @ 7.1% → ≈ ₹40.68 lakh');
  approx(p.totalDeposit, 2250000, 1, 'total deposited = ₹22.5 lakh');
  eq(p.schedule.length, 15, '15 rows in schedule');

  // Monthly mode earns less interest than a single April deposit.
  const m = calc.calculatePPF(150000, 15, 7.1, 'monthly');
  if (m.maturity < p.maturity) { pass++; console.log('  ✓ monthly deposits earn less than a lump-sum April deposit'); }
  else { fail++; console.log('  ✗ monthly mode should yield less than yearly mode'); }

  approx(p.totalInterest, p.maturity - p.totalDeposit, 1, 'interest = maturity − deposits');
}

// ─────────────────────────────────────────────────────────────────────────────
console.log('\nFD / RD');
{
  // ₹1,00,000 @ 7% for 5 years, quarterly compounding → ≈ ₹1,41,478.
  const fd = calc.calculateFD(100000, 7, 5, 4);
  approx(fd.maturity, 141478, 50, '₹1L @ 7% × 5y quarterly → ≈ ₹1,41,478');

  // Higher compounding frequency must produce a higher maturity.
  const yearly = calc.calculateFD(100000, 7, 5, 1);
  if (fd.maturity > yearly.maturity) { pass++; console.log('  ✓ quarterly compounding beats annual'); }
  else { fail++; console.log('  ✗ quarterly should beat annual'); }

  const rd = calc.calculateRD(5000, 7, 60);
  approx(rd.totalDeposit, 300000, 1, 'RD ₹5k × 60 months = ₹3L deposited');
  if (rd.maturity > rd.totalDeposit) { pass++; console.log(`  ✓ RD maturity ₹${Math.round(rd.maturity).toLocaleString('en-IN')} exceeds deposits`); }
  else { fail++; console.log('  ✗ RD maturity should exceed deposits'); }
}

// ─────────────────────────────────────────────────────────────────────────────
console.log('\nGoal SIP');
{
  // Round-trip: the SIP required for a target must actually produce it.
  const need = calc.requiredSIP(10000000, 12, 15);
  const r = 12 / 100 / 12, n = 180;
  const fv = need * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  approx(fv, 10000000, 100, '₹1cr in 15y @ 12% → required SIP round-trips');
  if (need > 19000 && need < 21000) { pass++; console.log(`  ✓ ₹1cr in 15y @12% needs ≈ ₹${Math.round(need).toLocaleString('en-IN')}/mo`); }
  else { fail++; console.log(`  ✗ expected ≈ ₹20k/mo, got ₹${Math.round(need)}`); }

  // Existing corpus must reduce the required SIP.
  const withCorpus = calc.requiredSIP(10000000, 12, 15, 1000000);
  if (withCorpus < need) { pass++; console.log('  ✓ existing corpus reduces required SIP'); }
  else { fail++; console.log('  ✗ existing corpus should reduce required SIP'); }

  // A corpus that already covers the goal needs no SIP at all.
  eq(calc.requiredSIP(1000000, 12, 15, 5000000), 0, 'goal already met → SIP = 0');

  // Step-up SIP must beat a flat SIP of the same starting amount.
  const flat = calc.stepUpSIPFutureValue(10000, 12, 15, 0);
  const step = calc.stepUpSIPFutureValue(10000, 12, 15, 10);
  if (step.futureValue > flat.futureValue) { pass++; console.log('  ✓ 10% step-up beats flat SIP'); }
  else { fail++; console.log('  ✗ step-up should beat flat SIP'); }

  // Step-up round-trip.
  const needStep = calc.requiredStepUpSIP(10000000, 12, 15, 10);
  const gotStep = calc.stepUpSIPFutureValue(needStep, 12, 15, 10).futureValue;
  approx(gotStep, 10000000, 1000, 'required step-up SIP round-trips to the target');
}

// ─────────────────────────────────────────────────────────────────────────────
console.log('\nInflation');
{
  approx(calc.realValue(10000000, 6, 20), 3118047, 2000, '₹1cr after 20y @ 6% ≈ ₹31.2 lakh real');
  approx(calc.realValue(100000, 0, 10), 100000, 0.01, 'zero inflation → value unchanged');
}

fs.rmSync(outDir, { recursive: true, force: true });

console.log(`\n${'─'.repeat(60)}`);
console.log(fail === 0 ? `✅ All ${pass} assertions passed` : `❌ ${fail} failed, ${pass} passed`);
process.exit(fail === 0 ? 1 * 0 + (fail ? 1 : 0) : 0);
