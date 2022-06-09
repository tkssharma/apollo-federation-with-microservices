// Package.
import { ConfigModule } from "@config/config.module";
import { ConfigService } from "@config/config.service";
import { Global, Module } from "@nestjs/common";
// Internal.
import { SendgridService } from "./sendgrid.service";

// Code.

@Module({
  imports: [ConfigModule],
  providers: [SendgridService],
  exports: [SendgridService],
})
export class SendgridNotificationModule { }
