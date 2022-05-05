// Internal.
import { SendgridClientModuleOptions } from "./sendgrid.interface";
import { SendgridClientService } from "./sendgrid.service";

// Code.
export const getSendgridClientModuleOptions = (
  options: SendgridClientModuleOptions
): SendgridClientService => new SendgridClientService(options);
