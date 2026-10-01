// src/retirement/retirement.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CalculateRetirementDto } from './dto/calculate-retirement.dto.js';
import { CreateRetirementPlanDto } from './dto/create-retirement-plan.dto.js';
import { UpdateRetirementPlanDto } from './dto/update-retirement-plan.dto.js';
import { RetirementService } from './retirement.service.js';

interface AuthRequest extends Request {
  user: { id: number; email: string };
}

@ApiTags('retirement')
@Controller('retirement')
export class RetirementController {
  constructor(private readonly retirementService: RetirementService) {}

  @ApiOperation({ summary: 'คำนวณเกษียณสดๆ (ไม่ต้อง login)' })
  @Post('calculate')
  calculate(@Body() dto: CalculateRetirementDto) {
    return this.retirementService.calculate(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'สร้างแผนเกษียณ (คำนวณ + บันทึก)' })
  @UseGuards(JwtAuthGuard)
  @Post('plans')
  create(@Req() req: AuthRequest, @Body() dto: CreateRetirementPlanDto) {
    return this.retirementService.create(req.user.id, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'ดูแผนเกษียณทั้งหมดของฉัน' })
  @UseGuards(JwtAuthGuard)
  @Get('plans')
  findAll(@Req() req: AuthRequest) {
    return this.retirementService.findAll(req.user.id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'ดูแผนเกษียณตาม id' })
  @UseGuards(JwtAuthGuard)
  @Get('plans/:id')
  findOne(@Req() req: AuthRequest, @Param('id', ParseIntPipe) id: number) {
    return this.retirementService.findOne(req.user.id, id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'แก้แผนเกษียณ (คำนวณใหม่)' })
  @UseGuards(JwtAuthGuard)
  @Patch('plans/:id')
  update(
    @Req() req: AuthRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRetirementPlanDto,
  ) {
    return this.retirementService.update(req.user.id, id, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'ลบแผนเกษียณ' })
  @UseGuards(JwtAuthGuard)
  @Delete('plans/:id')
  remove(@Req() req: AuthRequest, @Param('id', ParseIntPipe) id: number) {
    return this.retirementService.remove(req.user.id, id);
  }
}
