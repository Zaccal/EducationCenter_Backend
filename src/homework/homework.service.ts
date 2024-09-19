import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as dayjs from 'dayjs';
import { PrismaService } from 'src/prisma.service';
import { EnumSort, getAllDto } from './dto/getAll.dto';
import { HomeworkDto } from './dto/homework.dto';

@Injectable()
export class HomeworkService {
    constructor(private prisma: PrismaService) {}
    private homework = this.prisma.homework;

    async getHomeworks(dto: getAllDto) {
        const { estimation, searchTerm, status, sort } = dto;

        const searchInput: Prisma.HomeworkWhereInput = {
            OR: [
                {
                    url: {
                        contains: searchTerm || '',
                        mode: 'insensitive',
                    },
                },
                {
                    status: {
                        equals: status,
                    },
                },
                {
                    estimation: {
                        equals: estimation,
                    },
                },
            ],
        };

        const sortInput: Prisma.HomeworkOrderByWithRelationInput[] = [];

        if (sort === EnumSort.NEWEST)
            sortInput.push({
                createdAt: 'asc',
            });
        else if (sort === EnumSort.OLDEST)
            sortInput.push({
                createdAt: 'desc',
            });

        return await this.homework.findMany({
            where: searchInput,
            orderBy: sortInput,
        });
    }

    async submitHomework(dto: HomeworkDto, userId: number, lessonId: string) {
        return await this.homework.create({
            data: {
                ...dto,
                lesson: {
                    connect: {
                        id: +lessonId,
                    },
                },
                user: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });
    }

    async updateHomework(dto: HomeworkDto, homeworkId: string, userId: number) {
        const homework = await this.homework.findFirst({
            where: {
                id: +homeworkId,
            },
        });

        if (!homework) throw new NotFoundException('Homework not found');

        if (homework.userId !== userId)
            throw new BadRequestException('You cannot update this homework');

        const oneWeekAgo = dayjs().subtract(7, 'days');
        if (dayjs(homework.createdAt).isBefore(oneWeekAgo))
            throw new BadRequestException(
                'You cannot update this becasue more than a week has passed since the creation',
            );

        return await this.homework.update({
            where: {
                id: +homeworkId,
            },
            data: {
                ...dto,
            },
        });
    }

    async deleteHomework(homeworkId: string, userId: number) {
        const homework = await this.homework.findFirst({
            where: {
                id: +homeworkId,
            },
        });

        if (!homework) throw new NotFoundException('Homework not found');

        if (homework.userId !== userId)
            throw new BadRequestException('You cannot update this homework');

        const oneWeekAgo = dayjs().subtract(7, 'days');
        if (dayjs(homework.createdAt).isBefore(oneWeekAgo))
            throw new BadRequestException(
                'You cannot update this becasue more than a week has passed since the creation',
            );

        return await this.homework.delete({
            where: {
                id: +homeworkId,
            },
        });
    }
}
