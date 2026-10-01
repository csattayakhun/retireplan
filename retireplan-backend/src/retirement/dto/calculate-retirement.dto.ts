// src/retirement/dto/calculate-retirement.dto.ts
// ชื่อ field ตรงกับ schema.prisma / RetirementInput — ไม่ต้อง map ข้ามเลเยอร์
import { IsInt, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CalculateRetirementDto {
  @IsInt()
  @Min(15)
  @Max(100)
  currentAge!: number;

  @IsInt()
  @Min(15)
  @Max(100)
  retirementAge!: number;

  @IsInt()
  @Min(15)
  @Max(120)
  lifeExpectancyAge!: number;

  @IsInt()
  @Min(0)
  currentSavings!: number;

  @IsInt()
  @Min(0)
  monthlySaving!: number;

  @IsInt()
  @Min(0)
  monthlyExpense!: number; // ค่าใช้จ่ายต่อเดือนหลังเกษียณ (ราคาปัจจุบัน)

  @IsOptional()
  @IsInt()
  @Min(0)
  monthlyPension?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  monthlyRental?: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  returnBefore!: number; // % ต่อปี ก่อนเกษียณ (6 = 6%)

  @IsNumber()
  @Min(0)
  @Max(100)
  returnAfter!: number; // % ต่อปี หลังเกษียณ

  @IsNumber()
  @Min(0)
  @Max(100)
  inflationRate!: number; // % เงินเฟ้อต่อปี
}
