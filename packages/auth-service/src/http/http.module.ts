
import { HttpModule, Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule } from "src/config/config.module";
import { ConfigService } from "src/config/config.service";
import { LoggerModule } from "src/logger/logger.module";

import HttpClientService from "./http.service";

@Module({
  imports: [
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
