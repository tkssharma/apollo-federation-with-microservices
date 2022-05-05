// Package.
import { Provider } from "@nestjs/common";

// Internal.
import { S3_CLIENT_TOKEN } from "./aws-s3.constants";
import { S3ClientModuleOptions } from "./aws-s3.interface";
import { getS3ClientModuleOptions } from "./utils";

// Code.
export function createS3ClientProvider(
  options: S3ClientModuleOptions
): Provider {
  return {
    provide: S3_CLIENT_TOKEN,
    useValue: getS3ClientModuleOptions(options),
  };
}
