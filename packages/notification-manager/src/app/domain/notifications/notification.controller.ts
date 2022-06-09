import { Controller, Get, Post, HttpCode, HttpStatus, Query, UseGuards, UsePipes, ValidationPipe, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RollbarLogger } from 'nestjs-rollbar';
import { UserMetaData } from '@auth/interface/user';
import { User } from '@auth/decorator/user';
import { Logger } from '@logging/logger/logger';
import { RolesGuard } from '@core/guard/role.guard';
import { NotificationFilterDtoParam, NotificationPayload } from './notification.dto';
import { NotificationListResponse } from './notification.types';
import { ApiFilterQuery } from '../shared/decorator/decorator';
import NotificationService from './notification.service';

@ApiBearerAuth('authorization')
@Controller('/api/v1/notifications')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  }),
)
export class NotificationController {
  constructor(
    private logger: Logger,
    private readonly rollbar: RollbarLogger,
    private readonly service: NotificationService
  ) { }


  @ApiTags('notifications')
  @HttpCode(HttpStatus.OK)
  @ApiFilterQuery('filter', NotificationFilterDtoParam)
  @ApiOperation({ description: 'fetch all notifications based on different filters' })
  @ApiResponse({
    type: [NotificationListResponse],
    description:
      "returns list of notification for the login in user based on different filter, root users can search across whole data and admins can search in their own data",
  })
  @Get('/')
  public async fetchNotifications(
    @User() user: UserMetaData,
    @Query('filter') filter: NotificationFilterDtoParam,
  ) {
    return await this.service.fetchNotification(user, filter);
  }


  @ApiTags('notifications')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ description: 'create a new email notification' })
  @ApiResponse({
    type: [NotificationListResponse],
    description:
      "create a new email notification",
  })
  @Post('/')
  public async createNotifications(
    @User() user: UserMetaData,
    @Body() data: NotificationPayload,
  ) {
    return await this.service.createNotification(user, data);
  }
}


