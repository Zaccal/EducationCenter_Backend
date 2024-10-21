import {
    Body,
    Controller,
    Delete,
    Param,
    Post,
    Put,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/decarators/auth.decarator';
import { CurrentUser } from 'src/decarators/user.decarator';
import { createDto } from './dto/create.dto';
import { QuestionService } from './question.service';

@Controller('question')
export class QuestionController {
    constructor(private readonly questionService: QuestionService) {}

    @Post('/:lessonId')
    @UsePipes(new ValidationPipe())
    @Auth()
    async createQuestion(
        @CurrentUser('id') id: number,
        @Body() dto: createDto,
        @Param('lessonId') lessonId: string,
    ) {
        return await this.questionService.createQuestion(dto, id, lessonId);
    }

    @Put('/:lessonId')
    @Auth()
    @UsePipes(new ValidationPipe())
    async updateQuestion(
        @Body() dto: createDto,
        @CurrentUser('id') id: number,
        @Param('lessonId') lessonId: string,
    ) {
        return await this.questionService.updateQuestion(dto, id, lessonId);
    }

    @Delete(':lessonId')
    @Auth()
    async deleteQuestion(@Param('lessonId') id: string) {
        return await this.questionService.deleteQuestion(id);
    }
}
