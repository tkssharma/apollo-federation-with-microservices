import { Logger } from '@logger/logger';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { createQueryBuilder, Repository } from 'typeorm';
import { HomeShare, ShareStatus } from '../entity/home-shares.entity';
import { Share } from '../entity/shares.entity';
import { ShareDto } from './home-share.dto';


@Injectable()
export class ShareService {
  constructor(
    @InjectRepository(HomeShare) private readonly homeShareRepository: Repository<HomeShare>,
    @InjectRepository(Share) private readonly shareRepository: Repository<Share>,
    private readonly logger: Logger
  ) {
  }

  async buyCustomerShareForHome(data: ShareDto): Promise<HomeShare> {
    try {
      const { user_id, home_id, quantity } = data;
      const currentShares = await this.homeShareRepository.findOne({ where: { user_id, home_id } });
      if (currentShares) {
        throw new ConflictException('Shares already assigned for this Customer, only update shares allowed')
      }
      return await this.homeShareRepository
        .save({ ...data });
    } catch (err: any) {
      this.logger.error(err);
      throw err;
    }
  }

  async updateCustomerShareForHome(data: ShareDto): Promise<HomeShare> {
    const { user_id, home_id, quantity } = data;
    const currentShares = await this.homeShareRepository.findOne({ where: { user_id, home_id } });
    if (currentShares) {
      return await this.homeShareRepository.save(currentShares)
    }
    throw new NotFoundException()
  }

  async removeCustomerShareForHome(data: ShareDto): Promise<HomeShare> {
    const { user_id, home_id, quantity } = data;
    const currentShares = await this.homeShareRepository.findOne({ where: { user_id, home_id } });
    if (currentShares) {
      currentShares.status = ShareStatus.in_active
      return await this.homeShareRepository.save(currentShares)
    }
    throw new NotFoundException()
  }

  async getAllShareForCustomer(id: string) {
    const data = await this.homeShareRepository.find({ where: { user_id: id } });
    return data
  }

  async getAllCustomersForHome(id: string) {
    const data = await this.homeShareRepository.find({ where: { home_id: id } });
    return data;
  }
  async getAllActiveCustomers() {
    return await this.homeShareRepository.find({ where: {} });

  }

  async getById(id: string) {
    const data = await this.homeShareRepository.findOne({ where: { id } });
    return data;
  }

  async getShareById(id: string) {
    const data = await this.shareRepository.findOne({ where: { id } });
    return data;
  }

  async listAll() {
    const data = await this.homeShareRepository.find({});
    return data;
  }
}
