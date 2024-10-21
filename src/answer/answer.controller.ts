import {
    Body,
    Controller,
    Delete,
    Param,
    Patch,
    Post,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/decarators/auth.decarator';
import { CurrentUser } from 'src/decarators/user.decarator';
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';

@Controller('answer')
export class AnswerController {
    constructor(private readonly answerService: AnswerService) {}

    @Post('/:questionId')
    @Auth()
    @UsePipes(new ValidationPipe())
    create(
        @Body() dto: CreateAnswerDto,
        @Param('questionId') questionId: string,
        @CurrentUser('id') userId: number,
    ) {
        return this.answerService.create(dto, questionId, userId);
    }

    @Patch('/:answerId')
    @UsePipes(new ValidationPipe())
    update(@Param('answerId') answerId: string, @Body() dto: UpdateAnswerDto) {
        return this.answerService.update(answerId, dto);
    }

    @Delete(':questionId')
    @UsePipes(new ValidationPipe())
    remove(@Param('questionId') questionId: string) {
        return this.answerService.remove(questionId);
    }
}
