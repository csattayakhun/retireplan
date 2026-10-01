import { describe, it, expect, beforeEach } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller.js';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();
    appController = app.get<AppController>(AppController);
  });

  it('health คืนสถานะ ok', () => {
    expect(appController.health()).toEqual({ status: 'ok' });
  });
});
