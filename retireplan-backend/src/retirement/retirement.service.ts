import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CalculateRetirementDto } from './dto/calculate-retirement.dto.js';
import { CreateRetirementPlanDto } from './dto/create-retirement-plan.dto.js';
import { UpdateRetirementPlanDto } from './dto/update-retirement-plan.dto.js';
import { RetirementPlanEntity } from './entities/retirement-plan.entity.js';
import {
  calculateRetirement,
  type RetirementInput,
  type RetirementResult,
} from './retirement.calc.js';

const DEFAULT_RETURN_BEFORE = 5;
const DEFAULT_RETURN_AFTER = 2;
const DEFAULT_INFLATION_RATE = 3;

@Injectable()
export class RetirementService {
  constructor(private readonly prisma: PrismaService) {}

  calculate(dto: CalculateRetirementDto): RetirementResult {
    return calculateRetirement(dto);
  }

  private toCalcInput(p: CreateRetirementPlanDto): RetirementInput {
    return {
      currentAge: p.currentAge,
      retirementAge: p.retirementAge,
      lifeExpectancyAge: p.lifeExpectancyAge,
      currentSavings: p.currentSavings,
      monthlySaving: p.monthlySaving,
      monthlyExpense: p.monthlyExpense,
      monthlyPension: p.monthlyPension ?? 0,
      monthlyRental: p.monthlyRental ?? 0,
      returnBefore: p.returnBefore ?? DEFAULT_RETURN_BEFORE,
      returnAfter: p.returnAfter ?? DEFAULT_RETURN_AFTER,
      inflationRate: p.inflationRate ?? DEFAULT_INFLATION_RATE,
    };
  }

  async create(userId: number, dto: CreateRetirementPlanDto) {
    const result = calculateRetirement(this.toCalcInput(dto));
    const plan = await this.prisma.retirementPlan.create({
      data: { ...dto, ...result, userId },
    });
    return new RetirementPlanEntity(plan);
  }

  async findAll(userId: number) {
    const plans = await this.prisma.retirementPlan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return plans.map((p) => new RetirementPlanEntity(p));
  }

  async findOne(userId: number, id: number) {
    const plan = await this.prisma.retirementPlan.findFirst({
      where: { id, userId },
    });
    if (!plan) throw new NotFoundException('ไม่พบแผนนี้ หรือคุณไม่ใช่เจ้าของ');
    return new RetirementPlanEntity(plan);
  }

  async update(userId: number, id: number, dto: UpdateRetirementPlanDto) {
    const existing = await this.findOne(userId, id);
    const merged: CreateRetirementPlanDto = { ...existing, ...dto };
    const result = calculateRetirement(this.toCalcInput(merged));
    const plan = await this.prisma.retirementPlan.update({
      where: { id },
      data: { ...dto, ...result },
    });
    return new RetirementPlanEntity(plan);
  }

  async remove(userId: number, id: number) {
    await this.findOne(userId, id);
    await this.prisma.retirementPlan.delete({ where: { id } });
    return { message: 'ลบแผนเรียบร้อย' };
  }
}
