import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { HomeworkService } from 'src/homework/homework.service';
import { LessonService } from 'src/lesson/lesson.service';
import { PaginationService } from 'src/pagination/pagination.service';
import { PrismaService } from 'src/prisma.service';
import { QuestionService } from 'src/question/question.service';
import { TopicService } from 'src/topic/topic.service';
import { VideoStatiscticsService } from 'src/video-statisctics/video-statisctics.service';
import { CountController } from './count.controller';
import { CountService } from './count.service';

@Module({
    controllers: [CountController],
    providers: [
        PrismaService,
        CountService,
        HomeworkService,
        LessonService,
        QuestionService,
        TopicService,
        PaginationService,
        VideoStatiscticsService,
        JwtService,
    ],
    imports: [AuthModule, HttpModule],
})
export class CountModule {}
