import { RequestMethod } from "@nestjs/common";
import { RouteInfo } from "@nestjs/common/interfaces";

export const ExternalRoutes: Array<RouteInfo> = [
  {
    path: `/v1/health`,
    method: RequestMethod.ALL,
  }
];