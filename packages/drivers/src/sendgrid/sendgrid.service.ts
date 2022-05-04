// Package.
import { Inject } from "@nestjs/common";
// Internal.
import { SENDGRID_CLIENT_MODULE_OPTIONS } from "./sendgrid.constants";
import { SendgridClientModuleOptions } from "./sendgrid.interface";
const sendGridClient = require("@sendgrid/mail");
export interface MessagePayload {
  to: string;
  from: string;
}
export interface MessageWithTemplate {
  recipient: string;
  templateId: string;
}
export class SendgridClientService {
  private readonly sendgrid_token: string = "";

  constructor(
    @Inject(SENDGRID_CLIENT_MODULE_OPTIONS)
    private readonly options: SendgridClientModuleOptions
  ) {
    this.sendgrid_token = this.options.sendgrid_token;
    sendGridClient.setApiKey(this.sendgrid_token);
  }
  async sendEmail(message: MessagePayload) {
    try {
      await sendGridClient.send(message);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async sendEmailWithTemplate(data: MessageWithTemplate, templateData: any) {
    try {
      await sendGridClient.sendMail({
        recipients: [data.recipient],
        templateId: data.templateId,
        templateData,
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
