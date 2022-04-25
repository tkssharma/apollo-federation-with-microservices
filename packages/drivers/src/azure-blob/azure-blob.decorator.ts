import { Inject } from "@nestjs/common";
import { AZUREBLOB_TOKEN } from "./azure-blob.constants";

export function InjectAzureBlob() {
  return Inject(AZUREBLOB_TOKEN);
}
