import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CategoriesSeed } from './modules/category/categories.seed';
import * as bodyParser from 'body-parser';
import * as express from 'express';


require('dotenv').config();

async function bootstrap() {
  console.log('Current working directory:', process.cwd());
  const app = await NestFactory.create(AppModule);
<<<<<<< HEAD
<<<<<<< HEAD:src/main.ts
  //app.use(bodyParser.raw({ type: 'application/json' }));
=======
  // app.use(bodyParser.raw({ type: 'application/json' }));
>>>>>>> aec6877a5307a6ec76a5137b38134bf76f8597a9:kazuo_back/src/main.ts
=======
  app.use('/stripe/webhook', express.raw({ type: 'application/json' }));

>>>>>>> f62050cd9197182d4dc044a70cb80b4b23c36564

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const categoriesSeed = app.get(CategoriesSeed);
  await categoriesSeed.seed();

  app.enableCors();

  const options = new DocumentBuilder()
    .setTitle('Kazuo')
    .setDescription('Proyecto Integrador')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  const PORT = process.env.PORT;

  await app.listen(PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);

  app.use('/stripe/webhook', bodyParser.raw({ type: 'application/json' }));
}
bootstrap();



