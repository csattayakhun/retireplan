import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  // ปิด connection ให้สะอาดตอนแอปปิด (กัน connection ค้าง)
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
