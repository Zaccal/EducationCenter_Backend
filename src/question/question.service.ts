import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { createDto } from './dto/create.dto';

@Injectable()
export class QuestionService {
    constructor(private prisma: PrismaService) {}

    private question = this.prisma.question;

    async createQuestion(dto: createDto, userId: number, lessonId: string) {
        return await this.question.create({
            data: {
                ...dto,
                user: {
                    connect: {
                        id: userId,
                    },
                },
                lesson: {
                    connect: {
                        id: +lessonId,
                    },
                },
            },
        });
    }

    async updateQuestion(dto: createDto, userId: number, lessonId: string) {
        const question = await this.question.findFirst({
            where: {
                id: +lessonId,
            },
        });

        if (!question) throw new NotFoundException('Question not found');

        if (question.userId !== userId)
            throw new BadRequestException('You cannot chnage this question');

        return await this.question.update({
            where: {
                id: +lessonId,
            },
            data: {
                ...dto,
            },
        });
    }

    async deleteQuestion(id: string) {
        const question = await this.question.findFirst({
            where: {
                id: +id,
            },
        });

        if (!question) throw new NotFoundException(`Question ${id} not found`);

        await this.prisma.answer.deleteMany({
            where: {
                questionId: question.id,
            },
        });

        return await this.question.delete({
            where: {
                id: +id,
            },
        });
    }
}
