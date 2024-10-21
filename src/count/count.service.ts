import { Injectable } from '@nestjs/common';
import { HomeworkService } from 'src/homework/homework.service';
import { LessonService } from 'src/lesson/lesson.service';
import { QuestionService } from 'src/question/question.service';
import { TopicService } from 'src/topic/topic.service';
import { EnumCountGetObject } from './dto/countGet.dto';

@Injectable()
export class CountService {
    constructor(
        // private prisma: PrismaService,
        private homework: HomeworkService,
        private lesson: LessonService,
        private question: QuestionService,
        private topic: TopicService,
    ) {}

    async getCount(dto: EnumCountGetObject) {
        switch (dto) {
            case EnumCountGetObject.homework:
                return await this.homework.getCountOfHomework();
            case EnumCountGetObject.lesson:
                return await this.lesson.getCountOfLesson();
            case EnumCountGetObject.question:
                return await this.question.getCountOfQuestion();
            case EnumCountGetObject.topic:
                return await this.topic.getCountOfTopic();
        }
    }
}
