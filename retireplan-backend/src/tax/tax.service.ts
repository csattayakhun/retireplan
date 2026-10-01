import { Injectable } from '@nestjs/common';
import { CalculateTaxDto } from './dto/calculate-tax.dto.js';
import { calculateTax, type TaxResult } from './tax.calc.js';

@Injectable()
export class TaxService {
  calculate(dto: CalculateTaxDto): TaxResult {
    return calculateTax(dto);
  }
}
