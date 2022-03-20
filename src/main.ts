import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { TimeoutInterceptor } from './interceptors';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.use(helmet());
  app.use(rateLimit({ windowMs: 60, max: 50 }));

  app.useGlobalInterceptors(new TimeoutInterceptor());

  app.setGlobalPrefix(config.get('app.prefix'));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      // skipMissingProperties: true,
      forbidUnknownValues: true,
      // validationError: { target: false },
      errorHttpStatusCode: 422,
    }),
  );

  const port = config.get('app.port');
  await app.listen(port);
  console.log(`App started on port: ${port}`);
}

bootstrap();
