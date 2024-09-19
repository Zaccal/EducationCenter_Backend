import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { EnumRole } from '@prisma/client';
import { Auth } from 'src/decarators/auth.decarator';
import { Role } from 'src/decarators/role.decarator';
import { setRole } from 'src/decarators/setRole.decarator';
import { CreateDto } from './dto/create.dto';
import { getAllDto } from './dto/getAll.dto';
import { patchDto } from './dto/patch.dto';
import { LessonService } from './lesson.service';

@Controller('lesson')
export class LessonController {
    constructor(private readonly lessonService: LessonService) {}

    @Get()
    @Auth()
    async getLesson(@Query() dto: getAllDto) {
        return await this.lessonService.getAll(dto);
    }

    @Get('/:id')
    @Auth()
    async getLessonById(@Param('id') id: string) {
        return await this.lessonService.getById(id);
    }

    @Post()
    @Role()
    @setRole(EnumRole.ADMIN)
    async create(@Body() dto: CreateDto) {
        return await this.lessonService.createLesson(dto);
    }

    @Patch('/:id')
    @Role()
    @setRole(EnumRole.ADMIN)
    async update(@Body() dto: patchDto, @Param('id') id: string) {
        return await this.lessonService.patchLesson(dto, id);
    }

    @Delete('/:id')
    @Role()
    @setRole(EnumRole.ADMIN)
    async delete(@Param('id') id: string) {
        return await this.lessonService.delete(id);
    }
}
