import { Module } from '@nestjs/common';
import { ConfigModule } from '@config/config.module';
import { AppLoggerModule } from '@logger/logger.module';
import HttpClientService from './http.service';

@Module({
  imports: [ConfigModule, AppLoggerModule],
  exports: [HttpClientService],
  providers: [HttpClientService],
})
export class HttpClientModule { }
