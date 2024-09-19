import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { PaginationService } from 'src/pagination/pagination.service';
import { PrismaService } from 'src/prisma.service';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';

@Module({
    controllers: [LessonController],
    providers: [LessonService, PrismaService, PaginationService, JwtService],
    imports: [AuthModule],
})
export class LessonModule {}
