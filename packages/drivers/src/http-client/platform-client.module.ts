// Package.
import { DynamicModule, Global, Module, Provider, Type } from "@nestjs/common";

//Internal
import {
  PLATFORM_CLIENT_TOKEN,
  PLATFORM_CLIENT_MODULE_OPTIONS,
} from "./platform-client.constants";
import {
  PlatformClientModuleOptions,
  PlatformClientModuleAsyncOptions,
  PlatformClientModuleFactory,
} from "./platform-client.interface";
import { createPlatformClientProvider } from "./platform-client.provider";
import { getPlatformClientModuleOptions } from "./utils";

//Code.
@Global()
@Module({})
export class PlatformClientModule {
  public static forRoot(options: PlatformClientModuleOptions): DynamicModule {
    const provider: Provider = createPlatformClientProvider(options);
    return {
      module: PlatformClientModule,
      providers: [provider],
      exports: [provider],
    };
  }

  public static forRootAsync(
    options: PlatformClientModuleAsyncOptions
  ): DynamicModule {
    const provider: Provider = {
      inject: [PLATFORM_CLIENT_MODULE_OPTIONS],
      provide: PLATFORM_CLIENT_TOKEN,
      useFactory: async (options: PlatformClientModuleOptions) =>
        getPlatformClientModuleOptions(options),
    };

    return {
      module: PlatformClientModule,
      imports: options.imports,
      providers: [...this.createAsyncProviders(options), provider],
      exports: [provider],
    };
  }

  private static createAsyncProviders(
    options: PlatformClientModuleAsyncOptions
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }

    const useClass = options.useClass as Type<PlatformClientModuleFactory>;

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: PlatformClientModuleAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        provide: PLATFORM_CLIENT_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    const inject = [
      (options.useClass ||
        options.useExisting) as Type<PlatformClientModuleFactory>,
    ];

    return {
      provide: PLATFORM_CLIENT_MODULE_OPTIONS,
      useFactory: async (optionsFactory: PlatformClientModuleFactory) =>
        await optionsFactory.createPlatformModuleOptions(),
      inject,
    };
  }
}
