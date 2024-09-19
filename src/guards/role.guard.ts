import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { EnumRole } from '@prisma/client';
import { config } from 'dotenv';
import { PrismaService } from 'src/prisma.service';

config();

@Injectable()
export class RoleCheck implements CanActivate {
    constructor(
        private reflector: Reflector,
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    async canActivate(context: ExecutionContext) {
        try {
            const reqiredRoles = this.reflector.getAllAndOverride<EnumRole[]>(
                'roles',
                [context.getClass(), context.getHandler()],
            );

            if (!reqiredRoles) return true;

            const request = context.switchToHttp().getRequest<Request>();
            const auth: string = request.headers['authorization'];

            if (!auth) return false;

            const token = auth.split(' ')[1];

            if (auth.split(' ').length < 2) return false;

            const isValid = this.jwtService.verify<{ id: number }>(token, {
                secret: process.env.JWT_SECRET_KEY,
            });

            if (isValid) {
                const user = await this.prisma.user.findFirst({
                    where: {
                        id: isValid.id,
                    },
                });

                return reqiredRoles.some((role) => role === user.role);
            }

            return false;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
