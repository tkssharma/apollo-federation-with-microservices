// Package.
import { DynamicModule, Global, Module, Provider, Type } from "@nestjs/common";

//Internal
import {
  SENDGRID_CLIENT_TOKEN,
  SENDGRID_CLIENT_MODULE_OPTIONS,
} from "./sendgrid.constants";
import {
  SendgridClientModuleOptions,
  SendgridClientModuleAsyncOptions,
  SendgridClientModuleFactory,
} from "./sendgrid.interface";
import { createSendgridClientProvider } from "./sendgrid.provider";
import { getSendgridClientModuleOptions } from "./utils";

//Code.
@Global()
@Module({})
export class SendgridClientModule {
  public static forRoot(options: SendgridClientModuleOptions): DynamicModule {
    const provider: Provider = createSendgridClientProvider(options);
    return {
      module: SendgridClientModule,
      providers: [provider],
      exports: [provider],
    };
  }

  public static forRootAsync(
    options: SendgridClientModuleAsyncOptions
  ): DynamicModule {
    const provider: Provider = {
      inject: [SENDGRID_CLIENT_MODULE_OPTIONS],
      provide: SENDGRID_CLIENT_TOKEN,
      useFactory: async (options: SendgridClientModuleOptions) =>
        getSendgridClientModuleOptions(options),
    };

    return {
      module: SendgridClientModule,
      imports: options.imports,
      providers: [...this.createAsyncProviders(options), provider],
      exports: [provider],
    };
  }

  private static createAsyncProviders(
    options: SendgridClientModuleAsyncOptions
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }

    const useClass = options.useClass as Type<SendgridClientModuleFactory>;

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: SendgridClientModuleAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        provide: SENDGRID_CLIENT_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    const inject = [
      (options.useClass ||
        options.useExisting) as Type<SendgridClientModuleFactory>,
    ];

    return {
      provide: SENDGRID_CLIENT_MODULE_OPTIONS,
      useFactory: async (optionsFactory: SendgridClientModuleFactory) =>
        await optionsFactory.createPlatformModuleOptions(),
      inject,
    };
  }
}
