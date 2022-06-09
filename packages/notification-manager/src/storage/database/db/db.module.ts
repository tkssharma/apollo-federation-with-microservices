import { DynamicModule, Module } from '@nestjs/common';
import { KnexModule, KnexModuleOptions } from 'nest-knexjs';
import { ConfigModule } from '@config/config.module';
import { ConfigService } from '@config/config.service';
import { Logger } from '@logging/logger/logger';
import { AppLoggerModule } from '@logging/logger/logger.module';
import knexConfig from '../../../../knexfile'
@Module({})
export class DbModule {
  private static getConnectionOptions(
    config: ConfigService
  ): KnexModuleOptions {
    const configOptions = knexConfig;
    return {
      name: process.env.NODE_ENV || 'develop',
      config: configOptions,
      retryAttempts: 4,
      retryDelay: 20000
    };
  }

  public static forRoot(): DynamicModule {
    return {
      module: DbModule,
      imports: [
        KnexModule.forRootAsync({
          imports: [ConfigModule, AppLoggerModule],
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          useFactory: (configService: ConfigService, logger: Logger) =>
            DbModule.getConnectionOptions(configService),
          inject: [ConfigService],
        }),
      ],
      controllers: [],
      providers: [],
      exports: [],
    };
  }
}
