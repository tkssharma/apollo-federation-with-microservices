// Package.
import { ModuleMetadata, Type } from "@nestjs/common";

// Code.
export interface AzureBlobModuleOptions {
  connectionString: string;
}

export interface AzureBlobOptionsFactory {
  createAzureBlobOptions: () =>
    | Promise<AzureBlobModuleOptions>
    | AzureBlobModuleOptions;
}

export interface AzureBlobModuleAsyncOptions
  extends Pick<ModuleMetadata, "imports"> {
  inject?: any[];
  useClass?: Type<AzureBlobOptionsFactory>;
  useExisting?: Type<AzureBlobOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<AzureBlobModuleOptions> | AzureBlobModuleOptions;
}
