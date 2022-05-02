import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import intoStream = require('into-stream');
import { Repository } from 'typeorm';
import { UserMetaData } from '@auth/interface/user';
import {
  ContractByIdPathParams,
  CreateContractParams,
  SearchDtoParams,
  UpdateContractParams,
} from "./contract.dto";
import Contract, { ContractStatus } from './home.entity';
import ContractHelperService from './home-helper.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { differenceInCalendarDays } from 'date-fns';
import { Logger } from '@logger/logger';

export interface PurchaserContract extends CreateContractParams {
  organization_id?: string;
}
@Injectable()
export default class ContractService {

  constructor(
    @InjectRepository(Contract) private contractRepo: Repository<Contract>,
    private readonly contractHelperService: ContractHelperService,
    private eventEmitter: EventEmitter2,
    private readonly azureBlobService: BlobUploadService,
    private readonly logger: Logger,
  ) { }

  public async create(data: PurchaserContract, user: UserMetaData): Promise<Contract> {
    try {
      data.organization_id = user.organization_id;
      const contract = await this.contractRepo.save(data);
      this.eventEmitter.emit('contract.created', {
        user, contract
      });
      return contract;
    } catch (err) {
      this.logger.error(err as any);
      throw err;
    }
  }

  public async update(data: Partial<UpdateContractParams>, user: UserMetaData): Promise<Contract> {
    try {
      const { id } = data;
      const existingContract = await this.contractHelperService.validateAuthorization(id!, user);
      if (existingContract) {
        // check if you can activate a contract
        if (data.status === ContractStatus.ACTIVE) {
          const allowUpdate = this.allowActivateStatus(existingContract, data);
          if (!allowUpdate) {
            throw new BadRequestException('Status update as Active not allowed as contract has expired/end date')
          }
        }
        const saveEntity = { ...existingContract, ...data };
        if (data.status === ContractStatus.UNARCHIVE) {
          const nextStatus = this.calculateStatus(existingContract, data);
          saveEntity.status = nextStatus;
        }
        const contract = await this.contractRepo.save(saveEntity);
        if (existingContract.status !== data.status) {
          this.eventEmitter.emit('contract.statusChanged', {
            user: user, contract
          });
        }
        this.eventEmitter.emit('contract.updated', {
          user, contract
        });
        return contract;
      }
      throw new BadRequestException(`Contract not found with uuid ${id} or has been marked for deletion`);
    } catch (err) {
      this.logger.error(err as any);
      throw err;
    }
  }
  public calculateStatus(contract: Contract, data: Partial<UpdateContractParams>) {
    if (data.ends_at) {
      if (differenceInCalendarDays(new Date(data.ends_at), new Date()) > 0) {
        return ContractStatus.ACTIVE;
      } else {
        return ContractStatus.INACTIVE;
      }
    }
    if (contract.ends_at) {
      if (differenceInCalendarDays(new Date(contract.ends_at), new Date()) > 0) {
        return ContractStatus.ACTIVE;
      } else {
        return ContractStatus.INACTIVE;
      }
    }
    return ContractStatus.INACTIVE;
  }
  public allowActivateStatus(contract: Contract, data: Partial<UpdateContractParams>) {
    if (data.ends_at) {
      if (differenceInCalendarDays(new Date(data.ends_at), new Date()) > 0) {
        return true;
      } else {
        return false;
      }
    }
    if (contract.ends_at) {
      if (differenceInCalendarDays(new Date(contract.ends_at), new Date()) > 0) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }

  public async delete(data: ContractByIdPathParams, user: UserMetaData): Promise<Contract> {
    try {
      const { id } = data;
      const existingContract = await this.contractHelperService.validateAuthorization(id, user);
      if (!existingContract) {
        throw new BadRequestException(`Contract not found with uuid ${id}`);
      }
      existingContract.is_deleted = true;
      return await this.contractRepo.save(existingContract);
    } catch (err) {
      this.logger.error(err as any);
      throw err;
    }
  }

  public async getById(data: ContractByIdPathParams, user: UserMetaData): Promise<Contract> {
    try {
      const { id } = data;
      return await this.contractHelperService.validateAuthorization(id, user);
    } catch (err) {
      this.logger.error(err as any);
      throw err;
    }
  }

  public async listAll(user: UserMetaData, filter: SearchDtoParams): Promise<Contract[]> {
    try {
      const { contracts } = await this.contractHelperService.SearchQueryBuilder(filter, user)
      return contracts
    } catch (err: any) {
      this.logger.error(err as any);
      throw new InternalServerErrorException(err.message);
    }
  }

  public async upload(file: Express.Multer.File): Promise<any> {
    try {
      const safeFilename = file.originalname.replace(/[^a-zA-Z0-9.]/g, '');
      const uploadedFileUrl = await this.azureBlobService.uploadToAzure(
        safeFilename,
        file.mimetype,
        intoStream(file.buffer));
      this.logger.log(`saving uploaded file on azure to Table ${safeFilename}`);
      return { document: uploadedFileUrl, document_originalname: safeFilename };
    } catch (err) {
      this.logger.error(err as any);
      throw err;
    }
  }

  public async download(user: UserMetaData, params: ContractByIdPathParams): Promise<any> {
    try {
      const { id } = params;
      const contract = await this.contractHelperService.validateAuthorization(id, user);
      this.logger.log(`download file ${contract.document}`);
      if (contract.document) {
        const document = await this.azureBlobService.downloadFromAzure(contract.document);
        return {
          document,
          document_originalname: contract.document_originalname,
        };
      }
      throw new NotFoundException(`Document not found for this Contract, please upload first ${id}`);
    } catch (err) {
      this.logger.error(err as any);
      throw err;
    }
  }
}
