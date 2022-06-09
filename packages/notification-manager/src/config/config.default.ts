import { ConfigData } from './config.interface';

// tslint:disable:no-hardcoded-credentials

export const DEFAULT_CONFIG: ConfigData = {
  env: 'production',
  db: {
    url: process.env.DATABASE_URL,
  },
  port: 3000,
  swagger: {
    username: '',
    password: '',
  },
  auth: {
    authProvider: 'auth0',
    authSecret: ''
  },
  sendGrid: {
    apiKey: '',
    verifiedEmail: ''
  },
  logLevel: 'info',
  newRelicKey: '',
};
