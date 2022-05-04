// Package.
import { ModuleMetadata, Type } from "@nestjs/common";

export interface Auth0ClientModuleOptions {
  jwt_token_secret: string;
}

export interface Auth0ClientModuleFactory {
  createAuth0ModuleOptions: () =>
    | Promise<Auth0ClientModuleOptions>
    | Auth0ClientModuleOptions;
}

export interface Auth0ClientModuleAsyncOptions
  extends Pick<ModuleMetadata, "imports"> {
  inject?: any[];
  useClass?: Type<Auth0ClientModuleFactory>;
  useExisting?: Type<Auth0ClientModuleFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<Auth0ClientModuleOptions> | Auth0ClientModuleOptions;
}
