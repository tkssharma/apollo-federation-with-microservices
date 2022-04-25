// Internal.
import { AzureBlobModuleOptions } from "./azure-blob.interface";
import { AzureBlobService } from "./azure-blob.service";

// Code.
export const createAzureBlobClient = (
  options: AzureBlobModuleOptions
): AzureBlobService => new AzureBlobService(options);
