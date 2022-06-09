import { ExternalRoutes } from '@app/core/middleware/routes';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { TerminusModule } from '@nestjs/terminus';
import { LoggerModule } from 'nestjs-rollbar';
import { AuthModule } from '../../auth/auth.module';
import { ConfigModule } from '../../config/config.module';
import { AppLoggerModule } from '../../logging/logger/logger.module';
import { DbModule } from '../../storage/database/db/db.module';
import { HealthController } from '../controllers/app.controller';
import { AuthMiddleware } from '../core/middleware/auth-middleware';
import { ConvertPayloadJSONObjectToString } from '../core/middleware/convert-payload-middleware';
import { ConfigService } from '../../config/config.service';
import { NotificationModule } from './notifications/notification.module';
import { SendgridNotificationModule } from '../../app/sendgrid/sendgrid.module';

@Module({
  imports: [
    AppLoggerModule,
    EventEmitterModule.forRoot(),
    LoggerModule.forRoot({
      accessToken: process.env.ROLLBAR_TOKEN,
      environment: process.env.NODE_ENV,
    }),
    ScheduleModule.forRoot(),
    ConfigModule,
    TerminusModule,
    AuthModule,
    DbModule.forRoot(),
    NotificationModule,
    SendgridNotificationModule,
  ],
  controllers: [
    HealthController,
  ],
  providers: [],
  exports: [],
})
export class DomainModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {

    consumer
      .apply(AuthMiddleware, ConvertPayloadJSONObjectToString)
      .exclude(...ExternalRoutes)
      .forRoutes({ path: '/api/*', method: RequestMethod.ALL });

  }
}
