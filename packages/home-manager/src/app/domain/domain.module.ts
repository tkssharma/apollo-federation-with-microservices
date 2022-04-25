import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TerminusModule } from '@nestjs/terminus';
import { ConfigModule } from '@config/config.module';
import { DbModule } from '@db/db.module';
import { HttpClientModule } from '../http/http.module';
import { AppLoggerModule } from '@logger/logger.module';
import { AuthModule } from '../auth/auth.module';
import { AuthMiddleware } from '../auth/middleware/auth-middleware';
import { HealthController } from '../controllers/app.controller';


@Module({
  imports: [
    DbModule.forRoot(
      {
        entities:
          []
      }),
    EventEmitterModule.forRoot(),
    HttpClientModule,
    ConfigModule,
    TerminusModule,
    AppLoggerModule,
    AuthModule
  ],
  controllers: [
    HealthController,
  ],
  providers: [],
  exports: [],
})
export class DomainModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude('/api/v1/health').forRoutes('*');
  }
}
