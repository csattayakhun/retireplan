// src/retirement/dto/create-retirement-plan.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateRetirementPlanDto {
  @ApiPropertyOptional({ example: 'แผนเกษียณของฉัน' })
  @IsOptional() @IsString()
  planName?: string;

  @ApiProperty({ example: 30, description: 'อายุปัจจุบัน (ปี)' })
  @IsInt() @Min(15) @Max(100)
  currentAge!: number;

  @ApiProperty({ example: 60, description: 'อายุที่จะเกษียณ' })
  @IsInt() @Min(15) @Max(100)
  retirementAge!: number;

  @ApiProperty({ example: 80, description: 'คาดว่าจะใช้ชีวิตถึงอายุ' })
  @IsInt() @Min(15) @Max(120)
  lifeExpectancyAge!: number;

  @ApiProperty({ example: 100000, description: 'เงินเก็บปัจจุบัน (บาท)' })
  @IsInt() @Min(0)
  currentSavings!: number;

  @ApiProperty({ example: 5000, description: 'ออมเพิ่มต่อเดือน (บาท)' })
  @IsInt() @Min(0)
  monthlySaving!: number;

  @ApiProperty({ example: 20000, description: 'ค่าใช้จ่ายต่อเดือนหลังเกษียณ (บาท)' })
  @IsInt() @Min(0)
  monthlyExpense!: number;

  @ApiPropertyOptional({ example: 0, description: 'บำนาญต่อเดือน' })
  @IsOptional() @IsInt() @Min(0)
  monthlyPension?: number;

  @ApiPropertyOptional({ example: 0, description: 'ค่าเช่า/รายได้ประจำต่อเดือน' })
  @IsOptional() @IsInt() @Min(0)
  monthlyRental?: number;

  @ApiPropertyOptional({ example: 5, description: '% ผลตอบแทนก่อนเกษียณต่อปี' })
  @IsOptional() @IsNumber() @Min(0) @Max(100)
  returnBefore?: number;

  @ApiPropertyOptional({ example: 2, description: '% ผลตอบแทนหลังเกษียณต่อปี' })
  @IsOptional() @IsNumber() @Min(0) @Max(100)
  returnAfter?: number;

  @ApiPropertyOptional({ example: 3, description: '% เงินเฟ้อต่อปี' })
  @IsOptional() @IsNumber() @Min(0) @Max(100)
  inflationRate?: number;
}