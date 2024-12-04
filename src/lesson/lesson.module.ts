import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { PaginationService } from 'src/pagination/pagination.service';
import { PrismaService } from 'src/prisma.service';
import { VideoStatiscticsService } from 'src/video-statisctics/video-statisctics.service';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';

@Module({
    controllers: [LessonController],
    providers: [
        LessonService,
        VideoStatiscticsService,
        PrismaService,
        PaginationService,
        JwtService,
    ],
    imports: [AuthModule, HttpModule],
})
export class LessonModule {}
