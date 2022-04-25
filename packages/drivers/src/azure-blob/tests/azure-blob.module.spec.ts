// Package.
import { Test } from "@nestjs/testing";

// Internal.
import { AzureBlobModule } from "../azure-blob.module";
import { AzureBlobService } from "../azure-blob.service";
import {
  AzureBlobModuleOptions,
  AzureBlobOptionsFactory,
} from "../azure-blob.interface";
import { AZUREBLOB_TOKEN } from "../azure-blob.constants";

// Code.
describe("AzureBlobModule", () => {
  const options: AzureBlobModuleOptions = {
    connectionString:
      "DefaultEndpointsProtocol=https;AccountName=test;AccountKey=key;EndpointSuffix=core.windows.net",
  };

  class TestService implements AzureBlobOptionsFactory {
    createAzureBlobOptions(): AzureBlobModuleOptions {
      return options;
    }
  }

  describe("forRoot", () => {
    it("should be able to return an instance of AzureBlobService", async () => {
      const moduleRef = await Test.createTestingModule({
        imports: [AzureBlobModule.forRoot(options)],
      }).compile();

      const service = moduleRef.get<AzureBlobService>(AZUREBLOB_TOKEN);

      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(AzureBlobService);
    });
  });

  describe("forRootAsync", () => {
    it("should be able to return an instance of AzureBlobService when the `useFactory` option is used", async () => {
      const mod = await Test.createTestingModule({
        imports: [
          AzureBlobModule.forRootAsync({
            useFactory: () => options,
          }),
        ],
      }).compile();

      const service = mod.get<AzureBlobService>(AZUREBLOB_TOKEN);

      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(AzureBlobService);
    });
  });

  describe("useClass", () => {
    it("should be able to return an instance of AzureBlobService when the `useClass` option is used", async () => {
      const mod = await Test.createTestingModule({
        imports: [
          AzureBlobModule.forRootAsync({
            useClass: TestService,
          }),
        ],
      }).compile();

      const service = mod.get<AzureBlobService>(AZUREBLOB_TOKEN);

      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(AzureBlobService);
    });
  });
});
