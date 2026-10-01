// src/main.ts
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // ตัด field ที่ไม่มีใน DTO ทิ้ง
      forbidNonWhitelisted: true, // มี field แปลกปลอม → เด้ง 400 (เข้มขึ้น)
      transform: true, // แปลง payload เป็น instance ของ DTO + coerce type
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // ซ่อน field ที่ @Exclude ไว้ใน Entity ก่อนส่ง response ออกไป
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.enableCors();

  // ---- ตั้งค่า Swagger (OpenAPI) ----
  const config = new DocumentBuilder()
    .setTitle('RetirePlan API')
    .setDescription('API วางแผนเกษียณ + คำนวณภาษีเงินได้บุคคลธรรมดา')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
