// Package.
import { Injectable } from "@nestjs/common";
import { InjectSendGrid, SendGridService } from "@ntegral/nestjs-sendgrid";
import { ClientResponse } from "@sendgrid/client/src/response";

// Internal.
import {
  IEmailProvider,
  SendBatchEmailInput,
  SendEmailInput,
} from "../email-provider";

// Code.
@Injectable()
export class SendgridService implements IEmailProvider {
  constructor(@InjectSendGrid() private readonly sendgrid: SendGridService) {}

  async sendBatchEmail(input: SendBatchEmailInput): Promise<ClientResponse> {
    if (!input.text && !input.html) {
      throw new Error("Message body cannot be empty");
    }

    const [res] = await this.sendgrid.sendMultiple({
      from: input.from,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
    });

    return res;
  }

  async sendEmail(input: SendEmailInput): Promise<ClientResponse> {
    if (!input.text && !input.html) {
      throw new Error("Message body cannot be empty");
    }

    const [res] = await this.sendgrid.send({
      from: input.from,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
    });

    return res;
  }
}
