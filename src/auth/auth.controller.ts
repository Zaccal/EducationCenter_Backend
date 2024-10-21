import {
    BadRequestException,
    Body,
    Controller,
    Post,
    Req,
    Res,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { loginDto } from './dto/login.dto';
import { registerDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/register')
    @UsePipes(new ValidationPipe())
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
            httpOnly: false,
            secure: true,
            sameSite: 'strict',
            maxAge: 900 * 1000,
        });

        response.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    }

    @Post('/login')
    @UsePipes(new ValidationPipe())
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
            httpOnly: false,
            secure: true,
            sameSite: 'strict',
            maxAge: 900 * 1000,
        });

        response.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return 'Successfully logged in';
    }

    @Post('/login-access')
    async loginAccess(
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response,
    ) {
        const refreshToken = request.cookies['refreshToken'];

        if (!refreshToken)
            throw new BadRequestException('Refresh token not provided');

        const tokens = await this.authService.getNewTokens(refreshToken);

        response.cookie('accessToken', tokens.accessToken, {
            httpOnly: false,
            secure: true,
            sameSite: 'strict',
            maxAge: 900 * 1000,
        });

        response.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    }

    @Post('/logout')
    async logout(
        @Req() request: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const refreshToken = request.cookies['refreshToken'];

        if (!refreshToken)
            throw new BadRequestException('Refresh token not provided');

        await this.authService.logout(refreshToken);
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');
        return 'Successfully logged out';
    }
}
