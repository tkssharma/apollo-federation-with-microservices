// Package.
import * as AzureBlob from "@azure/storage-blob";

// Internal.
import { Inject } from "@nestjs/common";
import { AZUREBLOB_MODULE_OPTIONS } from "./azure-blob.constants";
import { AzureBlobModuleOptions } from "./azure-blob.interface";

export interface DownloadParams {
  bucket: string;
  key: string;
}

export interface DownloadResponse {
  url: string;
  azureBlobRes: AzureBlob.BlobDownloadResponseParsed;
}

export interface UploadParams {
  bucket: string;
  key: string;
  content: unknown;
  mimeType: any;
}

export interface UploadResponse {
  url: string;
  azureBlobRes: AzureBlob.BlobUploadCommonResponse;
}

export class AzureBlobService {
  private readonly client: AzureBlob.BlobServiceClient;

  constructor(
    @Inject(AZUREBLOB_MODULE_OPTIONS)
    private readonly options: AzureBlobModuleOptions
  ) {
    this.client = AzureBlob.BlobServiceClient.fromConnectionString(
      this.options.connectionString
    );
  }

  async upload({ bucket, key, content, mimeType }: UploadParams) {
    const body = this.prepareBody(content);
    const containerClient = this.client.getContainerClient(bucket);
    const blockBlobClient = containerClient.getBlockBlobClient(key);

    const url = blockBlobClient.url;
    const res = await blockBlobClient.uploadData(Buffer.from(body), {
      blobHTTPHeaders: { blobContentType: mimeType },
    });

    return {
      url,
      azureBlobRes: res,
    };
  }

  async download({ bucket, key }: DownloadParams) {
    const containerClient = this.client.getContainerClient(bucket);
    const blockBlobClient = containerClient.getBlockBlobClient(key);

    const url = blockBlobClient.url;
    const res = await blockBlobClient.download(0);

    return {
      url,
      azureBlobRes: res,
    };
  }

  private prepareBody(content: unknown) {
    if (!content) {
      throw new Error("Unable to process content");
    }

    switch (typeof content) {
      case "object":
        return JSON.stringify(content) as string;
      case "bigint":
      case "boolean":
      case "number":
      case "string":
        return `${content}`;
      default:
        throw new Error("Unsupported data type");
    }
  }
}
