// Internal.
import { PlatformClientModuleOptions } from "./platform-client.interface";
import { PlatformClientService } from "./platform-client.service";

// Code.
export const getPlatformClientModuleOptions = (
  options: PlatformClientModuleOptions
): PlatformClientService => new PlatformClientService(options);
