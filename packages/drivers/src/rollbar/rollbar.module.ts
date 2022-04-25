// Package.
import { DynamicModule, Global, Module, Provider, Type } from "@nestjs/common";
import Rollbar = require("rollbar");

// Internal.
import { ROLLBAR_MODULE_OPTIONS, ROLLBAR_TOKEN } from "./rollbar.constants";
import {
  RollbarModuleAsyncOptions,
  RollbarModuleOptions,
  RollbarOptionsFactory,
} from "./rollbar.interface";
import { createRollbarProviders } from "./rollbar.provider";

// Code.
@Global()
@Module({})
export class RollbarModule {
  public static forRoot(options: RollbarModuleOptions): DynamicModule {
    const provider = createRollbarProviders(options);

    return {
      exports: [provider],
      module: RollbarModule,
      providers: [provider],
    };
  }

  public static forRootAsync(
    options: RollbarModuleAsyncOptions
  ): DynamicModule {
    const provider: Provider = {
      inject: [ROLLBAR_MODULE_OPTIONS],
      provide: ROLLBAR_TOKEN,
      useFactory: (options: RollbarModuleOptions) => new Rollbar(options),
    };

    return {
      exports: [provider],
      imports: options.imports,
      module: RollbarModule,
      providers: [...this.createAsyncProviders(options), provider],
    };
  }

  private static createAsyncProviders(
    options: RollbarModuleAsyncOptions
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }

    const useClass = options.useClass as Type<RollbarOptionsFactory>;

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: RollbarModuleAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        inject: options.inject || [],
        provide: ROLLBAR_MODULE_OPTIONS,
        useFactory: options.useFactory,
      };
    }

    const inject = [
      (options.useClass || options.useExisting) as Type<RollbarOptionsFactory>,
    ];

    return {
      provide: ROLLBAR_MODULE_OPTIONS,
      useFactory: async (optionsFactory: RollbarOptionsFactory) =>
        await optionsFactory.createRollbarOptions(),
      inject,
    };
  }
}
