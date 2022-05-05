require("module-alias/register");
require('dotenv').config();
import { NestApplicationOptions } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as helmet from 'helmet';
import { AppModule } from './app/app.module';
import { HttpExceptionFilter } from './app/core/interceptor/app.interceptor';
import { Logger } from './logger/logger';
const LISTEN_PORT = 3005;


const NEST_LOGGING = true;
async function bootstrap() {
  const opts: NestApplicationOptions = {};
  if (!NEST_LOGGING) { opts.logger = false; }
  const app = await NestFactory.create<NestExpressApplication>(AppModule, opts);
  app.disable('x-powered-by');
  app.useLogger(app.get(Logger));
  app.useGlobalFilters(new HttpExceptionFilter(app.get(Logger)));
  app.enableCors({
    exposedHeaders: 'X-Document-Name',
  });
  app.use(helmet());
  app.use(helmet.noSniff());
  app.use(helmet.hidePoweredBy());
  app.use(helmet.contentSecurityPolicy());
  await app.listen(process.env.PORT || LISTEN_PORT);
}
bootstrap();
