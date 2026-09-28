import { IsInt, IsOptional, Min } from 'class-validator';

export class CalculateTaxDto {
  @IsInt() @Min(0)
  totalIncome!: number; // เงินได้ทั้งปี (บาท)

  @IsOptional() @IsInt() @Min(0)
  deductions?: number; // ค่าลดหย่อนรวม (บาท) — ไม่ส่งมา = 0

  @IsOptional() @IsInt() @Min(0)
  withholdingTax?: number; // ภาษีหัก ณ ที่จ่ายที่ถูกหักไปแล้ว (บาท)
}