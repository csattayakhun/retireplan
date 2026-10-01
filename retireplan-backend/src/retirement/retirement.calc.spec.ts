import { describe, it, expect } from 'vitest';
import {
  calcProjectedAmount,
  calcTargetAmount,
  calculateRetirement,
  type RetirementInput,
} from './retirement.calc.js';

const base: RetirementInput = {
  currentAge: 30,
  retirementAge: 60,
  lifeExpectancyAge: 80,
  currentSavings: 0,
  monthlySaving: 0,
  monthlyExpense: 0,
  returnBefore: 0,
  returnAfter: 0,
  inflationRate: 0,
};

describe('calcProjectedAmount (เงินที่คาดว่าจะมี)', () => {
  it('ผลตอบแทน 0% → บวกเงินตรงๆ (กัน edge case หารศูนย์)', () => {
    const input = { ...base, currentSavings: 100_000, monthlySaving: 5_000 };
    expect(calcProjectedAmount(input)).toBe(1_900_000);
  });

  it('มีผลตอบแทน → ใช้ Future Value of Annuity ถูกต้อง', () => {
    const input = {
      ...base,
      currentAge: 59,
      monthlySaving: 10_000,
      returnBefore: 12,
    };
    expect(calcProjectedAmount(input)).toBe(126_825);
  });

  it('เกษียณไปแล้ว (retirementAge ≤ currentAge) → ไม่ติดลบ คืนเงินก้อนเดิม', () => {
    const input = {
      ...base,
      currentAge: 65,
      retirementAge: 60,
      currentSavings: 500_000,
    };
    expect(calcProjectedAmount(input)).toBe(500_000);
  });
});

describe('calcTargetAmount (เงินที่ควรมี)', () => {
  it('ผลตอบแทนหลังเกษียณ 0% + เงินเฟ้อ 0% → ค่าใช้จ่าย × จำนวนเดือน', () => {
    const input = {
      ...base,
      currentAge: 60,
      monthlyExpense: 20_000,
    };
    expect(calcTargetAmount(input)).toBe(4_800_000);
  });

  it('รายได้ประจำ (บำนาญ+ค่าเช่า) ครอบคลุมค่าใช้จ่าย → target = 0', () => {
    const input = {
      ...base,
      currentAge: 60,
      monthlyExpense: 20_000,
      monthlyPension: 15_000,
      monthlyRental: 6_000,
    };
    expect(calcTargetAmount(input)).toBe(0);
  });
});

describe('calculateRetirement (ตัวรวม)', () => {
  it('gap ต้องเท่ากับ target − projected เสมอ', () => {
    const input = {
      ...base,
      currentSavings: 200_000,
      monthlySaving: 8_000,
      monthlyExpense: 25_000,
      returnBefore: 6,
      returnAfter: 4,
      inflationRate: 3,
    };
    const r = calculateRetirement(input);
    expect(r.gap).toBe(r.targetAmount - r.projectedAmount);
  });
});
