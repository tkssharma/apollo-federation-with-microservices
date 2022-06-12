import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { OnEvent } from '@nestjs/event-emitter';
import { Logger } from '../logger/logger';
import HttpClientService from '../http/http.service';
import { v4 as uuidv4 } from 'uuid';
import { userInfo } from 'os';
import { UserEntity } from './entity/users.entity';


export interface UserEventPayload {
  user: UserEntity,
  token: string;
  authorization: string;
}
@Injectable()
export class UsersEventService {
  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
    private readonly httpService: HttpClientService
  ) { }

  @OnEvent('USER_PASSWORD_RESET_NOTIFICATION')
  async sendUserResetEmail(payload: UserEventPayload) {
    try {
      this.logger.log(`handling [event] USER_PASSWORD_RESET_NOTIFICATION`);
      console.log(payload);
      const { authorization, user, token } = payload;
      const notificationApiUrl = this.configService.get().apis.notificationApiUrl;
      await this.httpService.send({ authorization } as any, {
        baseURL: notificationApiUrl,
        url: 'notifications',
        method: 'POST',
        data: {
          "external_id": uuidv4(),
          "recipient_email": user.email,
          "recipient_name": user.first_name,
          "template_data": {
            "recipient_name": user.first_name,
            "recipient_email": user.email,
            token
          },
          "template_type": "USER_PASSWORD_RESET_NOTIFICATION"
        }
      })
    } catch (err) {
      this.logger.error(err);
    }
  }

  @OnEvent('USER_SIGNUP_NOTIFICATION')
  async sendUserSignupEmail(payload: UserEventPayload) {
    try {
      this.logger.log(`handling [event] USER_SIGNUP_NOTIFICATION`)
      const { authorization, user } = payload;
      const notificationApiUrl = this.configService.get().apis.notificationApiUrl;
      await this.httpService.send({ authorization } as any, {
        baseURL: notificationApiUrl,
        url: 'notifications',
        method: 'POST',
        data: {
          "external_id": uuidv4(),
          "recipient_email": user.email,
          "recipient_name": user.first_name,
          "template_data": {
            "recipient_name": user.first_name,
            "recipient_email": user.email
          },
          "template_type": "USER_SIGNUP_NOTIFICATION"
        }
      })
    } catch (err) {
      this.logger.error(err);
    }
  }

}