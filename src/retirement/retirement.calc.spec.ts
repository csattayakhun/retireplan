// src/retirement/retirement.calc.spec.ts
import { describe, it, expect } from 'vitest';
import {
  calcProjectedAmount,
  calcTargetAmount,
  calculateRetirement,
  type RetirementInput,
} from './retirement.calc.js'; // ⚠️ ESM: import ไฟล์ตัวเองลงท้าย .js เสมอ

// ฐานข้อมูล input กลางไว้ใช้ซ้ำ แล้วค่อย override ทีละเคส (DRY)
const base: RetirementInput = {
  currentAge: 30,
  retireAge: 60,
  lifeExpectancy: 80,
  currentSavings: 0,
  monthlySaving: 0,
  monthlyExpenseAfterRetire: 0,
  returnBefore: 0,
  returnAfter: 0,
  inflation: 0,
};

describe('calcProjectedAmount (เงินที่คาดว่าจะมี)', () => {
  it('ผลตอบแทน 0% → บวกเงินตรงๆ (กัน edge case หารศูนย์)', () => {
    const input = { ...base, currentSavings: 100_000, monthlySaving: 5_000 };
    // 100,000 + (5,000 × 360 เดือน) = 1,900,000
    expect(calcProjectedAmount(input)).toBe(1_900_000);
  });

  it('มีผลตอบแทน → ใช้ Future Value of Annuity ถูกต้อง', () => {
    const input = {
      ...base,
      currentAge: 59, // เหลือ 12 เดือน ก่อนเกษียณ
      monthlySaving: 10_000,
      returnBefore: 12, // 1% ต่อเดือน
    };
    // 10,000 × ((1.01^12 − 1) / 0.01) ≈ 126,825
    expect(calcProjectedAmount(input)).toBe(126_825);
  });

  it('เกษียณไปแล้ว (retireAge ≤ currentAge) → ไม่ติดลบ คืนเงินก้อนเดิม', () => {
    const input = { ...base, currentAge: 65, retireAge: 60, currentSavings: 500_000 };
    expect(calcProjectedAmount(input)).toBe(500_000);
  });
});

describe('calcTargetAmount (เงินที่ควรมี)', () => {
  it('ผลตอบแทนหลังเกษียณ 0% + เงินเฟ้อ 0% → ค่าใช้จ่าย × จำนวนเดือน', () => {
    const input = {
      ...base,
      currentAge: 60, // เกษียณเลย → ไม่ต้องปรับเงินเฟ้อ
      monthlyExpenseAfterRetire: 20_000,
    };
    // 20,000 × (20 ปี × 12) = 4,800,000
    expect(calcTargetAmount(input)).toBe(4_800_000);
  });

  it('รายได้ประจำ (บำนาญ+ค่าเช่า) ครอบคลุมค่าใช้จ่าย → target = 0', () => {
    const input = {
      ...base,
      currentAge: 60,
      monthlyExpenseAfterRetire: 20_000,
      monthlyPension: 15_000,
      monthlyRentIncome: 6_000, // รวม 21,000 > 20,000
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
      monthlyExpenseAfterRetire: 25_000,
      returnBefore: 6,
      returnAfter: 4,
      inflation: 3,
    };
    const r = calculateRetirement(input);
    expect(r.gap).toBe(r.targetAmount - r.projectedAmount);
  });
});