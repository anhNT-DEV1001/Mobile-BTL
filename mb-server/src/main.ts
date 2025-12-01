import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { corsConfig, swaggerConfig, validationConfig } from './config';
import { AllExceptionsFilter } from './common/filter';
import { API_PRIFIX } from './common/api';
import { SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve static files
  app.useStaticAssets(join(__dirname, '..', 'assets'), {
    prefix: '/assets/',
  });

  app.setGlobalPrefix(API_PRIFIX);
  app.enableCors(corsConfig);
  app.useGlobalPipes(new ValidationPipe(validationConfig));
  app.useGlobalFilters(new AllExceptionsFilter);

  const swaggerDoc = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(API_PRIFIX, app, swaggerDoc);

  await app.listen(Number(process.env.PORT), '0.0.0.0');
  console.log("Server is running on: http://localhost:" + process.env.PORT);
  console.log(`API documents: http://localhost:${process.env.PORT + API_PRIFIX}`);
}
bootstrap();
