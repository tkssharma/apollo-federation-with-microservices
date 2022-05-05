// Package.
import { DynamicModule, Global, Module, Provider, Type } from "@nestjs/common";

//Internal
import {
  AUTH0_CLIENT_TOKEN,
  AUTH0_CLIENT_MODULE_OPTIONS,
} from "./auth0-client.constants";
import {
  Auth0ClientModuleOptions,
  Auth0ClientModuleAsyncOptions,
  Auth0ClientModuleFactory,
} from "./auth0-client.interface";
import { createAuth0ClientProvider } from "./auth0-client.provider";
import { getAuth0ClientModuleOptions } from "./utils";

//Code.
@Global()
@Module({})
export class Auth0ClientModule {
  public static forRoot(options: Auth0ClientModuleOptions): DynamicModule {
    const provider: Provider = createAuth0ClientProvider(options);
    return {
      module: Auth0ClientModule,
      providers: [provider],
      exports: [provider],
    };
  }

  public static forRootAsync(
    options: Auth0ClientModuleAsyncOptions
  ): DynamicModule {
    const provider: Provider = {
      inject: [AUTH0_CLIENT_MODULE_OPTIONS],
      provide: AUTH0_CLIENT_TOKEN,
      useFactory: async (options: Auth0ClientModuleOptions) =>
        getAuth0ClientModuleOptions(options),
    };

    return {
      module: Auth0ClientModule,
      imports: options.imports,
      providers: [...this.createAsyncProviders(options), provider],
      exports: [provider],
    };
  }

  private static createAsyncProviders(
    options: Auth0ClientModuleAsyncOptions
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }

    const useClass = options.useClass as Type<Auth0ClientModuleFactory>;

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: Auth0ClientModuleAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        provide: AUTH0_CLIENT_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    const inject = [
      (options.useClass ||
        options.useExisting) as Type<Auth0ClientModuleFactory>,
    ];

    return {
      provide: AUTH0_CLIENT_MODULE_OPTIONS,
      useFactory: async (optionsFactory: Auth0ClientModuleFactory) =>
        await optionsFactory.createAuth0ModuleOptions(),
      inject,
    };
  }
}
