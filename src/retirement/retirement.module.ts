import { Module } from '@nestjs/common';
import { RetirementService } from './retirement.service.js';
import { RetirementController } from './retirement.controller.js';

@Module({
  providers: [RetirementService],
  controllers: [RetirementController]
})
export class RetirementModule {}
