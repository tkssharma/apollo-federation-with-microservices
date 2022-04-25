// Package.
import { Test, TestingModule } from "@nestjs/testing";
import { Injectable } from "@nestjs/common";

// Internal.
import { InjectAzureBlob } from "../azure-blob.decorator";
import { AzureBlobService } from "../azure-blob.service";
import { AzureBlobModule } from "../azure-blob.module";
import { AzureBlobModuleOptions } from "../azure-blob.interface";

// Code.
describe("InjectAzureBlob", () => {
  const options: AzureBlobModuleOptions = {
    connectionString:
      "DefaultEndpointsProtocol=https;AccountName=test;AccountKey=key;EndpointSuffix=core.windows.net",
  };

  let module: TestingModule;

  @Injectable()
  class InjectableService {
    public constructor(
      @InjectAzureBlob() public readonly client: AzureBlobService
    ) {}
  }

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AzureBlobModule.forRoot(options)],
      providers: [InjectableService],
    }).compile();
  });

  describe("constructor", () => {
    it("should inject the azure-blob client when decorating a class constructor parameter", () => {
      const testService = module.get(InjectableService);
      expect(testService).toHaveProperty("client");
      expect(testService.client).toBeInstanceOf(AzureBlobService);
    });
  });
});
