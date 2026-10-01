import { PartialType } from '@nestjs/mapped-types';
import { CreateRetirementPlanDto } from './create-retirement-plan.dto.js';

export class UpdateRetirementPlanDto extends PartialType(
  CreateRetirementPlanDto,
) {}
