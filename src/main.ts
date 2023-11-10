import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './config/env';
import { json, urlencoded } from 'express';
import { ValidationPipe } from '@nestjs/common';
import { AppDataSource } from './database/data-source';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(json({ limit: '70mb' }));
  app.use(urlencoded({ extended: true, limit: '70mb' }));
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      validationError: { target: true, value: true },
      forbidUnknownValues: false,
    }),
  );

  AppDataSource.initialize()
    .then(() => {
      console.log('Database connected');
    })
    .catch((error) => console.log(error));

  const options = new DocumentBuilder()
    .setTitle('TD Now API')
    .setDescription('API documentation for TD Now')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      docExpansion: 'none',
    },
  });

  const port = PORT || 3000;

  await app.listen(port);

  console.log(`Listening on ${port}`);
}
bootstrap();
