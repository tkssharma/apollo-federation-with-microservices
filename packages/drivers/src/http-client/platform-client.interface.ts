// Package.
import { ModuleMetadata, Type } from "@nestjs/common";

// Code.
export interface PlatformClientModuleOptions {
  apiUrl: string;
  apiKey: string;
}

export interface PlatformClientModuleFactory {
  createPlatformModuleOptions: () =>
    | Promise<PlatformClientModuleOptions>
    | PlatformClientModuleOptions;
}

export interface PlatformClientModuleAsyncOptions
  extends Pick<ModuleMetadata, "imports"> {
  inject?: any[];
  useClass?: Type<PlatformClientModuleFactory>;
  useExisting?: Type<PlatformClientModuleFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<PlatformClientModuleOptions> | PlatformClientModuleOptions;
}
