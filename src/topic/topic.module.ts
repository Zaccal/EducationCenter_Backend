import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { PaginationService } from 'src/pagination/pagination.service';
import { PrismaService } from 'src/prisma.service';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';

@Module({
    controllers: [TopicController],
    providers: [TopicService, PrismaService, PaginationService, JwtService],
    imports: [AuthModule],
})
export class TopicModule {}
