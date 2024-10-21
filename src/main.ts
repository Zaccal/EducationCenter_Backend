import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import { AppModule } from './app.module';

config();

const PORT = process.env.PORT || 5200;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        credentials: true,
        origin: [
            'http://127.0.0.1:5173',
            'http://127.0.0.1:5000',
            'http://localhost:5173',
            'http://localhost:5000',
            'http://client:5000',
            'http://client',
        ],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    });
    app.setGlobalPrefix('api');

    app.use(cookieParser());

    // Swagger documentation
    const config = new DocumentBuilder()
        .setTitle('EducationCenter API')
        .setDescription('EducationCenter API Documentation')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    await app.listen(PORT);

    // eslint-disable-next-line no-console
    console.log(`http://localhost:${PORT}`);
}
bootstrap();
