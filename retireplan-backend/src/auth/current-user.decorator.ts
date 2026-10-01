// src/auth/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// ข้อมูล user ที่ passport แนบไว้ที่ req.user หลังผ่าน JWT guard
export interface AuthUser {
  id: number;
  email: string;
  name?: string | null;
  avatarUrl?: string | null;
}

// ดึง user จาก request โดยตรง — แทนการใช้ @Req() แล้วเข้าถึง req.user เอง
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser => {
    return ctx.switchToHttp().getRequest<{ user: AuthUser }>().user;
  },
);
