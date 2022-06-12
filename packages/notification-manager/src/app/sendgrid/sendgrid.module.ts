// Package.
import { ConfigModule } from "@config/config.module";
import { ConfigService } from "@config/config.service";
import { AppLoggerModule } from "@logging/logger/logger.module";
import { Global, Module } from "@nestjs/common";
// Internal.
import { SendgridService } from "./sendgrid.service";

// Code.

@Module({
  imports: [ConfigModule, AppLoggerModule],
  providers: [SendgridService],
  exports: [SendgridService],
})
export class SendgridNotificationModule { }
