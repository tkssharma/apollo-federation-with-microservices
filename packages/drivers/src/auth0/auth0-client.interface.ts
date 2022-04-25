// Package.
import { ModuleMetadata, Type } from "@nestjs/common";

// Code.

export interface ConfigAuthData {
  /** The JWKS URI to use. */
  jwksuri: string;

  /** The Auth audience to use. */
  audience?: string;

  /** The Auth token Issuer to use. */
  tokenIssuer: string;
}

export interface Auth0ClientModuleOptions {
  auth: ConfigAuthData;
  authSupplier: ConfigAuthData;
  authPurchaser: ConfigAuthData;
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
