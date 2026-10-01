interface TaxBracket {
  upTo: number;
  rate: number;
}

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
  netIncome: number;
  taxAmount: number;
  taxDue: number;
}

export function calcProgressiveTax(netIncome: number): number {
  const taxable = Math.max(0, netIncome);
  let tax = 0;
  let lower = 0;

  for (const bracket of TAX_BRACKETS) {
    if (taxable <= lower) break;
    const amountInBracket = Math.min(taxable, bracket.upTo) - lower;
    tax += amountInBracket * bracket.rate;
    lower = bracket.upTo;
  }
  return Math.round(tax);
}

export function calculateTax(input: TaxInput): TaxResult {
  const netIncome = Math.max(0, input.totalIncome - (input.deductions ?? 0));
  const taxAmount = calcProgressiveTax(netIncome);
  const taxDue = taxAmount - (input.withholdingTax ?? 0);
  return { netIncome, taxAmount, taxDue };
}
