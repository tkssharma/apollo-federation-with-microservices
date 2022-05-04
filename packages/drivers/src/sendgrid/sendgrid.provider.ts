// Package.
import { Provider } from "@nestjs/common";

// Internal.
import { SENDGRID_CLIENT_TOKEN } from "./sendgrid.constants";
import { SendgridClientModuleOptions } from "./sendgrid.interface";
import { getSendgridClientModuleOptions } from "./utils";

// Code.
export function createSendgridClientProvider(
  options: SendgridClientModuleOptions
): Provider {
  return {
    provide: SENDGRID_CLIENT_TOKEN,
    useValue: getSendgridClientModuleOptions(options),
  };
}
