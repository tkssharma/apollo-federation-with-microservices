// Package.
import { Provider } from "@nestjs/common";

// Internal.
import { AUTH0_CLIENT_TOKEN } from "./auth0-client.constants";
import { Auth0ClientModuleOptions } from "./auth0-client.interface";
import { getAuth0ClientModuleOptions } from "./utils";

// Code.
export function createAuth0ClientProvider(
  options: Auth0ClientModuleOptions
): Provider {
  return {
    provide: AUTH0_CLIENT_TOKEN,
    useValue: getAuth0ClientModuleOptions(options),
  };
}
