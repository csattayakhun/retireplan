import { Exclude } from 'class-transformer';

export class RetirementPlanEntity {
  id!: number;
  planName!: string;

  currentAge!: number;
  retirementAge!: number;
  lifeExpectancyAge!: number;
  currentSavings!: number;
  monthlySaving!: number;
  monthlyExpense!: number;
  monthlyPension!: number;
  monthlyRental!: number;

  returnBefore!: number;
  returnAfter!: number;
  inflationRate!: number;

  targetAmount!: number | null;
  projectedAmount!: number | null;
  gap!: number | null;

  createdAt!: Date;
  updatedAt!: Date;

  @Exclude() userId!: number;

  constructor(partial: Partial<RetirementPlanEntity>) {
    Object.assign(this, partial);
  }
}
