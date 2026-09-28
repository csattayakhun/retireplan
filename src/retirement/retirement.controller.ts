// src/retirement/retirement.controller.ts
import {
  Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CalculateRetirementDto } from './dto/calculate-retirement.dto.js';
import { CreateRetirementPlanDto } from './dto/create-retirement-plan.dto.js';
import { UpdateRetirementPlanDto } from './dto/update-retirement-plan.dto.js';
import { RetirementService } from './retirement.service.js';

// req.user คือค่าที่ JwtStrategy.validate() แนบมาให้ (มี id, email)
interface AuthRequest extends Request {
  user: { id: number; email: string };
}

@Controller('retirement')
export class RetirementController {
  constructor(private readonly retirementService: RetirementService) {}

  // 🌐 สาธารณะ: คำนวณสดๆ ไม่ต้อง login (Lesson 5)
  @Post('calculate')
  calculate(@Body() dto: CalculateRetirementDto) {
    return this.retirementService.calculate(dto);
  }

  // 🔒 ตั้งแต่นี้ลงไป ต้อง login (แนบ Authorization: Bearer <token>)
  @UseGuards(JwtAuthGuard)
  @Post('plans')
  create(@Req() req: AuthRequest, @Body() dto: CreateRetirementPlanDto) {
    return this.retirementService.create(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('plans')
  findAll(@Req() req: AuthRequest) {
    return this.retirementService.findAll(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('plans/:id')
  findOne(@Req() req: AuthRequest, @Param('id', ParseIntPipe) id: number) {
    return this.retirementService.findOne(req.user.id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('plans/:id')
  update(
    @Req() req: AuthRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRetirementPlanDto,
  ) {
    return this.retirementService.update(req.user.id, id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('plans/:id')
  remove(@Req() req: AuthRequest, @Param('id', ParseIntPipe) id: number) {
    return this.retirementService.remove(req.user.id, id);
  }
}