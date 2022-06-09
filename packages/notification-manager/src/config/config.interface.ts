/**
 * Configuration for the database connection.
 */
export interface ConfigDBData {
  url?: string;
}

export interface SwaggerUserConfig {
  username?: string;
  password?: string;
}
export interface TwilioConfig {
  serviceId: string;
  accountId: string;
  apiKey: string;
  apiSecret: string;
  authToken: string;
}

export interface ConfigAuthData {

  /** The Auth provider Issuer to use. */
  authProvider: string;

  authSecret: string;
}

export interface SendGridConfig {
  apiKey: string;
  verifiedEmail: string;
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

  sendGrid: SendGridConfig;
  /**
   * The log level to use.
   * @example 'verbose', 'info', 'warn', 'error'
   */
  logLevel: string;

  /** The New Relic key to use. */
  newRelicKey?: string;
}
