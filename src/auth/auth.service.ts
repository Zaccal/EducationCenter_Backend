import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { hash, verify } from 'argon2';
import { PrismaService } from 'src/prisma.service';
import { loginDto } from './dto/login.dto';
import { registerDto } from './dto/register.dto';

interface ITokens {
    accessToken: string;
    refreshToken: string;
}

@Injectable()
export class AuthService {
    constructor(
        private prismaService: PrismaService,
        private jwt: JwtService,
    ) {}

    async register(dto: registerDto) {
        const user = await this.validateUserToRegister(dto);

        const hashedPassword = await hash(user.password);

        const newUser = await this.prismaService.user.create({
            data: {
                ...user,
                password: hashedPassword,
            },
        });

        const tokens = this.issueTokens(newUser.id);

        return this.returnFieldsUser(tokens, newUser);
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

    private issueTokens(id: number) {
        const data = {
            id,
        };

        const accessToken = this.jwt.sign(data, {
            expiresIn: '15m',
        });

        const refreshToken = this.jwt.sign(data, {
            expiresIn: '7d',
        });

        return {
            accessToken,
            refreshToken,
        };
    }

    private returnFieldsUser(tokens: ITokens, user: User) {
        return {
            user: {
                id: user.id,
                email: user.email,
            },
            ...tokens,
        };
    }

    async login(dto: loginDto) {
        const user = await this.validateUserToLogin(dto);

        const tokens = this.issueTokens(user.id);

        return this.returnFieldsUser(tokens, user);
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
            const validateUser = await this.jwt.verifyAsync<{ id: number }>(
                refreshToken,
            );

            if (!validateUser)
                throw new BadRequestException('Token is not valid');

            const user = await this.prismaService.user.findFirst({
                where: {
                    id: validateUser.id,
                },
            });

            const tokens = this.issueTokens(user.id);

            return this.returnFieldsUser(tokens, user);
        } catch (error) {
            throw new BadRequestException('Error: ' + error.message);
        }
    }
}
