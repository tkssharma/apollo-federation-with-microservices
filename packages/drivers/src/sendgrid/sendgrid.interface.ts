// Package.
import { ModuleMetadata, Type } from "@nestjs/common";

// Code.
export interface SendgridClientModuleOptions {
  sendgrid_token: string;
}

export interface SendgridClientModuleFactory {
  createPlatformModuleOptions: () =>
    | Promise<SendgridClientModuleOptions>
    | SendgridClientModuleOptions;
}

export interface SendgridClientModuleAsyncOptions
  extends Pick<ModuleMetadata, "imports"> {
  inject?: any[];
  useClass?: Type<SendgridClientModuleFactory>;
  useExisting?: Type<SendgridClientModuleFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<SendgridClientModuleOptions> | SendgridClientModuleOptions;
}
