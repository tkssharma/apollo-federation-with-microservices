import { Inject } from "@nestjs/common";
import { AUTH0_CLIENT_TOKEN } from "./auth0-client.constants";

export function InjectAuth0Client() {
  return Inject(AUTH0_CLIENT_TOKEN);
}
