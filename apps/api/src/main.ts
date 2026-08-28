import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (!process.env.ALLOWED_ORIGINS) {
    throw new Error(
      'ALLOWED_ORIGINS não está definido. Configure a variável de ambiente ' +
        '(ex: ALLOWED_ORIGINS=http://localhost:3000) antes de iniciar a API.',
    );
  }
  const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',').map((o) =>
    o.trim(),
  );

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
    credentials: true,
  });

  app.use(cookieParser());

  // Habilita validação automática dos DTOs com class-validator
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

  // Prefixo global das rotas da API
  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? 3333;
  await app.listen(port);
  console.log(`🚀 API rodando em http://localhost:${port}/api`);
}
bootstrap();