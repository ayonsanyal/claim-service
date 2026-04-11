import 'reflect-metadata';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import { LoggingInterceptor } from 'src/common/logging/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new LoggingInterceptor());
  //Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  //  Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Claim Service API')
    .setDescription('API for managing claims')
    .setVersion('1.0')
    .addTag('claims')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      package: 'claims',
      protoPath: join(__dirname, './claims/claims.proto'),
      url: '0.0.0.0:50051',
    },
  });

  await app.listen(3000);
}

bootstrap();
