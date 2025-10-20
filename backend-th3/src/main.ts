import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { corsConfig } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(corsConfig);
  await app.listen(Number(process.env.PORT), '0.0.0.0');
  console.log("Server is running on: http://localhost:" + process.env.PORT);

}
bootstrap();
