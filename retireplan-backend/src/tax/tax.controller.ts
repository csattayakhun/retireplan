import { Body, Controller, Post } from '@nestjs/common';
import { CalculateTaxDto } from './dto/calculate-tax.dto.js';
import { TaxService } from './tax.service.js';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('tax')
@Controller('tax')
export class TaxController {
  constructor(private readonly taxService: TaxService) {}

  @Post('calculate')
  calculate(@Body() dto: CalculateTaxDto) {
    return this.taxService.calculate(dto);
  }
}
