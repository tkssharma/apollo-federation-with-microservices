// Package.
import { ModuleMetadata, Type } from "@nestjs/common";

// Code.
export interface S3ClientModuleOptions {
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
}

export interface S3ClientModuleFactory {
  createPlatformModuleOptions: () =>
    | Promise<S3ClientModuleOptions>
    | S3ClientModuleOptions;
}

export interface S3ClientModuleAsyncOptions
  extends Pick<ModuleMetadata, "imports"> {
  inject?: any[];
  useClass?: Type<S3ClientModuleFactory>;
  useExisting?: Type<S3ClientModuleFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<S3ClientModuleOptions> | S3ClientModuleOptions;
}
