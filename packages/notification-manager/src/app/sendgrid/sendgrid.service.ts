// Package.
import { Injectable } from "@nestjs/common";
import { ClientResponse } from "@sendgrid/client/src/response";

import * as nodemailer from 'nodemailer';

// Internal.
import {
  SendEmailInput,
} from "./types";
import { ConfigService } from "@config/config.service";
// Code.
@Injectable()
export class SendgridService {

  transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
  }

  initTransporter() {
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
  }

  async sendEmail(input: SendEmailInput): Promise<ClientResponse> {
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
}
