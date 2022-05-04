// Internal.
import { S3ClientModuleOptions } from "./aws-s3.interface";
import { S3ClientService } from "./aws-s3.service";

// Code.
export const getS3ClientModuleOptions = (
  options: S3ClientModuleOptions
): S3ClientService => new S3ClientService(options);
