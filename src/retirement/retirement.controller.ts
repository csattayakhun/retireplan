import { Body, Controller, Post } from '@nestjs/common';
import { CalculateRetirementDto } from './dto/calculate-retirement.dto.js';
import { RetirementService } from './retirement.service.js';

@Controller('retirement')
export class RetirementController {
  constructor(private readonly retirementService: RetirementService) {}

  @Post('calculate')
  calculate(@Body() dto: CalculateRetirementDto) {
    return this.retirementService.calculate(dto);
  }
}