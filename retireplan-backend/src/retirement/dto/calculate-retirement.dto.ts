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
  monthlyExpense!: number;

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
  returnBefore!: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  returnAfter!: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  inflationRate!: number;
}
