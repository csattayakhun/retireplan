import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { RetirementService } from './retirement.service.js';
import { RetirementController } from './retirement.controller.js';

@Module({
  imports: [AuthModule],
  providers: [RetirementService],
  controllers: [RetirementController],
})
export class RetirementModule {}
