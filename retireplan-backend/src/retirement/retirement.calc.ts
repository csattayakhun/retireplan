// src/retirement/retirement.calc.ts
// ไฟล์นี้ "บริสุทธิ์" (pure): รับตัวเลข → คืนตัวเลข ไม่ยุ่งกับ NestJS/database
// ชื่อ field ตรงกับ schema.prisma / DTO เพื่อไม่ต้อง map ข้ามเลเยอร์

export interface RetirementInput {
  currentAge: number;
  retirementAge: number;
  lifeExpectancyAge: number;
  currentSavings: number;
  monthlySaving: number;
  monthlyExpense: number;
  monthlyPension?: number;
  monthlyRental?: number;
  returnBefore: number; // % ต่อปี เช่น 6
  returnAfter: number;
  inflationRate: number;
}

export interface RetirementResult {
  targetAmount: number;
  projectedAmount: number;
  gap: number;
}

const MONTHS_PER_YEAR = 12;

// แปลง % ต่อปี → อัตราต่อเดือน (nominal)
function toMonthlyRate(annualPercent: number): number {
  return annualPercent / 100 / MONTHS_PER_YEAR;
}

// เงินที่ควรมี ณ วันเกษียณ (Present Value of Annuity)
export function calcTargetAmount(input: RetirementInput): number {
  const yearsToRetire = Math.max(0, input.retirementAge - input.currentAge);
  const monthsInRetirement = Math.max(
    0,
    (input.lifeExpectancyAge - input.retirementAge) * MONTHS_PER_YEAR,
  );
  const inflationRate = input.inflationRate / 100;
  const r = toMonthlyRate(input.returnAfter);

  const expenseAtRetire =
    input.monthlyExpense * Math.pow(1 + inflationRate, yearsToRetire);
  const passiveIncome = (input.monthlyPension ?? 0) + (input.monthlyRental ?? 0);
  const netMonthlyNeed = Math.max(0, expenseAtRetire - passiveIncome);

  const target =
    r === 0
      ? netMonthlyNeed * monthsInRetirement
      : netMonthlyNeed * ((1 - Math.pow(1 + r, -monthsInRetirement)) / r);

  return Math.round(target);
}

// เงินที่คาดว่าจะมีจริง ณ วันเกษียณ (Compound + FV of Annuity)
export function calcProjectedAmount(input: RetirementInput): number {
  const monthsToRetire = Math.max(
    0,
    (input.retirementAge - input.currentAge) * MONTHS_PER_YEAR,
  );
  const r = toMonthlyRate(input.returnBefore);

  const fvCurrent = input.currentSavings * Math.pow(1 + r, monthsToRetire);
  const fvContributions =
    r === 0
      ? input.monthlySaving * monthsToRetire
      : input.monthlySaving * ((Math.pow(1 + r, monthsToRetire) - 1) / r);

  return Math.round(fvCurrent + fvContributions);
}

export function calculateRetirement(input: RetirementInput): RetirementResult {
  const targetAmount = calcTargetAmount(input);
  const projectedAmount = calcProjectedAmount(input);
  return {
    targetAmount,
    projectedAmount,
    gap: targetAmount - projectedAmount,
  };
}
