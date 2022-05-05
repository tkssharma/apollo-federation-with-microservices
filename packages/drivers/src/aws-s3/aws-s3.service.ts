// Package.
import { Inject } from "@nestjs/common";
import { S3 } from "aws-sdk";
import * as moment from "moment";
// Internal.
import { S3_CLIENT_MODULE_OPTIONS } from "./aws-s3.constants";
import { S3ClientModuleOptions } from "./aws-s3.interface";

export class S3ClientService {
  private readonly accessKeyId: string = "";
  private readonly secretAccessKey: string = "";
  private readonly bucketName: string = "";
  private client: AWS.S3;

  constructor(
    @Inject(S3_CLIENT_MODULE_OPTIONS)
    private readonly options: S3ClientModuleOptions
  ) {
    this.accessKeyId = this.options.accessKeyId;
    this.secretAccessKey = this.options.secretAccessKey;
    this.bucketName = this.options.bucketName;
    this.client = new S3({
      region: "eu-central-1",
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey!,
      },
    });
  }

  async upload(file: any, key: string, originalname: string) {
    const params = {
      Bucket: this.bucketName,
      Key: key,
      Body: file,
    };
    const uploadResponse = await this.client.upload(params).promise();

    const url = await this.getPresignedUrl(key, originalname);
    return { ...uploadResponse, url };
  }

  async get(bucket: string, key: string) {
    const params = {
      Bucket: bucket,
      Key: key,
    };
    return await this.client.getObject(params).promise();
  }

  async getPresignedUrl(key: string, originalname: string) {
    const params = {
      Bucket: this.bucketName,
      Key: key,
      Expires: 60 * 60 * 24 * 7,
      ResponseContentDisposition:
        'attachment; filename ="' + originalname + '"',
    };
    return await this.client.getSignedUrlPromise("getObject", params);
  }

  async isPreSignedUrlExpired(url: string) {
    const parsedUrl = new URL(url);
    // get access to URLSearchParams object
    const search_params = parsedUrl.searchParams;

    if (!search_params.has("X-Amz-Expires")) {
      return true;
    }
    const urlGeneratedDate = search_params.get("X-Amz-Date");
    const parsedGeneratedDate = moment(urlGeneratedDate, "YYYYMMDDTHHmmssZ");
    const expirationTime = search_params.get("X-Amz-Expires") || "";

    const expirationDate = parsedGeneratedDate.add(
      parseInt(expirationTime),
      "seconds"
    );
    return moment().isAfter(expirationDate);
  }
}
