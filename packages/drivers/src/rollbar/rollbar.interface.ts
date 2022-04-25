// Package.
import { ModuleMetadata, Type } from "@nestjs/common";
import { Configuration } from "rollbar";

// Code.
export type RollbarModuleOptions = Configuration;

export interface RollbarOptionsFactory {
  createRollbarOptions: () =>
    | Promise<RollbarModuleOptions>
    | RollbarModuleOptions;
}

export interface RollbarModuleAsyncOptions
  extends Pick<ModuleMetadata, "imports"> {
  inject?: any[];
  useClass?: Type<RollbarOptionsFactory>;
  useExisting?: Type<RollbarOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<RollbarModuleOptions> | RollbarModuleOptions;
}
