
import { HttpModule, Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "../config/config.module";
import { ConfigService } from "../config/config.service";
import { LoggerModule } from "../logger/logger.module";

import HttpClientService from "./http.service";

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: Number(50000),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [
    HttpClientService,
  ],
  exports: [HttpClientService],
})
export class HttpProxyModule { }
