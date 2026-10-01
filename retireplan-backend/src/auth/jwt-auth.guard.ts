// src/auth/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Guard ตัวนี้จะไปเรียก strategy ชื่อ 'jwt' (ตัวที่เราเพิ่งสร้าง) มาตรวจให้
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
