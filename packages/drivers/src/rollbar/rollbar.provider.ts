// Package.
import { Provider } from "@nestjs/common";
import Rollbar = require("rollbar");

// Internal.
import { ROLLBAR_TOKEN } from "./rollbar.constants";

// Code.
export function createRollbarProviders(
  options: Rollbar.Configuration
): Provider {
  return {
    provide: ROLLBAR_TOKEN,
    useValue: new Rollbar(options),
  };
}
