
import axios from 'axios';

import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { ConfigService } from '@config/config.service';
import { Logger } from '@logger/logger';
import { RequestLog } from '@logger/logger.middleware';
@Injectable()
export default class HttpClientService {
  public baseUrl: string;
  public token: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {
    this.baseUrl = this.configService.get().platformApis.baseUrl;
    this.token = this.configService.get().platformApis.token;
  }
  public async externalCall(request: Partial<RequestLog>, payload: any): Promise<any> {
    const start = new Date();
    const { id } = payload;
    let url;
    try {
      const headers: any = {
        'Authorization': `Bearer ${this.token}`,
        'x-request-id': request.correlationId,
        'x-span-id': request.span,
      };
      url = `${this.baseUrl}/service-requests/${id}/projects`;
      const data = await axios.get(url, { headers });
      return data?.data;
    } catch (error) {
      this.logger.error(error as any);

      throw error;
    } finally {
      const end = new Date();
      this.logger.log(`date=${moment().format('DD/MMM/YYYY:HH:mm:ss ZZ')}  trace=${request.correlationId} type=OutgoingRequest endpoint=${url} duration=${end.getTime() - start.getTime()} parentspan=${request.parentSpan} span=${request.span}`);
    }
  }
}
