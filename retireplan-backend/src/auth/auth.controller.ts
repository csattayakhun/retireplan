// src/auth/auth.controller.ts
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { AuthService } from './auth.service.js';
import { GoogleAuthGuard } from './google-auth.guard.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import { UserEntity } from './entities/user.entity.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  // 1) เริ่ม flow — guard จะ redirect ผู้ใช้ไปหน้า login ของ Google
  @ApiOperation({ summary: 'เริ่มเข้าสู่ระบบด้วย Google' })
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleAuth() {
    // ว่างไว้ — guard จัดการ redirect ไป Google ให้เอง
  }

  // 2) Google ส่งกลับมาที่นี่หลัง login สำเร็จ → ออก JWT → ส่งกลับ frontend
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(
    @Req() req: { user: { id: number; email: string } },
    @Res() res: Response,
  ) {
    const { accessToken } = await this.authService.signToken(req.user);
    const frontend = this.config.getOrThrow<string>('FRONTEND_URL');
    // ส่ง token กลับให้ frontend ผ่าน query string
    res.redirect(`${frontend}/auth/callback?token=${accessToken}`);
  }

  // 3) ดูข้อมูลผู้ใช้ปัจจุบัน (ต้องแนบ Bearer token)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'ดูข้อมูลผู้ใช้ปัจจุบัน' })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: { user: Record<string, unknown> }) {
    return new UserEntity(req.user);
  }
}
