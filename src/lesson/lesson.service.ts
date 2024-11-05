import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationService } from 'src/pagination/pagination.service';
import { PrismaService } from 'src/prisma.service';
import { CreateDto } from './dto/create.dto';
import { EnumSort, getAllDto } from './dto/getAll.dto';
import { patchDto } from './dto/patch.dto';

@Injectable()
export class LessonService {
    constructor(
        private prisma: PrismaService,
        private pagination: PaginationService,
    ) {}

    private lessons = this.prisma.lesson;

    async getAll(dto: getAllDto) {
        const { searchTerm, sort } = dto;

        const searchInput: Prisma.LessonWhereInput = {
            OR: [
                {
                    title: {
                        contains: searchTerm || '',
                        mode: 'insensitive',
                    },
                },
                {
                    url: {
                        contains: searchTerm || '',
                        mode: 'insensitive',
                    },
                },
            ],
        };

        const orderInput: Prisma.LessonOrderByWithRelationInput[] = [];

        if (sort === EnumSort.DATE_HIGHIEST) {
            orderInput.push({
                createdAt: 'asc',
            });
        } else if (sort === EnumSort.DATE_LOWIEST) {
            orderInput.push({
                createdAt: 'desc',
            });
        } else if (sort === EnumSort.ALPHABETICAL_HIGHIEST) {
            orderInput.push({
                title: 'asc',
            });
        } else if (sort === EnumSort.ALPHABETICAL_LOWIEST) {
            orderInput.push({
                title: 'desc',
            });
        }

        const { perPage, skip } = this.pagination.getPagination(dto);

        return await this.lessons.findMany({
            where: searchInput,
            orderBy: orderInput,
            skip,
            take: perPage,
            include: {
                questions: {
                    include: {
                        answers: true,
                    },
                },
                topic: {
                    select: {
                        id: true,
                    },
                },
            },
        });
    }

    async getById(id: string) {
        const lesson = await this.lessons.findFirst({
            where: {
                id: +id,
            },
            include: {
                homeworks: true,
                questions: {
                    include: {
                        answers: true,
                    },
                },
            },
        });

        if (!lesson) throw new NotFoundException('Lesson not found');

        return lesson;
    }

    async createLesson(dto: CreateDto) {
        return await this.lessons.create({
            data: {
                ...dto,
            },
        });
    }

    async patchLesson(dto: patchDto, id: string) {
        const lesson = await this.lessons.findFirst({
            where: {
                id: +id,
            },
        });

        if (!lesson) throw new NotFoundException('Lesson not found');

        return await this.lessons.update({
            where: {
                id: +id,
            },
            data: {
                ...dto,
            },
        });
    }

    async delete(id: string) {
        const lesson = await this.lessons.findFirst({
            where: {
                id: +id,
            },
        });

        if (!lesson) throw new NotFoundException('Lesson not found');

        return await this.lessons.delete({
            where: {
                id: +id,
            },
        });
    }

    async getCountOfLesson() {
        return await this.lessons.count();
    }
}
