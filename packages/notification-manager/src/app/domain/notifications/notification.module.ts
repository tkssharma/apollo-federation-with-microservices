import { Module } from '@nestjs/common';
import { ConfigModule } from '@config/config.module';
import { AppLoggerModule } from '@logging/logger/logger.module';
import NotificationDaoService from './notification.dao.service';
import NotificationService from './notification.service';
import { NotificationController } from './notification.controller';
import { EventEmitterModule } from '@nestjs/event-emitter';
import NotificationEventHandlerService from './notification.handler';
import NotificationHandlerService from './notification.handler';
import { SendgridNotificationModule } from '@app/sendgrid/sendgrid.module';

@Module({
  imports: [
    ConfigModule,
    AppLoggerModule,
    EventEmitterModule.forRoot(),
    SendgridNotificationModule
  ],
  controllers: [NotificationController],
  exports: [NotificationDaoService, NotificationService, NotificationHandlerService],
  providers: [NotificationDaoService, NotificationService, NotificationHandlerService],
})
export class NotificationModule { }
