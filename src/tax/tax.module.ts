import { Module } from '@nestjs/common';
import { TaxService } from './tax.service.js';
import { TaxController } from './tax.controller.js';

@Module({
  providers: [TaxService],
  controllers: [TaxController]
})
export class TaxModule {}
