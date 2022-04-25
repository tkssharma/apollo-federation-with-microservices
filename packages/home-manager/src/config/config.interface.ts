/**
 * Configuration for the database connection.
 */
export interface ConfigDBData {
  url?: string;
}
export interface FileUpload {
  connectionString?: string;
  containerName?: string;
}
export interface KafkaConfig {
  confluentEnabled: boolean;
  confluentBootstrapServers: string;
  confluentSaslMechanism?: string;
  confluentSaslUserName: string;
  confluentSaslPassword: string;
  confluentClientId?: string;
  groupId: string,
  topicToConsume: string;
}
export interface PlatformAPIs {
  baseUrl: string;
  token: string;
}
export interface SwaggerUserConfig {
  username?: string;
  password?: string;
}

export interface AzureConfig {
  fileUpload: FileUpload;
}
export interface ConfigAuthData {
  /** The JWKS URI to use. */
  jwksuri: string;

  /** The Auth audience to use. */
  audience?: string;

  /** The Auth token Issuer to use. */
  tokenIssuer: string;

  /** The Auth provider Issuer to use. */
  authProvider: string;
}

export interface ConfigAuthorizationData {
  baseUrl: string;
  serviceClientToken: string;
}

export interface Notifications {
  baseUrl: string;
  token: string;
}

export interface HelloSignConfig {
  helloSignAPIKey?: string;
  helloSignClientToken?: string;
}

/**
 * Configuration data for the app.
 */
export interface ConfigData {
  /**
   * The name of the environment.
   * @example 'production'
   */
  env: string;

  port: number;

  auth: ConfigAuthData;

  /** Database connection details. */
  db: ConfigDBData;

  swagger: SwaggerUserConfig;

  platformApis: PlatformAPIs;

  /**
   * The log level to use.
   * @example 'verbose', 'info', 'warn', 'error'
   */
  logLevel: string;
}
