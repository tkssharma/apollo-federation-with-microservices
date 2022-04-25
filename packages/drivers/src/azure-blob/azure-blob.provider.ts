// Package.
import { Provider } from "@nestjs/common";

// Internal.
import { AzureBlobModuleOptions } from "./azure-blob.interface";
import { AZUREBLOB_TOKEN } from "./azure-blob.constants";
import { createAzureBlobClient } from "./utils";

// Code.
export function createAzureBlobProviders(
  options: AzureBlobModuleOptions
): Provider {
  return {
    provide: AZUREBLOB_TOKEN,
    useValue: createAzureBlobClient(options),
  };
}
