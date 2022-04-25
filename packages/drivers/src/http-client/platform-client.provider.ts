// Package.
import { Provider } from "@nestjs/common";

// Internal.
import { PLATFORM_CLIENT_TOKEN } from "./platform-client.constants";
import { PlatformClientModuleOptions } from "./platform-client.interface";
import { getPlatformClientModuleOptions } from "./utils";

// Code.
export function createPlatformClientProvider(
  options: PlatformClientModuleOptions
): Provider {
  return {
    provide: PLATFORM_CLIENT_TOKEN,
    useValue: getPlatformClientModuleOptions(options),
  };
}
