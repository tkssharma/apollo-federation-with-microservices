// Package.
import { Global, Module } from "@nestjs/common";

// Internal.
import { Logger } from "./logger.service";

// Code.
@Global()
@Module({
  providers: [Logger],
  exports: [Logger],
})
export class LoggerModule {}
