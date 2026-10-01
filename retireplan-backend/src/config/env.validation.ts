// src/config/env.validation.ts
// ตรวจสอบ environment variables ตอนแอป "เริ่มทำงาน" (fail fast)
// ใช้ class-validator ที่มีอยู่แล้ว — ไม่ต้องลง Joi เพิ่ม
import { plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsString, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  DATABASE_URL!: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  GOOGLE_CLIENT_ID!: string;

  @IsString()
  @IsNotEmpty()
  GOOGLE_CLIENT_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  GOOGLE_CALLBACK_URL!: string;

  @IsString()
  @IsNotEmpty()
  FRONTEND_URL!: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validated, { skipMissingProperties: false });

  if (errors.length > 0) {
    const messages = errors
      .map((e) => Object.values(e.constraints ?? {}).join(', '))
      .join('\n');
    // โยน error → แอปจะไม่ยอม boot ถ้า env ไม่ครบ (ดีกว่าพังตอน runtime)
    throw new Error(`❌ Environment variables ไม่ถูกต้อง:\n${messages}`);
  }

  return validated;
}
