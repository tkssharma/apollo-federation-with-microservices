import { ConfigAuthData } from '@config/config.interface';
import { ConfigService } from '@config/config.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as JwksClient from 'jwks-rsa';
import * as util from 'util';
import {
  INVALID_AUTH_TOKEN,
  INVALID_BEARER_TOKEN,
  JKWS_CACHE,
  JKWS_RATE_LIMIT,
  JKWS_REQUESTS_PER_MINUTE
} from '@app/app.constants';
import { UserMetaData } from '../interface/user';
import { Auth0ServiceInterface } from '../interfaces/auth0/auth0.service.interface';
import { AuthProvider } from '../interfaces/authprovider';

@Injectable()
export default class Auth0Service implements Auth0ServiceInterface {
  constructor(private configService: ConfigService) { }

  private getToken(authToken: string): string {
    const match = authToken.match(/^Bearer (.*)$/);
    if (!match || match.length < 2) {
      throw new HttpException(
        { message: INVALID_BEARER_TOKEN },
        HttpStatus.UNAUTHORIZED
      );
    }
    return match[1];
  }

  private decodeToken(tokenString: string) {
    const decoded = jwt.decode(tokenString, { complete: true, json: true });
    if (!decoded || !decoded.header || !decoded.header.kid) {
      throw new HttpException(
        { message: INVALID_AUTH_TOKEN },
        HttpStatus.UNAUTHORIZED
      );
    }
    return decoded;
  }

  public getAuthProvider(): AuthProvider {
    return AuthProvider.Auth0;
  }

  public async authenticate(
    authToken: string,
    origin?: string
  ): Promise<UserMetaData> {


    const tokenString = this.getToken(authToken);
    const decoded = this.decodeToken(tokenString);

    let configAuthData: ConfigAuthData;
    configAuthData = this.configService.get().auth;
    const client = JwksClient({
      jwksUri: configAuthData.jwksuri,
      rateLimit: JKWS_RATE_LIMIT,
      cache: JKWS_CACHE,
      jwksRequestsPerMinute: JKWS_REQUESTS_PER_MINUTE,
    });
    const getSigningKey = util.promisify(client.getSigningKey);

    try {
      const key: any = await getSigningKey(decoded.header.kid!);
      const signingKey = key.publicKey || key.rsaPublicKey;
      return this.verify(tokenString, signingKey, decoded);
    } catch (err) {
      throw new HttpException(
        { message: INVALID_AUTH_TOKEN },
        HttpStatus.UNAUTHORIZED
      );
    }
  }

  private async verify(
    tokenString: string,
    signingKey: string,
    decoded: any
  ) {
    try {
      jwt.verify(tokenString, signingKey);
      const { payload } = decoded;
      const metaLink = 'https://org.com/app_metadata';
      return {
        user_id: payload[metaLink] && payload[metaLink].user_uuid,
        organization_id: payload[metaLink] && payload[metaLink].company_uuid,
        roles: payload[metaLink] && payload['https://org.com/roles'],
        root:
          (payload[metaLink] &&
            payload['https://org.com/roles'].includes('root')) ||
          false,
        admin:
          (payload[metaLink] &&
            payload['https://org.com/roles'].includes(
              'admin'
            )) ||
          false
      };
    } catch (error) {
      throw new HttpException(
        { message: INVALID_AUTH_TOKEN },
        HttpStatus.UNAUTHORIZED
      );
    }
  }
}
