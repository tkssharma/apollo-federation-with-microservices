// Package.
import { Test, TestingModule } from "@nestjs/testing";
import { Injectable } from "@nestjs/common";

// Internal.
import { RollbarModuleOptions } from "../rollbar.interface";
import { InjectRollbar } from "../rollbar.decorator";
import Rollbar = require("rollbar");
import { RollbarModule } from "../rollbar.module";

// Code.
describe("InjectRollbar", () => {
  const options: RollbarModuleOptions = {
    accessToken: "token",
  };

  let module: TestingModule;

  @Injectable()
  class InjectableService {
    public constructor(@InjectRollbar() public readonly client: Rollbar) {}
  }

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [RollbarModule.forRoot(options)],
      providers: [InjectableService],
    }).compile();
  });

  describe("constructor", () => {
    it("should inject the rollbar client when decorating a class constructor parameter", () => {
      const testService = module.get(InjectableService);
      expect(testService).toHaveProperty("client");
      expect(testService.client).toBeInstanceOf(Rollbar);
    });
  });
});
