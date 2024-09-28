import { Body, Controller, HttpCode, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { accessDto } from './dto/access.dto';
import { loginDto } from './dto/login.dto';
import { registerDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @HttpCode(200)
    @Post('/register')
    async register(
        @Body() dto: registerDto,
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response,
    ) {
        const tokens = await this.authService.register(
            dto,
            request.headers['user-agent'],
        );

        response.cookie('accessToken', tokens.accessToken, {
            httpOnly: true,
            // secure: true,
            sameSite: 'strict',
            maxAge: 900 * 1000,
        });

        response.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            // secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    }

    @HttpCode(200)
    @Post('/login')
    async login(
        @Body() dto: loginDto,
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response,
    ) {
        const tokens = await this.authService.login(
            dto,
            request.headers['user-agent'],
        );

        response.cookie('accessToken', tokens.accessToken, {
            httpOnly: true,
            // secure: true,
            sameSite: 'strict',
            maxAge: 900 * 1000,
        });

        response.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            // secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    }

    @HttpCode(200)
    @Post('/login-access')
    async loginAccess(
        @Body() dto: accessDto,
        @Res({ passthrough: true }) response: Response,
    ) {
        const tokens = await this.authService.getNewTokens(dto.refreshToken);

        response.cookie('accessToken', tokens.accessToken, {
            httpOnly: true,
            // secure: true,
            sameSite: 'strict',
            maxAge: 900 * 1000,
        });

        response.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            // secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    }

    @HttpCode(200)
    @Post('/logout')
    async logout(
        @Body() dto: accessDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        await this.authService.logout(dto.refreshToken);
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');
        return 'Successfully logged out';
    }
}
