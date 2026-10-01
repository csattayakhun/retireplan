import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CurrentUser, type AuthUser } from '../auth/current-user.decorator.js';
import { CalculateRetirementDto } from './dto/calculate-retirement.dto.js';
import { CreateRetirementPlanDto } from './dto/create-retirement-plan.dto.js';
import { UpdateRetirementPlanDto } from './dto/update-retirement-plan.dto.js';
import { RetirementService } from './retirement.service.js';

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
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateRetirementPlanDto) {
    return this.retirementService.create(user.id, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'ดูแผนเกษียณทั้งหมดของฉัน' })
  @UseGuards(JwtAuthGuard)
  @Get('plans')
  findAll(@CurrentUser() user: AuthUser) {
    return this.retirementService.findAll(user.id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'ดูแผนเกษียณตาม id' })
  @UseGuards(JwtAuthGuard)
  @Get('plans/:id')
  findOne(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.retirementService.findOne(user.id, id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'แก้แผนเกษียณ (คำนวณใหม่)' })
  @UseGuards(JwtAuthGuard)
  @Patch('plans/:id')
  update(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRetirementPlanDto,
  ) {
    return this.retirementService.update(user.id, id, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'ลบแผนเกษียณ' })
  @UseGuards(JwtAuthGuard)
  @Delete('plans/:id')
  remove(@CurrentUser() user: AuthUser, @Param('id', ParseIntPipe) id: number) {
    return this.retirementService.remove(user.id, id);
  }
}
