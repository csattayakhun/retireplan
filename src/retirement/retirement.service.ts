import { Injectable } from '@nestjs/common';
import { CalculateRetirementDto } from './dto/calculate-retirement.dto.js';
import { calculateRetirement, type RetirementResult } from './retirement.calc.js';

@Injectable()
export class RetirementService {
  calculate(dto: CalculateRetirementDto): RetirementResult {
    return calculateRetirement(dto);
  }
}