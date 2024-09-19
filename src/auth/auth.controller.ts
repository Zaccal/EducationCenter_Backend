import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { accessDto } from './dto/access.dto';
import { loginDto } from './dto/login.dto';
import { registerDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @HttpCode(200)
    @Post('/register')
    async register(@Body() dto: registerDto) {
        return await this.authService.register(dto);
    }

    @HttpCode(200)
    @Post('/login')
    async login(@Body() dto: loginDto) {
        return await this.authService.login(dto);
    }

    @HttpCode(200)
    @Post('/login-access')
    async loginAccess(@Body() dto: accessDto) {
        return await this.authService.getNewTokens(dto.refreshToken);
    }
}
