// Package.
import { DynamicModule, Global, Module, Provider, Type } from "@nestjs/common";

//Internal
import { S3_CLIENT_TOKEN, S3_CLIENT_MODULE_OPTIONS } from "./aws-s3.constants";
import {
  S3ClientModuleOptions,
  S3ClientModuleAsyncOptions,
  S3ClientModuleFactory,
} from "./aws-s3.interface";
import { createS3ClientProvider } from "./aws-s3.provider";
import { getS3ClientModuleOptions } from "./utils";

//Code.
@Global()
@Module({})
export class S3ClientModule {
  public static forRoot(options: S3ClientModuleOptions): DynamicModule {
    const provider: Provider = createS3ClientProvider(options);
    return {
      module: S3ClientModule,
      providers: [provider],
      exports: [provider],
    };
  }

  public static forRootAsync(
    options: S3ClientModuleAsyncOptions
  ): DynamicModule {
    const provider: Provider = {
      inject: [S3_CLIENT_MODULE_OPTIONS],
      provide: S3_CLIENT_TOKEN,
      useFactory: async (options: S3ClientModuleOptions) =>
        getS3ClientModuleOptions(options),
    };

    return {
      module: S3ClientModule,
      imports: options.imports,
      providers: [...this.createAsyncProviders(options), provider],
      exports: [provider],
    };
  }

  private static createAsyncProviders(
    options: S3ClientModuleAsyncOptions
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }

    const useClass = options.useClass as Type<S3ClientModuleFactory>;

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: S3ClientModuleAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        provide: S3_CLIENT_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    const inject = [
      (options.useClass || options.useExisting) as Type<S3ClientModuleFactory>,
    ];

    return {
      provide: S3_CLIENT_MODULE_OPTIONS,
      useFactory: async (optionsFactory: S3ClientModuleFactory) =>
        await optionsFactory.createPlatformModuleOptions(),
      inject,
    };
  }
}
