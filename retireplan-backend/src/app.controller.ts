import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller()
export class AppController {
  @ApiOperation({ summary: 'ตรวจสอบว่า server ทำงานอยู่' })
  @Get('health')
  health() {
    return { status: 'ok' };
  }
}
