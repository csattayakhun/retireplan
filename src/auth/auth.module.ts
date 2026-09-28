// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy.js';

@Module({
  imports: [
    // ตั้งค่า JWT โดยดึงรหัสลับจาก .env (ผ่าน ConfigService)
// ✅ แก้เป็น
    PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'), // รหัสลับจาก .env
        signOptions: { expiresIn: '1d' },          // token หมดอายุใน 1 วัน
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [PassportModule, JwtStrategy], 
})
export class AuthModule {}