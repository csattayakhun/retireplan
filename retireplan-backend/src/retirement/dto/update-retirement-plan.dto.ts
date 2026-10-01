// src/retirement/dto/update-retirement-plan.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateRetirementPlanDto } from './create-retirement-plan.dto.js';

// ทุก field ของ Create แต่กลายเป็น optional หมด (แก้เฉพาะ field ที่ส่งมา)
export class UpdateRetirementPlanDto extends PartialType(
  CreateRetirementPlanDto,
) {}
