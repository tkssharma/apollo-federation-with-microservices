// Package.
import axios from "axios";
import { Inject } from "@nestjs/common";

// Internal.
import { PLATFORM_CLIENT_MODULE_OPTIONS } from "./platform-client.constants";
import { PlatformClientModuleOptions } from "./platform-client.interface";

export class PlatformClientService {
  private readonly apiUrl: string = "";
  private readonly apiKey: string = "";

  constructor(
    @Inject(PLATFORM_CLIENT_MODULE_OPTIONS)
    private readonly options: PlatformClientModuleOptions
  ) {
    this.apiUrl = this.options.apiUrl;
    this.apiKey = this.options.apiKey;
  }

  public async healthCheck(bearer: string) {
    return axios({
      method: "GET",
      url: `${this.apiUrl}/health`,
      headers: {
        authorization: `Bearer ${bearer}`,
        "x-api-token": this.apiKey,
      },
    });
  }
}
