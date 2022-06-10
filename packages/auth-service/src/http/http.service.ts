import { Injectable } from "@nestjs/common";
import axios, { AxiosRequestConfig } from "axios";
import moment from "moment";
import debug from "debug";
import { ConfigService } from "src/config/config.service";
import { Logger } from "src/logger/logger";
import { RequestLog } from "src/logger/logger.middleware";

const verbose = debug("external:api:http:verbose:handler");

interface RequestOptions {
  url: string;
  baseURL: string;
  data?: object;
  params?: object;
  formData?: any;
  method: string;
}
@Injectable()
export default class HttpClientService {
  public baseUrl: string;
  public token: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger
  ) { }
  public async send(
    request: RequestLog,
    options: RequestOptions,
    overrideHeaders?: any
  ): Promise<any> {
    const start = new Date();
    try {
      const headers = {
        authorization: `${request.authorization}`,
        "x-request-id": request.correlationId,
        "x-span-id": request.span,
        "Content-Type": "application/json",
        ...overrideHeaders,
      };
      const httpRequest: any = {
        ...options,
        headers,
      };
      verbose(httpRequest);
      const data = await axios(httpRequest);
      return data;
    } catch (error) {
      this.logger.error(
        `HttpClientService -> send [external http]' ${JSON.stringify({
          options,
        })}`
      );
      throw error;
    } finally {
      const end = new Date();
      this.logger.info(
        `date=${moment().format("DD/MMM/YYYY:HH:mm:ss ZZ")}  trace=${request.correlationId
        } type=OutgoingRequest endpoint=${options.baseURL} duration=${end.getTime() - start.getTime()
        } parentspan=${request.parentSpan} span=${request.span}`
      );
    }
  }
}
