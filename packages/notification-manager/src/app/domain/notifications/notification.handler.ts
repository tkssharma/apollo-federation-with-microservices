// External
import { Injectable, NotFoundException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RollbarLogger } from 'nestjs-rollbar';
import { v4 as uuidv4 } from 'uuid';
import NotificationDaoService from './notification.dao.service';
import { ConfigService } from '@config/config.service';
import { Logger } from '@logging/logger/logger';
import { Status } from './notification.model';
import { NotificationPayload } from './notification.dto';
import { UserMetaData } from '@auth/interface/user';
import nodemailer from 'nodemailer';
import handlebars from "handlebars";
import * as path from 'path';
import * as fs from 'fs';
import { EmailTemplate } from './template-mapping';
import { Type } from 'class-transformer';
import { SendgridService } from '@app/sendgrid/sendgrid.service';

@Injectable()
export default class NotificationHandlerService {
  transporter: nodemailer.Transporter;
  constructor(
    private readonly rollbarLogger: RollbarLogger,
    private readonly logger: Logger,
    private readonly notificationDaoService: NotificationDaoService,
    private readonly sendgridService: SendgridService,
    private readonly configService: ConfigService

  ) {

  }

  public async handleAllEmailEvents(user: UserMetaData, payload: NotificationPayload) {
    try {
      const { template_type } = payload;
      switch (template_type) {
        case 'USER_SIGNUP_NOTIFICATION':
          return await this.sendUserSignupEmail(user, payload);
          break;
        default:
          return null;
          break;

      }
    } catch (err) { }
  }
  private async sendUserSignupEmail(user: UserMetaData, data: NotificationPayload) {
    try {
      const { template_type } = data;
      this.logger.log(`processing [platform service] ${template_type}`);

      const notificationId = await this.notificationDaoService.create({
        uuid: uuidv4(),
        name: template_type,
        type: 'email',
        external_id: data.external_id || uuidv4(),
        recipient_email: data.recipient_email,
        recipient_name: data.recipient_name,
        template_data: JSON.stringify(data.template_data || {}),
        template_type: data.template_type,
        status: Status.pending
      })

      const info = await this.sendgridService.sendEmail(this.buildEmailPayload(data, template_type));
      await this.notificationDaoService.updateStatus(notificationId, {
        status: Status.processed,
      });
      return info;

    } catch (error) {
      this.rollbarLogger.error(error, 'EventHandlerService -> handleAllEmailEvents');
      this.logger.error(error);
      throw error;
    }
  }
  public buildEmailPayload(data: NotificationPayload, type: string) {
    const template = EmailTemplate.find(i => i.type === type);
    if (!template) {
      throw new NotFoundException(`Invalid template type passed || ${template.type}`)
    }
    const filePath = path.join(__dirname, `./emails/${template.template_file}.html`);
    const source = fs.readFileSync(filePath, 'utf-8').toString();
    const htmlTemplate = handlebars.compile(source);
    const templateData = {
      recipient_name: data.recipient_name,
      recipient_email: data.recipient_email
    };
    const htmlToSend = htmlTemplate(templateData);

    return {
      from: template.from,
      to: data.recipient_email,
      subject: template.subject,
      html: htmlToSend,
    }
  }
}