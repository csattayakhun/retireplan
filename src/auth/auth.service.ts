// src/auth/auth.service.ts
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto.js';


@Injectable()
export class AuthService {
  // ดึง PrismaService เข้ามาใช้ (ได้เพราะ PrismaModule เป็น @Global)
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService) {}

  async register(dto: RegisterDto) {
    // 1️⃣ เช็คว่าอีเมลนี้มีคนใช้แล้วหรือยัง
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('อีเมลนี้ถูกใช้งานแล้ว');
    }

    // 2️⃣ เข้ารหัสรหัสผ่าน (10 = ความแข็งแรง) — ห้ามเก็บรหัสจริงเด็ดขาด!
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 3️⃣ บันทึก user ลง database
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
      },
    });

    // 4️⃣ ส่งข้อมูลกลับ แต่ "ตัดรหัสผ่านออก" ก่อน (ห้ามส่งรหัสกลับไปหา client)
    const { password, ...result } = user;
    return result;
  }

    async login(dto: LoginDto) {
    // 1️⃣ หา user จากอีเมล
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      // ⚠️ ไม่บอกว่า "ไม่มีอีเมลนี้" — บอกกลางๆ เพื่อความปลอดภัย
      throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }

    // 2️⃣ เทียบรหัสที่กรอก กับรหัสที่เข้ารหัสไว้ใน database
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }

    // 3️⃣ ถูกต้อง! ออก JWT token ให้
    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwt.signAsync(payload);
    return { accessToken };
  }
}