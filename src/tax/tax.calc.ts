// src/tax/tax.calc.ts
// ⚠️ pure: รับตัวเลข → คืนตัวเลข ไม่ยุ่ง NestJS/database

/** หนึ่งขั้นของบันไดภาษี: เก็บภาษีอัตรา rate สำหรับเงินได้ "ไม่เกิน" upTo */
interface TaxBracket {
  upTo: number; // ขอบบนของขั้น (บาท) — ขั้นสูงสุดใช้ Infinity
  rate: number; // อัตราภาษี (0.05 = 5%)
}

/**
 * ตารางภาษีเงินได้บุคคลธรรมดา (เก็บเป็น "ข้อมูล" ไม่ hardcode if)
 * ข้อดี: ปีหน้ารัฐเปลี่ยนอัตรา → แก้แค่ตารางนี้ ไม่ต้องแตะ logic
 */
const TAX_BRACKETS: TaxBracket[] = [
  { upTo: 150_000, rate: 0 },
  { upTo: 300_000, rate: 0.05 },
  { upTo: 500_000, rate: 0.1 },
  { upTo: 750_000, rate: 0.15 },
  { upTo: 1_000_000, rate: 0.2 },
  { upTo: 2_000_000, rate: 0.25 },
  { upTo: 5_000_000, rate: 0.3 },
  { upTo: Infinity, rate: 0.35 },
];

export interface TaxInput {
  totalIncome: number;
  deductions?: number;
  withholdingTax?: number;
}

export interface TaxResult {
  netIncome: number;  // เงินได้สุทธิ (หลังหักลดหย่อน)
  taxAmount: number;  // ภาษีที่ต้องเสียตามขั้นบันได
  taxDue: number;     // ต้องจ่ายเพิ่ม (+) / ได้คืน (−) หลังหักภาษี ณ ที่จ่าย
}

/** คำนวณภาษีแบบขั้นบันได: วนเก็บทีละขั้นเฉพาะเงินที่ตกในช่วงนั้น */
export function calcProgressiveTax(netIncome: number): number {
  const taxable = Math.max(0, netIncome);
  let tax = 0;
  let lower = 0; // ขอบล่างของขั้นที่กำลังคิด

  for (const bracket of TAX_BRACKETS) {
    if (taxable <= lower) break; // เงินหมดแล้ว ไม่ต้องคิดขั้นต่อไป
    // เงินที่ตกอยู่ในขั้นนี้ = ส่วนที่อยู่ระหว่าง lower ถึง upTo
    const amountInBracket = Math.min(taxable, bracket.upTo) - lower;
    tax += amountInBracket * bracket.rate;
    lower = bracket.upTo;
  }
  return Math.round(tax);
}

/** ตัวรวม: หาเงินได้สุทธิ → คิดภาษี → หักภาษี ณ ที่จ่าย */
export function calculateTax(input: TaxInput): TaxResult {
  const netIncome = Math.max(0, input.totalIncome - (input.deductions ?? 0));
  const taxAmount = calcProgressiveTax(netIncome);
  const taxDue = taxAmount - (input.withholdingTax ?? 0);
  return { netIncome, taxAmount, taxDue };
}