/* eslint no-case-declarations: 0 */
// Package.
// Internal.
import { Auth0ClientModuleOptions } from "./auth0-client.interface";
import { Auth0ClientService } from "./auth0-client.service";

// Code.
export const getAuth0ClientModuleOptions = (
  options: Auth0ClientModuleOptions
): Auth0ClientService => new Auth0ClientService(options);
