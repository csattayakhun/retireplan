// src/auth/google-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// ยามสำหรับ flow Google OAuth (เรียก strategy ชื่อ 'google')
@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {}
