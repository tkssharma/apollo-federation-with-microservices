import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserMetaData } from '../../../auth/interface/user';
import NotificationDaoService from './notification.dao.service';
import { NotificationFilterDtoParam, NotificationPayload } from './notification.dto';
import NotificationHandlerService from './notification.handler';

@Injectable()
export default class NotificationService {
  constructor(
    private readonly service: NotificationDaoService,
    private readonly notificationHandlerService: NotificationHandlerService

  ) { }

  async fetchNotification(user: UserMetaData, filter: NotificationFilterDtoParam) {
    const { userId, permissions, isRootUser } = user;
    if (isRootUser) {
      return await this.service.getAllByFilters(true, filter)
    }
    throw new UnauthorizedException()
  }
  async createNotification(user: UserMetaData, payload: NotificationPayload) {
    return await this.notificationHandlerService.handleAllEmailEvents(user, payload);
  }
}

