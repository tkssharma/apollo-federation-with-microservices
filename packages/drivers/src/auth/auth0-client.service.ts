// Package.
import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import * as jwt from "jsonwebtoken";

// Internal.
import {
  AUTH0_CLIENT_MODULE_OPTIONS,
  INVALID_AUTH_TOKEN,
  INVALID_BEARER_TOKEN,
} from "./auth0-client.constants";
import { Auth0ClientModuleOptions } from "./auth0-client.interface";

export class Auth0ClientService {
  private readonly tokenSecret!: string;

  constructor(
    @Inject(AUTH0_CLIENT_MODULE_OPTIONS)
    private readonly options: Auth0ClientModuleOptions
  ) {
    this.tokenSecret = this.options.jwt_token_secret;
  }

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

  public async authenticate(authToken: string): Promise<any> {
    try {
      const tokenString = this.getToken(authToken);
      const decoded = this.decodeToken(tokenString);

      return this.verify(tokenString, decoded);
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      } else {
        throw new HttpException(
          { message: INVALID_AUTH_TOKEN },
          HttpStatus.UNAUTHORIZED
        );
      }
    }
  }

  private async verify(tokenString: string, decoded: any) {
    try {
      jwt.verify(tokenString, this.tokenSecret!);
      const { payload } = decoded;
      return {
        user_id: payload.userId,
      };
    } catch (error) {
      throw new HttpException(
        { message: INVALID_AUTH_TOKEN },
        HttpStatus.UNAUTHORIZED
      );
    }
  }
}
