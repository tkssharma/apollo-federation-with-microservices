import { Inject } from "@nestjs/common";
import { S3_CLIENT_TOKEN } from "./aws-s3.constants";

export function InjectS3Client() {
  return Inject(S3_CLIENT_TOKEN);
}
