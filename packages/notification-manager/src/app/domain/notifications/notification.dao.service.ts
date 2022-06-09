
import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectModel } from 'nest-knexjs';
import { NotificationFilterDtoParam } from './notification.dto';
import { Notification, Status } from './notification.model';

@Injectable()
export default class NotificationDaoService {
  constructor(
    @InjectModel() private readonly knex: Knex,
  ) { }

  async create(notification: Notification) {
    const [notificationId] = await this.knex.table<Notification>('notifications').insert(notification, 'uuid');

    return notificationId;
  }
  async updateStatus(id: string, data: Partial<Notification>) {
    await this.knex.table<Notification>('notifications').where('uuid', id).update(data);
  }
  async getAllByFilters(isRootAdmin: boolean, filter: NotificationFilterDtoParam) {
    const { recipient_email, recipient_name, template_id, external_id, type } = filter;
    const query = this.knex.table<Notification>('notifications');

    if (recipient_email) {
      query.andWhere('recipient_email', recipient_email)
    }
    if (recipient_name) {
      query.andWhere('recipient_name', recipient_name)
    }
    if (template_id) {
      query.andWhere('template_id', template_id)
    }
    if (external_id) {
      query.andWhere('external_id', external_id)
    }
    if (type) {
      query.andWhere('type', type)
    }
    return await query;
  }
  async getUnsent() {
    return await this.knex.table<Notification>('notifications').where({
      status: Status.pending
    });
  }
}
