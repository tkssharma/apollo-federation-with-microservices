require("module-alias/register");
require('dotenv').config();
import { NestApplicationOptions } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as helmet from 'helmet';
import { AppModule } from './app/app.module';
import { HttpExceptionFilter } from './app/core/filter/exception.filter';
import { createDocument } from './docs/swagger/swagger';
import { Logger } from './logging/logger/logger';
const LISTEN_PORT = 3010;
const NEST_LOGGING = true;
async function bootstrap() {
  const opts: NestApplicationOptions = {};
  if (!NEST_LOGGING) { opts.logger = false; }
  const app = await NestFactory.create<NestExpressApplication>(AppModule, opts);
  app.disable('x-powered-by');
  // sometimes to get better view for runtime error disable custom logger
  app.useLogger(app.get(Logger));
  app.useGlobalFilters(new HttpExceptionFilter(app.get(Logger)));
  app.use(helmet());
  app.use(helmet.noSniff());
  app.use(helmet.hidePoweredBy());
  app.use(helmet.contentSecurityPolicy());
  createDocument(app);
  await app.listen(process.env.PORT || LISTEN_PORT, () => {
    console.log(`app started on port ${process.env.PORT || LISTEN_PORT}`)
  });
}
bootstrap();
