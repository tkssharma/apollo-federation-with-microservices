import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CsvDataTemplate } from '../shared/interface/csv-data-template';
const csv = require('fast-csv');
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserMetaData } from '@auth/interface/user';
import { CreateContractParams } from './contract.dto';
import Contract from './home.entity';
import ContractHelperService from './home-helper.service';
import ContractService from './home.service';


export interface ErrorPayload {
  row?: number;
  message?: string;
}

@Injectable()
export default class ContractUploadService {
  private readonly logger = new Logger(ContractUploadService.name);
  constructor(
    private eventEmitter: EventEmitter2,
    private readonly contractService: ContractService,
    private readonly contractHelperService: ContractHelperService,
    @InjectRepository(Contract) private userSupplierRepo: Repository<Contract>,

  ) { }

  public async create(readStream: ReadableStream, user: UserMetaData): Promise<any> {
    try {
      // extract csv data
      const contracts = await this.extractCsvData(readStream);
      // validate csv rows with class-validator
      const { payload, errorPayload } = await this.extractRequestPayload(contracts);
      if (errorPayload.length > 0) {
        throw new BadRequestException(errorPayload);
      }
      this.logger.log('done [extractRequestPayload] after csv validation');
      // process each and every profiles
      this.eventEmitter.emit('process.csv', { payload, user });
      return;
    } catch (err: any) {
      if (err instanceof BadRequestException || err instanceof NotFoundException
        || err instanceof UnauthorizedException) {
        throw err;
      }
      throw new InternalServerErrorException(err.message);
    }
  }

  @OnEvent('process.csv')
  public async processCsvRecords({ payload, user }: any) {
    try {
      this.logger.log('handling process.csv Event after authorization check');
      for (const contract of payload) {
        await this.contractService.create(contract, user);
        // 🎉  we are done 🎉
      }
    } catch (err) {
      throw err;
    }
  }

  public async extractCsvData(readStream: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const profiles: CsvDataTemplate[] = [];
      readStream.pipe(csv.parse({ headers: true }))
        .on('error', (error: any) => {
          reject(error);
        })
        .on('data', (row: CsvDataTemplate) => {
          profiles.push(row);
        })
        .on('end', () => {
          resolve(profiles);
        });
    });
  }
  public async extractRequestPayload(contracts: CsvDataTemplate[]): Promise<{
    [key: string]:
    CreateContractParams[] | ErrorPayload[],
  }> {
    const payload = [];
    const errorPayload = [];
    try {
      for (const [i, contract] of contracts.entries()) {
        const request: any = await this.contractHelperService.
          transformAndValidateProfile(contract);
        const validation = await this.contractHelperService.validate(request);
        // tslint:disable-next-line:early-exit
        if (!validation) {
          payload.push(request);
        } else {
          errorPayload.push({
            row: i + 1,
            message: validation,
          });
        }
      }
      return { payload, errorPayload };
    } catch (err) {
      throw err;
    }
  }
}
