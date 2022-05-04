import { Injectable, LogLevel } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as Joi from 'joi';
import { IsEnum, IsNumber, validateSync } from 'class-validator';

export interface EnvConfig {
  [key: string]: string;
}

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(filePath: string) {
    let file: Buffer | undefined;
    try {
      file = fs.readFileSync(filePath);
    } catch (error) {
      file = fs.readFileSync('.env');
    }

    const config = dotenv.parse(file);
    this.envConfig = config;
  }

  get databaseUrl(): string {
    return this.envConfig.DATABASE_URL
  }
  get port(): number {
    return Number(this.envConfig.PORT)
  }
  get env(): string {
    return this.envConfig.NODE_ENV;
  }
  get logLevel(): string {
    return this.envConfig.LOG_LEVEL
  }
}
