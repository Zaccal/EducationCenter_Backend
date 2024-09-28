import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import { PrismaService } from 'src/prisma.service';
import { loginDto } from './dto/login.dto';
import { registerDto } from './dto/register.dto';

@Injectable()
export class AuthService {
    constructor(
        private prismaService: PrismaService,
        private jwt: JwtService,
    ) {}

    async register(dto: registerDto, userAgent: string) {
        const user = await this.validateUserToRegister(dto);

        const hashedPassword = await hash(user.password);

        const newUser = await this.prismaService.user.create({
            data: {
                ...user,
                password: hashedPassword,
            },
        });

        const tokens = this.issueTokens(newUser.id, userAgent);
        await this.storeRefreshToken(
            newUser.id,
            userAgent,
            tokens.refreshToken,
        );

        return tokens;
    }

    private async validateUserToRegister(user: registerDto) {
        const posibleUser = await this.prismaService.user.findFirst({
            where: {
                OR: [
                    {
                        email: user.email,
                    },
                    {
                        firstName: user.firstName,
                    },
                    {
                        lastName: user.lastName,
                    },
                ],
            },
        });

        if (posibleUser)
            throw new BadRequestException('This user already exists.');

        return user;
    }

    private issueTokens(id: number, agent: string = 'web') {
        const data = {
            id,
        };

        const accessToken = this.jwt.sign(data, {
            expiresIn: '15m',
        });

        const refreshToken = this.jwt.sign(
            { agent, id },
            {
                expiresIn: '7d',
            },
        );

        return {
            accessToken,
            refreshToken,
        };
    }

    private async storeRefreshToken(
        id: number,
        agent: string,
        refreshToken: string,
    ) {
        await this.prismaService.refreshTokens.create({
            data: {
                userId: id,
                agent: agent,
                token: refreshToken,
            },
        });
    }

    async login(dto: loginDto, agent: string) {
        const user = await this.validateUserToLogin(dto);

        await this.prismaService.refreshTokens.deleteMany({
            where: {
                agent,
            },
        });

        const tokens = this.issueTokens(user.id, agent);

        await this.storeRefreshToken(user.id, agent, tokens.refreshToken);

        return tokens;
    }

    private async validateUserToLogin(user: loginDto) {
        const userLocal = await this.prismaService.user.findFirst({
            where: {
                email: user.email,
            },
        });

        if (!userLocal) throw new UnauthorizedException('User does not exist');

        const isValidPassword = await verify(userLocal.password, user.password);

        if (!isValidPassword)
            throw new BadRequestException('Password or email is wrong');

        return userLocal;
    }

    async getNewTokens(refreshToken: string) {
        try {
            const decoded = await this.verifyRefreshToken(refreshToken);

            const tokens = this.issueTokens(decoded.id, decoded.agent);
            await this.storeRefreshToken(
                decoded.id,
                decoded.agent,
                tokens.refreshToken,
            );

            return tokens;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    private async verifyRefreshToken(refreshToken: string) {
        const decoded = await this.jwt.verifyAsync<{
            id: number;
            agent: string;
        }>(refreshToken);

        const tokenInDb = await this.prismaService.refreshTokens.findFirst({
            where: {
                userId: decoded.id,
                agent: decoded.agent,
                token: refreshToken,
            },
        });

        if (!tokenInDb) {
            this.prismaService.refreshTokens.deleteMany({
                where: {
                    userId: decoded.id,
                },
            });

            throw new BadRequestException('Invalid token');
        }

        return decoded;
    }

    async logout(refreshToken: string) {
        try {
            const decoded = await this.verifyRefreshToken(refreshToken);

            await this.prismaService.refreshTokens.deleteMany({
                where: {
                    agent: decoded.agent,
                    userId: decoded.id,
                    token: refreshToken,
                },
            });
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
