// Package.
import { DynamicModule, Global, Module, Provider, Type } from "@nestjs/common";

// Internal.
import {
  AZUREBLOB_MODULE_OPTIONS,
  AZUREBLOB_TOKEN,
} from "./azure-blob.constants";
import {
  AzureBlobModuleOptions,
  AzureBlobModuleAsyncOptions,
  AzureBlobOptionsFactory,
} from "./azure-blob.interface";
import { createAzureBlobProviders } from "./azure-blob.provider";
import { createAzureBlobClient } from "./utils";

// Code.
@Global()
@Module({})
export class AzureBlobModule {
  public static forRoot(options: AzureBlobModuleOptions): DynamicModule {
    const provider = createAzureBlobProviders(options);

    return {
      exports: [provider],
      module: AzureBlobModule,
      providers: [provider],
    };
  }

  public static forRootAsync(
    options: AzureBlobModuleAsyncOptions
  ): DynamicModule {
    const provider: Provider = {
      inject: [AZUREBLOB_MODULE_OPTIONS],
      provide: AZUREBLOB_TOKEN,
      useFactory: (options: AzureBlobModuleOptions) =>
        createAzureBlobClient(options),
    };

    return {
      exports: [provider],
      imports: options.imports,
      module: AzureBlobModule,
      providers: [...this.createAsyncProviders(options), provider],
    };
  }

  private static createAsyncProviders(
    options: AzureBlobModuleAsyncOptions
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }

    const useClass = options.useClass as Type<AzureBlobOptionsFactory>;

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: AzureBlobModuleAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        inject: options.inject || [],
        provide: AZUREBLOB_MODULE_OPTIONS,
        useFactory: options.useFactory,
      };
    }

    const inject = [
      (options.useClass ||
        options.useExisting) as Type<AzureBlobOptionsFactory>,
    ];

    return {
      provide: AZUREBLOB_MODULE_OPTIONS,
      useFactory: async (optionsFactory: AzureBlobOptionsFactory) =>
        await optionsFactory.createAzureBlobOptions(),
      inject,
    };
  }
}
