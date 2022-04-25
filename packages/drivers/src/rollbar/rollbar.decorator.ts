import { Inject } from "@nestjs/common";
import { ROLLBAR_TOKEN } from "./rollbar.constants";

export function InjectRollbar() {
  return Inject(ROLLBAR_TOKEN);
}
