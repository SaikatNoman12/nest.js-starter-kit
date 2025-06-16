import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  const port = process.env.PORT;
  const mode = process.env.ENV_MODE;
  await app.listen(port ?? 3000);
  console.log(
    `Application is running on
    \nmode: ${mode}
    \nport: ${port} 
    `,
  );
}
bootstrap();
