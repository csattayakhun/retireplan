// src/retirement/dto/create-retirement-plan.dto.ts
import { IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateRetirementPlanDto {
  @IsOptional() @IsString()
  planName?: string; // ไม่ส่งมา → schema ใส่ default "แผนเกษียณของฉัน"

  @IsInt() @Min(15) @Max(100)
  currentAge!: number;

  @IsInt() @Min(15) @Max(100)
  retirementAge!: number;

  @IsInt() @Min(15) @Max(120)
  lifeExpectancyAge!: number;

  @IsInt() @Min(0)
  currentSavings!: number;

  @IsInt() @Min(0)
  monthlySaving!: number;

  @IsInt() @Min(0)
  monthlyExpense!: number; // ค่าใช้จ่าย/เดือน หลังเกษียณ

  @IsOptional() @IsInt() @Min(0)
  monthlyPension?: number; // default 0

  @IsOptional() @IsInt() @Min(0)
  monthlyRental?: number; // default 0

  @IsOptional() @IsNumber() @Min(0) @Max(100)
  returnBefore?: number; // default 5

  @IsOptional() @IsNumber() @Min(0) @Max(100)
  returnAfter?: number; // default 2

  @IsOptional() @IsNumber() @Min(0) @Max(100)
  inflationRate?: number; // default 3
}   