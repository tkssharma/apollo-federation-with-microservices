import { Inject } from "@nestjs/common";
import { PLATFORM_CLIENT_TOKEN } from "./platform-client.constants";

export function InjectPlatformClient() {
  return Inject(PLATFORM_CLIENT_TOKEN);
}
