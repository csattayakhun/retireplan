import { IsInt, IsOptional, Min } from 'class-validator';

export class CalculateTaxDto {
  @IsInt()
  @Min(0)
  totalIncome!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  deductions?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  withholdingTax?: number;
}
