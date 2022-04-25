// Native.
import { Readable } from "stream";

// Package.
import { Test } from "@nestjs/testing";
import * as AzureBlob from "@azure/storage-blob";

// Internal.
import { AzureBlobService } from "../azure-blob.service";
import { AzureBlobModule } from "../azure-blob.module";
import { AZUREBLOB_TOKEN } from "../azure-blob.constants";

// Code.
describe("AzureBlobService", () => {
  let service: AzureBlobService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        AzureBlobModule.forRoot({
          connectionString:
            "DefaultEndpointsProtocol=https;AccountName=test;AccountKey=key;EndpointSuffix=core.windows.net",
        }),
      ],
    }).compile();

    service = moduleRef.get<AzureBlobService>(AZUREBLOB_TOKEN);
  });

  describe("upload", () => {
    it("should throw an Error for unsupported content data types", async () => {
      await expect(
        service.upload({
          bucket: "bucket",
          key: "file.html",
          content: undefined,
          mimeType: "text/json" as any,
        })
      ).rejects.toThrowError();
    });

    it("should throw an Error in the case that AzureBlob client is not able to handle the request", async () => {
      jest
        .spyOn(AzureBlob.BlockBlobClient.prototype, "upload")
        .mockImplementation(() => Promise.reject(new Error("__FAIL__")));

      await expect(
        service.upload({
          bucket: "bucket",
          key: "file.json",
          content: { foo: "bar" },
          mimeType: "text/json",
        })
      ).rejects.toThrowError();
    });

    it("should return the url where the file is stored and the azure response", async () => {
      const mockAzureBlobUploadRes: AzureBlob.BlobUploadCommonResponse = {
        _response: {} as any,
        clientRequestId: "",
        contentMD5: Buffer.from([]),
        date: new Date(0),
        encryptionKeySha256: "",
        errorCode: "",
        encryptionScope: "",
        etag: "",
        isServerEncrypted: true,
      };

      jest
        .spyOn(AzureBlob.BlockBlobClient.prototype, "uploadData")
        .mockImplementation(() => Promise.resolve(mockAzureBlobUploadRes));

      await expect(
        service.upload({
          bucket: "bucket",
          key: "sample.png",
          content: Buffer.from([]),
          mimeType: "image/png",
        })
      ).resolves.toEqual({
        url: "https://test.blob.core.windows.net/bucket/sample.png",
        azureBlobRes: mockAzureBlobUploadRes,
      });
    });

    it("should work for any file mime type", async () => {
      const mockAzureBlobUploadRes: AzureBlob.BlobUploadCommonResponse = {
        _response: {} as any,
        clientRequestId: "",
        contentMD5: Buffer.from([]),
        date: new Date(0),
        encryptionKeySha256: "",
        errorCode: "",
        encryptionScope: "",
        etag: "",
        isServerEncrypted: true,
      };

      jest
        .spyOn(AzureBlob.BlockBlobClient.prototype, "uploadData")
        .mockImplementation(() => Promise.resolve(mockAzureBlobUploadRes));

      await expect(
        service.upload({
          bucket: "bucket",
          key: "sample.zip",
          content: Buffer.from([]),
          mimeType: "application/zip",
        })
      ).resolves.toEqual({
        url: "https://test.blob.core.windows.net/bucket/sample.zip",
        azureBlobRes: mockAzureBlobUploadRes,
      });
    });
  });

  describe("download", () => {
    it("should throw an Error in the case that AzureBlob client is not able to handle the request", async () => {
      jest
        .spyOn(AzureBlob.BlockBlobClient.prototype, "download")
        .mockImplementation(() => Promise.reject(new Error("__FAIL__")));

      await expect(
        service.download({ bucket: "bucket", key: "file.json" })
      ).rejects.toThrowError();
    });

    it("should return the url of the file to pull and the azure blob response", async () => {
      const mockAzureBlobDownloadRes: AzureBlob.BlobDownloadResponseParsed = {
        _response: {} as any,
        acceptRanges: "",
        readableStreamBody: new Readable(),
      };

      jest
        .spyOn(AzureBlob.BlockBlobClient.prototype, "download")
        .mockImplementation(() => Promise.resolve(mockAzureBlobDownloadRes));

      await expect(
        service.download({ bucket: "bucket", key: "file.json" })
      ).resolves.toEqual({
        url: "https://test.blob.core.windows.net/bucket/file.json",
        azureBlobRes: mockAzureBlobDownloadRes,
      });
    });
  });
});
