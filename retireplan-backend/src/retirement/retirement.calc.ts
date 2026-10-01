// src/retirement/retirement.calc.ts
// ⚠️ ไฟล์นี้ "บริสุทธิ์" (pure): รับตัวเลข → คืนตัวเลข ไม่ยุ่งกับ NestJS/database เลย

export interface RetirementInput {
  currentAge: number;
  retireAge: number;
  lifeExpectancy: number;
  currentSavings: number;
  monthlySaving: number;
  monthlyExpenseAfterRetire: number;
  monthlyPension?: number;
  monthlyRentIncome?: number;
  returnBefore: number; // % ต่อปี เช่น 6
  returnAfter: number;
  inflation: number;
}

export interface RetirementResult {
  targetAmount: number;
  projectedAmount: number;
  gap: number;
}

const MONTHS_PER_YEAR = 12;

/** แปลง % ต่อปี → อัตราต่อเดือน (nominal) */
function toMonthlyRate(annualPercent: number): number {
  return annualPercent / 100 / MONTHS_PER_YEAR;
}

/** ①  เงินที่ควรมี ณ วันเกษียณ (Present Value of Annuity) */
export function calcTargetAmount(input: RetirementInput): number {
  const yearsToRetire = Math.max(0, input.retireAge - input.currentAge);
  const monthsInRetirement = Math.max(
    0,
    (input.lifeExpectancy - input.retireAge) * MONTHS_PER_YEAR,
  );
  const inflationRate = input.inflation / 100;
  const r = toMonthlyRate(input.returnAfter);

  const expenseAtRetire =
    input.monthlyExpenseAfterRetire *
    Math.pow(1 + inflationRate, yearsToRetire);
  const passiveIncome =
    (input.monthlyPension ?? 0) + (input.monthlyRentIncome ?? 0);
  const netMonthlyNeed = Math.max(0, expenseAtRetire - passiveIncome);

  const target =
    r === 0
      ? netMonthlyNeed * monthsInRetirement
      : netMonthlyNeed * ((1 - Math.pow(1 + r, -monthsInRetirement)) / r);

  return Math.round(target);
}

/** ②  เงินที่คาดว่าจะมีจริง ณ วันเกษียณ (Compound + FV of Annuity) */
export function calcProjectedAmount(input: RetirementInput): number {
  const monthsToRetire = Math.max(
    0,
    (input.retireAge - input.currentAge) * MONTHS_PER_YEAR,
  );
  const r = toMonthlyRate(input.returnBefore);

  const fvCurrent = input.currentSavings * Math.pow(1 + r, monthsToRetire);
  const fvContributions =
    r === 0
      ? input.monthlySaving * monthsToRetire
      : input.monthlySaving * ((Math.pow(1 + r, monthsToRetire) - 1) / r);

  return Math.round(fvCurrent + fvContributions);
}

/** ③  ตัวรวม: เรียก ① และ ② แล้วหา gap */
export function calculateRetirement(input: RetirementInput): RetirementResult {
  const targetAmount = calcTargetAmount(input);
  const projectedAmount = calcProjectedAmount(input);
  return {
    targetAmount,
    projectedAmount,
    gap: targetAmount - projectedAmount,
  };
}
