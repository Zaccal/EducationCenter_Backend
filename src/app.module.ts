import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AnswerModule } from './answer/answer.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CountModule } from './count/count.module';
import { HomeworkModule } from './homework/homework.module';
import { LessonModule } from './lesson/lesson.module';
import { PaginationModule } from './pagination/pagination.module';
import { QuestionModule } from './question/question.module';
import { TopicModule } from './topic/topic.module';
import { UserModule } from './user/user.module';
import { VideoStatiscticsModule } from './video-statisctics/video-statisctics.module';

@Module({
    imports: [
        AuthModule,
        LessonModule,
        PaginationModule,
        UserModule,
        HomeworkModule,
        QuestionModule,
        AnswerModule,
        TopicModule,
        CountModule,
        VideoStatiscticsModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
