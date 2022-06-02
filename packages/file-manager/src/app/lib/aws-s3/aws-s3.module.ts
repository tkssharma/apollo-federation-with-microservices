// Package.
import { ConfigModule } from "@app/config/config.module";
import { Global, Module } from "@nestjs/common";

// Internal.
import AWSS3Service from "./aws-s3.service";

// Code.
@Global()
@Module({
  imports: [ConfigModule],
  providers: [AWSS3Service],
  exports: [AWSS3Service],
})
export class AWSS3Module { }
