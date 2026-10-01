// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}

  // ออก JWT ของระบบเราให้ user ที่ยืนยันตัวตนผ่าน Google มาแล้ว
  async signToken(user: { id: number; email: string }) {
    const payload = { sub: user.id, email: user.email };
    return { accessToken: await this.jwt.signAsync(payload) };
  }
}
