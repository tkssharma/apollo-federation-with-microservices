require("module-alias/register");
require('dotenv').config();
import { NestApplicationOptions } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { graphqlUploadExpress } from 'graphql-upload';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app/app.module';

import { HttpExceptionFilter } from './app/core/interceptor/app.interceptor';
import { Logger } from './logger/logger';
const LISTEN_PORT = 3009;


const NEST_LOGGING = true;
async function bootstrap() {
  const opts: NestApplicationOptions = {};
  if (!NEST_LOGGING) { opts.logger = false; }

  const app = await NestFactory.create<NestExpressApplication>(AppModule, opts);
  app.use(graphqlUploadExpress({ maxFileSize: 2 * 1000 * 1000 }));
  await app.listen(process.env.PORT || LISTEN_PORT);
}
bootstrap();
