import { Logger } from '@logging/logger/logger';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import {
  INVALID_AUTH_TOKEN, INVALID_AUTH_TOKEN_SOURCE, INVALID_BEARER_TOKEN
} from '../../app/shared/constants/app.constants';
import { ConfigService } from '../../config/config.service';
import { Auth0ServiceInterface } from '../interfaces/auth0/auth0.service.interface';
import { AuthProvider } from '../interfaces/authprovider';

@Injectable()
export default class Auth0Service implements Auth0ServiceInterface {

  constructor(
    private configService: ConfigService,
    private logger: Logger

  ) { }

  private getToken(authToken: string): string {
    const match = authToken.match(/^Bearer (.*)$/);
    if (!match || match.length < 2) {
      throw new HttpException({ message: INVALID_BEARER_TOKEN }, HttpStatus.UNAUTHORIZED);
    }
    return match[1];
  }

  private decodeToken(tokenString: string) {
    const decoded = jwt.decode(tokenString, { complete: true, json: true });
    if (!decoded || !decoded.header || !decoded.header.kid) {
      throw new HttpException({ message: INVALID_AUTH_TOKEN }, HttpStatus.UNAUTHORIZED);
    }
    return decoded;
  }

  public getAuthProvider(): AuthProvider {
    return AuthProvider.Auth0;
  }

  public async authenticate(authToken: string): Promise<any> {

    try {
      const tokenString = this.getToken(authToken);
      const authSecret = this.configService.get().auth.authSecret;
      return this.verify(tokenString, authSecret);
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      } else {
        this.logger.error(err);
        throw new HttpException({ message: INVALID_AUTH_TOKEN_SOURCE }, HttpStatus.UNAUTHORIZED);
      }
    }
  }

  private async verify(tokenString: string, secret: string) {
    try {
      jwt.verify(tokenString, secret);
      return jwt.decode(tokenString);
    } catch (error) {
      throw new HttpException({ message: INVALID_AUTH_TOKEN }, HttpStatus.UNAUTHORIZED);
    }
  }
}
