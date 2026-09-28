// src/retirement/dto/calculate-retirement.dto.ts
import { IsInt, IsNumber, IsOptional, Min, Max } from 'class-validator';

export class CalculateRetirementDto {
  @IsInt() @Min(15) @Max(100)
  currentAge!: number; // อายุปัจจุบัน (ปี)

  @IsInt() @Min(15) @Max(100)
  retireAge!: number; // อายุที่จะเกษียณ

  @IsInt() @Min(15) @Max(120)
  lifeExpectancy!: number; // คาดว่าจะใช้ชีวิตถึงอายุ

  @IsInt() @Min(0)
  currentSavings!: number; // เงินเก็บปัจจุบัน (บาท)

  @IsInt() @Min(0)
  monthlySaving!: number; // ออมเพิ่มต่อเดือน (บาท)

  @IsInt() @Min(0)
  monthlyExpenseAfterRetire!: number; // ค่าใช้จ่ายต่อเดือน "หลังเกษียณ" (บาท, ราคาปัจจุบัน)

  @IsOptional() @IsInt() @Min(0)
  monthlyPension?: number; // บำนาญต่อเดือน (ถ้ามี)

  @IsOptional() @IsInt() @Min(0)
  monthlyRentIncome?: number; // ค่าเช่า/รายได้ประจำต่อเดือน (ถ้ามี)

  @IsNumber() @Min(0) @Max(100)
  returnBefore!: number; // % ผลตอบแทนต่อปี "ก่อน" เกษียณ (6 = 6%)

  @IsNumber() @Min(0) @Max(100)
  returnAfter!: number; // % ผลตอบแทนต่อปี "หลัง" เกษียณ

  @IsNumber() @Min(0) @Max(100)
  inflation!: number; // % เงินเฟ้อต่อปี
}