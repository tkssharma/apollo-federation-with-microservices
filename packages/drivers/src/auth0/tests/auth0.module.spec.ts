// Package.
import { Test } from "@nestjs/testing";

// Internal.
import { Auth0ClientModule } from "../auth0-client.module";
import { Auth0ClientService } from "../auth0-client.service";
import { Auth0ClientModuleFactory } from "../auth0-client.interface";
import { AUTH0_CLIENT_TOKEN } from "../auth0-client.constants";
import { Auth0ClientModuleOptions } from "../auth0-client.interface";

// Code.
describe("Auth0ClientModule", () => {
  const options: Auth0ClientModuleOptions = {
    auth: {
      jwksuri: "https://auth.example.io/.well-known/jwks.json",
      audience: "https://example.com/v1",
      tokenIssuer: "https://auth.example.io/",
    },
    authSupplier: {
      jwksuri: "https://auth.example.io/.well-known/jwks.json",
      audience: "https://api-dev.org.io",
      tokenIssuer: "https://auth.example.io/",
    },
    authPurchaser: {
      jwksuri: "https://auth.example.io/.well-known/jwks.json",
      audience: "https://api-dev.org.io",
      tokenIssuer: "https://auth.example.io/",
    },
  };

  class TestService implements Auth0ClientModuleFactory {
    createAuth0ModuleOptions(): Auth0ClientModuleOptions {
      return options;
    }
  }

  describe("forRoot", () => {
    it("should be able to return an instance of Auth0ClientService", async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [Auth0ClientModule.forRoot(options)],
      }).compile();

      const service = moduleRef.get<Auth0ClientService>(AUTH0_CLIENT_TOKEN);

      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(Auth0ClientService);
    });
  });

  describe("forRootAsync", () => {
    it("should be able to return an instance of Auth0ClientService when the `useFactory` option is used", async () => {
      const mod = await Test.createTestingModule({
        imports: [
          Auth0ClientModule.forRootAsync({
            useFactory: () => options,
          }),
        ],
      }).compile();

      const service = mod.get<Auth0ClientService>(AUTH0_CLIENT_TOKEN);

      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(Auth0ClientService);
    });
  });

  describe("useClass", () => {
    it("should be able to return an instance of Auth0ClientService when the `useClass` option is used", async () => {
      const mod = await Test.createTestingModule({
        imports: [
          Auth0ClientModule.forRootAsync({
            useClass: TestService,
          }),
        ],
      }).compile();

      const service = mod.get<Auth0ClientService>(AUTH0_CLIENT_TOKEN);

      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(Auth0ClientService);
    });
  });
});
