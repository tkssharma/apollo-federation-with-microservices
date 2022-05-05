import { Inject } from "@nestjs/common";
import { SENDGRID_CLIENT_TOKEN } from "./sendgrid.constants";

export function InjectSendgridClient() {
  return Inject(SENDGRID_CLIENT_TOKEN);
}
