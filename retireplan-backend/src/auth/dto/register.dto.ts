import { IsEmail, IsOptional, IsString, MinLength} from 'class-validator';

export class RegisterDto{
    @IsEmail({}, {message: 'อีเมลไม่ถูกต้อง'})
    email:string;
    
    @IsString()
    @MinLength(6, {message: 'รหัสผ่านต้องยาวอย่างน้อย 6 ตัว'})
    password: string

    @IsOptional()
    @IsString()name?:string;
}