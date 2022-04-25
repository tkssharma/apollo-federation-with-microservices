// Package.
import { Test, TestingModule } from "@nestjs/testing";
import { Injectable } from "@nestjs/common";

// Internal.
import { InjectAuth0Client } from "../auth0-client.decorator";
import { Auth0ClientService } from "../auth0-client.service";
import { Auth0ClientModule } from "../auth0-client.module";
import { Auth0ClientModuleOptions } from "../auth0-client.interface";

// Code.
describe("InjectAuth0Client", () => {
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

  let module: TestingModule;

  @Injectable()
  class InjectableService {
    public constructor(
      @InjectAuth0Client() public readonly client: Auth0ClientService
    ) {}
  }

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [Auth0ClientModule.forRoot(options)],
      providers: [InjectableService],
    }).compile();
  });

  describe("constructor", () => {
    it("should inject the auth0 client when decorating a class constructor parameter", () => {
      const testService = module.get(InjectableService);
      expect(testService).toHaveProperty("client");
      expect(testService.client).toBeInstanceOf(Auth0ClientService);
    });
  });
});
