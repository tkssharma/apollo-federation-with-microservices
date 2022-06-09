import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { NextFunction, Response } from 'express';
import AuthService from '@auth/services/auth.service';
import { MISSING_AUTH_HEADER } from '../../shared/constants/app.constants';
import { RequestModel } from '../interface/user';
import { Logger } from '@logging/logger/logger';

@Injectable()
export class AuthMiddleware implements NestMiddleware {

  constructor(
    private authorizationService: AuthService,
    private readonly logger: Logger
  ) { }

  public async use(req: RequestModel, res: Response, next: NextFunction) {
    const { authorization } = req.headers;

    if (!authorization) {
      throw new HttpException({ message: MISSING_AUTH_HEADER }, HttpStatus.BAD_REQUEST);
    }
    const data = await this.authorizationService.init(authorization);
    const {
      userId,
      email,
      permissions
    } = data;

    req.user = {
      userId,
      isRootUser: (permissions && permissions.includes('admin')),
      email,
      permissions
    };
    next();
  }
}
