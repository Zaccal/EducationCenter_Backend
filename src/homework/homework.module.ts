import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma.service';
import { HomeworkController } from './homework.controller';
import { HomeworkService } from './homework.service';

@Module({
    controllers: [HomeworkController],
    providers: [HomeworkService, PrismaService, JwtService],
    imports: [AuthModule],
})
export class HomeworkModule {}
