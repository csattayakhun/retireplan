// src/auth/entities/user.entity.ts
// "หน้าตา" ของ user ที่ส่งออกไปหา client — ซ่อน field ภายในไม่ให้หลุด
import { Exclude } from 'class-transformer';

export class UserEntity {
  id!: number;
  email!: string;
  name!: string | null;
  avatarUrl!: string | null;

  @Exclude() googleId?: string | null;
  @Exclude() password?: string | null;
  @Exclude() createdAt?: Date;
  @Exclude() updatedAt?: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
