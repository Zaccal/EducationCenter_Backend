import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/decarators/auth.decarator';
import { CurrentUser } from 'src/decarators/user.decarator';
import { getAllDto } from './dto/getAll.dto';
import { HomeworkDto } from './dto/homework.dto';
import { HomeworkService } from './homework.service';

@Controller('homework')
export class HomeworkController {
    constructor(private readonly homeworkService: HomeworkService) {}

    @Get()
    @Auth()
    @UsePipes(new ValidationPipe())
    async getHomeworks(@Query() dto: getAllDto) {
        return await this.homeworkService.getHomeworks(dto);
    }

    @Post('/:lessonId')
    @Auth()
    @UsePipes(new ValidationPipe())
    async submitionHomework(
        @Body() dto: HomeworkDto,
        @CurrentUser('id') userId: number,
        @Param('lessonId') lessonId: string,
    ) {
        return await this.homeworkService.submitHomework(dto, userId, lessonId);
    }

    @Put('/:homeworkId')
    @Auth()
    @UsePipes(new ValidationPipe())
    async updateHomework(
        @Body() dto: HomeworkDto,
        @Param('homeworkId') homeworkId: string,
        @CurrentUser('id') userId: number,
    ) {
        return await this.homeworkService.updateHomework(
            dto,
            homeworkId,
            userId,
        );
    }

    @Delete('/:homeworkId')
    @Auth()
    async deleteHomework(
        @Param('homeworkId') homeworkId: string,
        @CurrentUser('id') userId: number,
    ) {
        return await this.homeworkService.deleteHomework(homeworkId, userId);
    }
}
