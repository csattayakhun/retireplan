import {Body, Controller, Get, Post, UseGuards,Request } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService)
{}
    @Post('register')
    register(@Body() dto: RegisterDto){

        return this.authService.register(dto);
    }
    @Post('login')
    login(@Body() dto:LoginDto){
        return this.authService.login(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    me(@Request() req: any ){
        return req.user;
    }
}
