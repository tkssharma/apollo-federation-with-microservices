// Package.
import { Test } from "@nestjs/testing";
import Rollbar = require("rollbar");
import { ROLLBAR_TOKEN } from "../rollbar.constants";

// Internal.
import {
  RollbarModuleOptions,
  RollbarOptionsFactory,
} from "../rollbar.interface";
import { RollbarModule } from "../rollbar.module";

// Code.
describe("RollbarModule", () => {
  const options: RollbarModuleOptions = {
    accessToken: "token",
  };

  class TestService implements RollbarOptionsFactory {
    createRollbarOptions() {
      return options;
    }
  }

  describe("forRoot", () => {
    it("should be able to return an instance of Rollbar", async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [RollbarModule.forRoot(options)],
      }).compile();

      const service = moduleRef.get<Rollbar>(ROLLBAR_TOKEN);

      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(Rollbar);
    });
  });

  describe("forRootAsync", () => {
    it("should be able to return an instance of Rollbar when the `useFactory` option is used", async () => {
      const mod = await Test.createTestingModule({
        imports: [
          RollbarModule.forRootAsync({
            useFactory: () => options,
          }),
        ],
      }).compile();

      const service = mod.get<Rollbar>(ROLLBAR_TOKEN);

      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(Rollbar);
    });
  });

  describe("useClass", () => {
    it("should be able to return an instance of Rollbar when the `useClass` option is used", async () => {
      const mod = await Test.createTestingModule({
        imports: [
          RollbarModule.forRootAsync({
            useClass: TestService,
          }),
        ],
      }).compile();

      const service = mod.get<Rollbar>(ROLLBAR_TOKEN);

      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(Rollbar);
    });
  });
});
