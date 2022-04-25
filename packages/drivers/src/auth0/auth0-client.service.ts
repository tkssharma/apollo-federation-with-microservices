// Package.
import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import * as JwksClient from "jwks-rsa";
import * as util from "util";

// Internal.
import {
  AUTH0_CLIENT_MODULE_OPTIONS,
  INVALID_AUTH_TOKEN,
  INVALID_BEARER_TOKEN,
  JKWS_CACHE,
  JKWS_RATE_LIMIT,
  JKWS_REQUESTS_PER_MINUTE,
} from "./auth0-client.constants";
import {
  Auth0ClientModuleOptions,
  ConfigAuthData,
} from "./auth0-client.interface";

export class Auth0ClientService {
  private readonly auth: ConfigAuthData;

  constructor(
    @Inject(AUTH0_CLIENT_MODULE_OPTIONS)
    private readonly options: Auth0ClientModuleOptions
  ) {
    this.auth = this.options.auth;
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

  private getAuthConfigData() {
    let configAuthData: ConfigAuthData;
    configAuthData = this.auth;
    return configAuthData;
  }

  public async authenticate(authToken: string): Promise<any> {
    try {
      const tokenString = this.getToken(authToken);
      const decoded = this.decodeToken(tokenString);

      const configAuthData = this.getAuthConfigData();
      const client = JwksClient({
        jwksUri: configAuthData.jwksuri,
        rateLimit: JKWS_RATE_LIMIT,
        cache: JKWS_CACHE,
        jwksRequestsPerMinute: JKWS_REQUESTS_PER_MINUTE,
      });

      const getSigningKey = util.promisify(client.getSigningKey);
      const key: any = await getSigningKey(decoded.header.kid!);
      const signingKey = key.publicKey || key.rsaPublicKey;
      return this.verify(tokenString, signingKey, decoded);
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

  private async verify(tokenString: string, signingKey: string, decoded: any) {
    try {
      jwt.verify(tokenString, signingKey);
      const { payload } = decoded;
      const metaLink = "https://org.com/app_metadata";
      return {
        user_id: payload[metaLink] && payload[metaLink].user_uuid,
        organization_id: payload[metaLink] && payload[metaLink].company_uuid,
        auth0_organization_id:
          payload[metaLink] && payload[metaLink].auth0_organization_id,
        roles: (payload[metaLink] && payload["https://org.com/roles"]) || [],
        isRootUser:
          (payload[metaLink] &&
            payload["https://org.com/roles"].includes("org-root")) ||
          false,
        isPurchaserAdmin:
          (payload[metaLink] &&
            payload["https://org.com/roles"].includes("purchaser-admin")) ||
          false,
        isSupplierAdmin:
          (payload[metaLink] &&
            payload["https://org.com/roles"].includes("supplier-admin")) ||
          false,
      };
    } catch (error) {
      throw new HttpException(
        { message: INVALID_AUTH_TOKEN },
        HttpStatus.UNAUTHORIZED
      );
    }
  }
}
