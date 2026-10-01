import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './config/env.validation.js';
import { AppController } from './app.controller.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { RetirementModule } from './retirement/retirement.module.js';
import { TaxModule } from './tax/tax.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    PrismaModule,
    AuthModule,
    RetirementModule,
    TaxModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
