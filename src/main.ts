import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { envConfigService } from './config/env.config';

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

  app.enableCors({
    origin: envConfigService.getOrigins(),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type',
  });

  app.use(cookieParser());

  if (mode !== 'PRODUCTION') {
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('NEST KIT API')
        .setDescription('NEST KIT API')
        .build(),
    );
    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(port ?? 3000);
  console.log(
    `Application is running on
    \nmode: ${mode}
    \nport: ${port} 
    `,
  );
}
bootstrap();
