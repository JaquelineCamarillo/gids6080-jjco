import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //pipe para realizar la validacion de forma global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, //elimina las propiedades que no estan definidas en el DTO
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
