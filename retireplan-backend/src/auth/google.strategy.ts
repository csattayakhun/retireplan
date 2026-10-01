import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy,
  type Profile,
  type VerifyCallback,
} from 'passport-google-oauth20';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      clientID: config.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      clientSecret: config.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: config.getOrThrow<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const email = profile.emails?.[0]?.value;
    if (!email) return done(new Error('ไม่พบอีเมลจากบัญชี Google'), undefined);

    const user = await this.prisma.user.upsert({
      where: { email },
      update: {
        googleId: profile.id,
        name: profile.displayName,
        avatarUrl: profile.photos?.[0]?.value,
      },
      create: {
        email,
        googleId: profile.id,
        name: profile.displayName,
        avatarUrl: profile.photos?.[0]?.value,
      },
    });

    done(null, user);
  }
}
