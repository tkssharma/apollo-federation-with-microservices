import { Logger } from "@logging/logger/logger";
import {
  HttpException,
  HttpStatus,
  InternalServerErrorException
} from "@nestjs/common";
import "jest";
import { AUTH_FIXTURES } from "../../../test/fixtures/fixtures";
import * as CONSTANT from "../../app/shared/constants/app.constants";
import { DEFAULT_CONFIG } from "../../config/config.default";
import { ConfigService } from "../../config/config.service";
import AuthService from "./auth.service";
import Auth0Service from "./auth0.service";

describe("AuthService", () => {
  let authService: AuthService;
  let auth0Service: Auth0Service;
  let configService: ConfigService;
  let logger: Logger;

  beforeEach(async () => {
    process.env.AUTH_PROVIDER = "auth0";
    DEFAULT_CONFIG.auth.authProvider = "auth0";

    configService = new ConfigService({ ...DEFAULT_CONFIG, logLevel: "warn" });
    logger = new Logger(configService);
    auth0Service = new Auth0Service(configService, logger);
    authService = new AuthService(configService, auth0Service);
  });

  describe("Init", () => {
    it("Should return Internal Server Exception", async () => {
      const tokenString = `Bearer ${AUTH_FIXTURES.mockValidToken}`;
      jest
        .spyOn(auth0Service, "authenticate")
        .mockImplementation(() =>
          Promise.reject(new InternalServerErrorException())
        );
      try {
        await authService.init(tokenString);
      } catch (error) {
        expect(error.response).toEqual(AUTH_FIXTURES.internalServerErrorRes);
      }
    });

    it("Should return Unauthorized Exception", async () => {
      const tokenString = `Bearer ${AUTH_FIXTURES.invalidBearerAuthToken}`;
      jest
        .spyOn(auth0Service, "authenticate")
        .mockImplementation(() =>
          Promise.reject(
            new HttpException(
              { message: CONSTANT.INVALID_AUTH_TOKEN },
              HttpStatus.UNAUTHORIZED
            )
          )
        );
      try {
        await authService.init(tokenString);
      } catch (error) {
        expect(error.response).toEqual(AUTH_FIXTURES.invalidAuthTokenRes);
      }
    });

    it("Should return true for valid token", async () => {
      const tokenString = `Bearer ${AUTH_FIXTURES.mockValidToken}`;
      jest.spyOn(auth0Service, "authenticate").mockImplementation(() =>
        Promise.resolve({
          isSupplierAdmin: false,
          userId: "",
          organization_id: "",
          isRootUser: false,
          auth0_organization_id: "",
          isPurchaserAdmin: false,
          roles: [],
        })
      );
      const response = await authService.init(tokenString);
      expect(response).toEqual({
        isPurchaserAdmin: false,
        isSupplierAdmin: false,
        isRootUser: false,
        organization_id: "",
        auth0_organization_id: "",
        roles: [],
        userId: "",
      });
    });
  });
});
