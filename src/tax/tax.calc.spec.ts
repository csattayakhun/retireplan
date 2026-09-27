// src/tax/tax.calc.spec.ts
import { describe, it, expect } from 'vitest';
import { calcProgressiveTax, calculateTax } from './tax.calc.js';

describe('calcProgressiveTax (ภาษีขั้นบันได)', () => {
  it('เงินได้สุทธิ ≤ 150,000 → ยกเว้นภาษี (0 บาท)', () => {
    expect(calcProgressiveTax(150_000)).toBe(0);
  });

  it('เงินได้สุทธิ 300,000 (พอดีขอบขั้น) → 5% ของ 150,000 = 7,500', () => {
    expect(calcProgressiveTax(300_000)).toBe(7_500);
  });

  it('เงินได้สุทธิ 400,000 → คิดข้ามขั้น = 17,500', () => {
    // 0 (แสนห้าแรก) + 7,500 (5%) + 10,000 (10%) = 17,500
    expect(calcProgressiveTax(400_000)).toBe(17_500);
  });

  it('เงินได้สุทธิ 500,000 (พอดีขอบขั้น) → 27,500', () => {
    // 7,500 + (10% ของ 200,000 = 20,000) = 27,500
    expect(calcProgressiveTax(500_000)).toBe(27_500);
  });

  it('เงินได้สุทธิ 6,000,000 → แตะขั้นสูงสุด 35% = 1,615,000', () => {
    expect(calcProgressiveTax(6_000_000)).toBe(1_615_000);
  });
});

describe('calculateTax (ตัวรวม)', () => {
  it('หักลดหย่อนก่อน แล้วคิดภาษีจากเงินได้สุทธิ', () => {
    const r = calculateTax({ totalIncome: 600_000, deductions: 200_000 });
    expect(r.netIncome).toBe(400_000);
    expect(r.taxAmount).toBe(17_500);
  });

  it('ภาษีหัก ณ ที่จ่าย > ภาษีจริง → ได้เงินคืน (taxDue ติดลบ)', () => {
    const r = calculateTax({ totalIncome: 600_000, deductions: 200_000, withholdingTax: 20_000 });
    expect(r.taxDue).toBe(-2_500); // 17,500 − 20,000
  });

  it('ไม่มีรายได้ → ภาษี 0 ทั้งหมด', () => {
    const r = calculateTax({ totalIncome: 0 });
    expect(r).toEqual({ netIncome: 0, taxAmount: 0, taxDue: 0 });
  });
});