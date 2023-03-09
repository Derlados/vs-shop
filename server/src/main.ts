import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

const PORT = process.env.PORT || 5000;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true
        }),
    );

    const config = new DocumentBuilder()
        .setTitle('VS-SHOP API DOCS')
        .setDescription('The vs-shop API description')
        .setVersion('1.0')
        .addTag('vs-shop')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    await app.listen(PORT);
}
bootstrap();
