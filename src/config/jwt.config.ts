import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const getJwtConfigAccess = async (
    configService: ConfigService,
): Promise<JwtModuleOptions> => ({
    secret: configService.get('JWT_SECRET_KEY_ACCESS'),
    signOptions: {
        expiresIn: '15m',
    },
});

export const getJwtConfigRefresh = async (
    configService: ConfigService,
): Promise<JwtModuleOptions> => ({
    secret: configService.get('JWT_SECRET_KEY_REFRESH'),
    signOptions: {
        expiresIn: '7d',
    },
});
