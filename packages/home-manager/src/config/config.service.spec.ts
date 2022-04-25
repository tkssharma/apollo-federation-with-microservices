import 'jest';
import { DEFAULT_CONFIG } from './config.default';
import { ConfigData, ConfigDBData } from './config.interface';
import { ConfigService } from './config.service';

const MOCK_DB_CONFIG: ConfigDBData = {
  url: 'postgres://test:test@postgres:5432/postgres',
};

const MOCK_CONFIG: ConfigData = {
  env: 'testenv',
  db: MOCK_DB_CONFIG,
  port: 3000,
  logLevel: 'testloglevel',
  platformApis: {
    token: '',
    baseUrl: '',
  },
  swagger: {
    username: '',
    password: '',
  },
  auth: {
    jwksuri: '',
    audience: '',
    tokenIssuer: '',
    authProvider: 'auth0',
  }
};

const ALL_ENV_KEYS = [
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'DB_HOST',
  'DB_DIALECT',
  'NODE_ENV',
  'ENVIRONMENT',
  'LOG_LEVEL',
  'NEW_RELIC_KEY',
];

describe('ConfigService', () => {
  let config: ConfigService;
  beforeEach(() => {
    for (const key of ALL_ENV_KEYS) {
      delete process.env[key];
    }
    config = new ConfigService();
  });

  describe('constructor', () => {
    it('should use default config if parameterless', () => {
      expect(config.get()).toStrictEqual(DEFAULT_CONFIG);
    });

    it('should use passed config', () => {
      config = new ConfigService(MOCK_CONFIG);
      expect(config.get()).toStrictEqual(MOCK_CONFIG);
    });
  });

  describe('loadFromEnv', () => {
    it('should use defaults when env vars are missing', () => {
      config.loadFromEnv();
      expect(config.get().db).toStrictEqual({
        ...DEFAULT_CONFIG.db,
      });
    });

    it('should load base config properties from environment', () => {
      process.env.NODE_ENV = MOCK_CONFIG.env;
      process.env.LOG_LEVEL = MOCK_CONFIG.logLevel;
      process.env.PORT = MOCK_CONFIG.port + '';
      process.env.AUTH_PROVIDER = MOCK_CONFIG.auth.authProvider;
      process.env.AUTH0_JWKS_URL = MOCK_CONFIG.auth.jwksuri;
      process.env.AUTH0_TOKEN_ISSUER_URL = MOCK_CONFIG.auth.tokenIssuer;

      config.loadFromEnv();
      expect(config.get()).toStrictEqual({
        ...DEFAULT_CONFIG,
        db: {
          ...DEFAULT_CONFIG.db,
        },
        env: MOCK_CONFIG.env,
        logLevel: MOCK_CONFIG.logLevel,
      } as ConfigData);
    });

    it('should load database config properties from environment', () => {
      process.env.DATABASE_URL = MOCK_DB_CONFIG.url;

      config.loadFromEnv();
      expect(config.get().db).toStrictEqual(MOCK_DB_CONFIG);
    });
  });
});
