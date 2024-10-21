import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { updateDto } from './dto/update.dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    private user = this.prisma.user;

    async getProfile(id: number) {
        return await this.user.findFirst({
            where: {
                id,
            },
            select: {
                id: true,
                avatar: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
            },
        });
    }

    async getBy(id: string) {
        const user = await this.user.findFirst({
            where: {
                OR: [
                    {
                        firstName: {
                            contains: id,
                            mode: 'insensitive',
                        },
                    },
                    {
                        lastName: {
                            contains: id,
                            mode: 'insensitive',
                        },
                    },
                    {
                        id: +id,
                    },
                ],
            },
            select: {
                password: false,
                id: true,
                avatar: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                isBanned: true,
                homeworks: true,
                questions: true,
            },
        });

        if (!user) throw new NotFoundException(`User not found`);

        return user;
    }

    async updateProfile(id: string, idCurrentUser: number, dto: updateDto) {
        if (Number(id) !== idCurrentUser)
            throw new BadRequestException('You cannot update this user');

        const user = await this.user.findFirst({
            where: { id: +id },
        });

        if (!user) throw new NotFoundException(`User not found`);

        return await this.user.update({
            where: {
                id: +id,
            },
            data: {
                ...dto,
            },
        });
    }

    async toggleBan(id: string, isBanned: boolean) {
        const user = await this.user.findFirst({
            where: { id: +id },
        });

        if (!user) throw new NotFoundException(`User not found`);

        await this.user.update({
            where: { id: +id },
            data: {
                isBanned,
            },
        });

        return `User ${user.lastName} ${user.firstName} is ${isBanned ? 'banned' : 'unbanned'}`;
    }
}
