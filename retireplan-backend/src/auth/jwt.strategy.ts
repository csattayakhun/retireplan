import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {PassportStrategy} from '@nestjs/passport';
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from '../prisma/prisma.service.js';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      // ดึง token จาก header: "Authorization: Bearer <token>"
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // ไม่ยอมรับ token ที่หมดอายุ
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'), // รหัสลับตัวเดียวกับตอนสร้าง
    });
  }

  // passport เรียก validate() หลังตรวจว่า token ถูกต้อง — payload คือข้อมูลใน token
  async validate(payload: { sub: number; email: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    const { password, ...result } = user;
    return result; // ค่านี้จะถูกแนบไว้ที่ req.user ให้ใช้ใน controller
  }
}