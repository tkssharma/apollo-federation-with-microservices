import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { NextFunction, Response } from 'express';
import { MISSING_AUTH_HEADER } from '@app/app.constants';
import { RequestModel } from '../interface/user';
import AuthService from '../services/auth.service';
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private authorizationService: AuthService) { }

  public async use(req: RequestModel, _: Response, next: NextFunction) {
    const { authorization } = req.headers;
    const origin = req.headers['x-api-origin'] as any;
    console.log(`Logging origin for debugging ${origin}`);
    if (!authorization) {
      throw new HttpException(
        { message: MISSING_AUTH_HEADER },
        HttpStatus.BAD_REQUEST
      );
    }
    const { user_id, organization_id, root, admin, roles } =
      await this.authorizationService.init(authorization, origin);
    req.user = {
      user_id,
      organization_id,
      root,
      admin,
      roles,
    };
    next();
  }
}
