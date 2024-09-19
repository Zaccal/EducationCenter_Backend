import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';

@Injectable()
export class AnswerService {
    constructor(private prisma: PrismaService) {}

    private answer = this.prisma.answer;

    async create(dto: CreateAnswerDto, questionId: string, userId: number) {
        return await this.answer.create({
            data: {
                ...dto,
                user: {
                    connect: {
                        id: userId,
                    },
                },
                question: {
                    connect: {
                        id: +questionId,
                    },
                },
            },
        });
    }

    async update(id: string, dto: UpdateAnswerDto) {
        const answer = await this.answer.findFirst({
            where: { id: +id },
        });

        if (!answer) throw new NotFoundException('This answer not found');

        return await this.answer.update({
            where: {
                id: +id,
            },
            data: {
                ...dto,
            },
        });
    }

    async remove(questionId: string) {
        return await this.answer.delete({
            where: {
                id: +questionId,
            },
        });
    }
}
