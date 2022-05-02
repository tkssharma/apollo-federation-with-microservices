import { ConfigModule } from '@config/config.module';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AzureModule } from '@app/blob/azure.module';
import { KafkaModule } from '@kafka/kafka.module';
import { AppLoggerModule } from '@logger/logger.module';
import { HttpClientModule } from '../../http/http.module';
import ContractHelperService from './home-helper.service';
import { ContractUploadController } from './home-upload.controller';
import ContractUploadService from './home-upload.service';
import { ContractController } from './home.controller';
import Contract from './home.entity';
import ContractService from './home.service';
import EventsService from './events/events.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contract]),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    HttpClientModule,
    KafkaModule,
    ConfigModule,
    AppLoggerModule,
    AzureModule
  ],
  controllers: [
    ContractController,
    ContractUploadController
  ],
  providers: [
    ContractService,
    EventsService,
    ContractHelperService,
    ContractUploadService
  ],
  exports: [
    ContractService,
    EventsService,
    ContractHelperService,
    ContractUploadService
  ],
})
export class ContractModule {
}
