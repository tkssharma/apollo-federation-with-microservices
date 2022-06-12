// Package.
import { Injectable } from "@nestjs/common";
import { ClientResponse } from "@sendgrid/client/src/response";

import * as nodemailer from 'nodemailer';

// Internal.
import {
  SendEmailInput,
} from "./types";
import { ConfigService } from "@config/config.service";
import { throwError } from "rxjs";
import { Logger } from "@logging/logger/logger";
// Code.
@Injectable()
export class SendgridService {

  transporter: nodemailer.Transporter;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger
  ) {
  }

  initTransporter() {
    try {
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: process.env.SENDGRID_USER,
          pass: process.env.SENDGRID_PASSWORD,
        },
        logger: true
      });
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async sendEmail(input: SendEmailInput): Promise<ClientResponse> {
    try {
      this.initTransporter();
      const info = await this.transporter.sendMail({
        from: input.from,
        to: input.to,
        subject: input.subject,
        text: input.text,
        html: input.html,
      });
      return info;
    }
    catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
