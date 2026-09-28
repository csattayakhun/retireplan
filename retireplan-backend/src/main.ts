// src/main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

   app.enableCors();

  // ---- ตั้งค่า Swagger (OpenAPI) ----
  const config = new DocumentBuilder()
    .setTitle('RetirePlan API')
    .setDescription('API วางแผนเกษียณ + คำนวณภาษีเงินได้บุคคลธรรมดา')
    .setVersion('1.0')
    .addBearerAuth() // ⬅️ เพิ่มปุ่ม "Authorize" ให้ใส่ JWT ทดสอบ route ที่ต้อง login
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // ⬅️ เปิดที่ /docs

  await app.listen(process.env.PORT ?? 3000);

}
await bootstrap();