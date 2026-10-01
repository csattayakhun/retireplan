// src/retirement/retirement.service.ts
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

@Injectable()
export class RetirementService {
  constructor(private readonly prisma: PrismaService) {}

  /** endpoint คำนวณสดๆ ไม่บันทึก */
  calculate(dto: CalculateRetirementDto): RetirementResult {
    return calculateRetirement(dto);
  }

  /** แปลงชื่อ field จาก DB/DTO → ให้ตรงกับ input ของ calc */
  private toCalcInput(p: CreateRetirementPlanDto): RetirementInput {
    return {
      currentAge: p.currentAge,
      retireAge: p.retirementAge,
      lifeExpectancy: p.lifeExpectancyAge,
      currentSavings: p.currentSavings,
      monthlySaving: p.monthlySaving,
      monthlyExpenseAfterRetire: p.monthlyExpense,
      monthlyPension: p.monthlyPension ?? 0,
      monthlyRentIncome: p.monthlyRental ?? 0,
      returnBefore: p.returnBefore ?? 5,
      returnAfter: p.returnAfter ?? 2,
      inflation: p.inflationRate ?? 3,
    };
  }

  /** C — สร้างแผน: คำนวณผลลัพธ์ แล้วบันทึกพร้อม userId เจ้าของ */
  async create(userId: number, dto: CreateRetirementPlanDto) {
    const result = calculateRetirement(this.toCalcInput(dto));
    const plan = await this.prisma.retirementPlan.create({
      data: { ...dto, ...result, userId },
    });
    return new RetirementPlanEntity(plan);
  }

  /** R — ดูแผนทั้งหมด "ของ user คนนี้เท่านั้น" */
  async findAll(userId: number) {
    const plans = await this.prisma.retirementPlan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return plans.map((p) => new RetirementPlanEntity(p));
  }

  /** R — ดูแผนเดียว (ต้องเป็นเจ้าของ ไม่งั้น 404) */
  async findOne(userId: number, id: number) {
    const plan = await this.prisma.retirementPlan.findFirst({
      where: { id, userId }, // scope ด้วย userId → คนอื่นหาไม่เจอ
    });
    if (!plan) throw new NotFoundException('ไม่พบแผนนี้ หรือคุณไม่ใช่เจ้าของ');
    return new RetirementPlanEntity(plan);
  }

  /** U — แก้แผน: รวมค่าเดิม+ค่าใหม่ แล้วคำนวณใหม่ทั้งหมด */
  async update(userId: number, id: number, dto: UpdateRetirementPlanDto) {
    const existing = await this.findOne(userId, id); // ตรวจ ownership ก่อน
    const merged: CreateRetirementPlanDto = { ...existing, ...dto };
    const result = calculateRetirement(this.toCalcInput(merged));
    const plan = await this.prisma.retirementPlan.update({
      where: { id },
      data: { ...dto, ...result },
    });
    return new RetirementPlanEntity(plan);
  }

  /** D — ลบแผน (ต้องเป็นเจ้าของ) */
  async remove(userId: number, id: number) {
    await this.findOne(userId, id); // ตรวจ ownership ก่อน
    await this.prisma.retirementPlan.delete({ where: { id } });
    return { message: 'ลบแผนเรียบร้อย' };
  }
}
