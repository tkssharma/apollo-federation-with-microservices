import { Injectable } from '@nestjs/common';
import { urlJoin } from 'url-join-ts';
import { DEFAULT_CONFIG } from './config.default';
import { ConfigAuthData, ConfigData, ConfigDBData, SendGridConfig, SwaggerUserConfig, TwilioConfig } from './config.interface';


/**
 * Provides a means to access the application configuration.
 */
@Injectable()
export class ConfigService {
  private config: ConfigData;

  constructor(data: ConfigData = DEFAULT_CONFIG) {
    this.config = data;
  }

  /**
   * Loads the config from environment variables.
   */
  public loadFromEnv() {
    this.config = this.parseConfigFromEnv(process.env);
  }

  private parseConfigFromEnv(env: NodeJS.ProcessEnv): ConfigData {
    return {
      env: env.NODE_ENV || DEFAULT_CONFIG.env,
      port: parseInt(env.PORT!, 10),
      db: this.parseDbConfigFromEnv(env, DEFAULT_CONFIG.db),
      logLevel: env.LOG_LEVEL || DEFAULT_CONFIG.logLevel,
      newRelicKey: env.NEW_RELIC_KEY || DEFAULT_CONFIG.newRelicKey,
      auth: this.parseAuthConfigFromEnv(env),
      swagger: this.parseSwaggerConfigFromEnv(env, DEFAULT_CONFIG.swagger),
      sendGrid: this.parseSendGridConfigFromEnv(env)
    };
  }

  private parseAuthConfigFromEnv(env: NodeJS.ProcessEnv): ConfigAuthData {
    return {
      authProvider: env.AUTH_PROVIDER || DEFAULT_CONFIG.auth.authProvider,
      authSecret: env.AUTH_SECRET || DEFAULT_CONFIG.auth.authSecret
    };
  }

  private parseSendGridConfigFromEnv(env: NodeJS.ProcessEnv): SendGridConfig {
    return {
      apiKey: env.SENDGRID_API_KEY || '',
      verifiedEmail: env.SENDGRID_VERIFIED_SENDER_EMAIL || ''
    };
  }

  private parseSwaggerConfigFromEnv(env: NodeJS.ProcessEnv, defaultConfig: Readonly<SwaggerUserConfig>): SwaggerUserConfig {
    return {
      username: env.SWAGGER_USERNAME || defaultConfig.username,
      password: env.SWAGGER_PASSWORD || defaultConfig.password,
    };
  }

  private parseDbConfigFromEnv(env: NodeJS.ProcessEnv, defaultConfig: Readonly<ConfigDBData>): ConfigDBData {
    return {
      url: env.DATABASE_URL || defaultConfig.url,
    };
  }


  /**
   * Retrieves the config.
   * @returns immutable view of the config data
   */
  public get(): Readonly<ConfigData> {
    return this.config;
  }
}
