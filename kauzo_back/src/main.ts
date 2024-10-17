import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './config/envs';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CategoriesSeed } from './modules/category/categories.seed';

require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe());

  const categoriesSeed = app.get(CategoriesSeed);
  await categoriesSeed.seed()

  const options = new DocumentBuilder()
    .setTitle('Kazuo')
    .setDescription('Proyecto Integrador')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(`${PORT}`);
}
bootstrap();
