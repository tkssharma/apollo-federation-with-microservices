import { Logger } from '@logger/logger';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Share, ShareStatus } from '../entity/shares.entity';
import { ShareDto } from './share.dto';


@Injectable()
export class ShareService {
  constructor(@InjectRepository(Share) private readonly shareRepository: Repository<Share>,
    private readonly logger: Logger
  ) {
  }

  async buyCustomerShareForHome(data: ShareDto): Promise<Share> {
    try {
      const { user_id, home_id, quantity } = data;
      const currentShares = await this.shareRepository.findOne({ where: { user_id, home_id } });
      if (currentShares) {
        throw new ConflictException('Shares already assigned for this Customer, only update shares allowed')
      }
      return await this.shareRepository
        .save({ ...data });
    } catch (err: any) {
      this.logger.error(err);
      throw err;
    }
  }

  async updateCustomerShareForHome(data: ShareDto): Promise<Share> {
    const { user_id, home_id, quantity } = data;
    const currentShares = await this.shareRepository.findOne({ where: { user_id, home_id } });
    if (currentShares) {
      currentShares.quantity = quantity
      return await this.shareRepository.save(currentShares)
    }
    throw new NotFoundException()
  }

  async removeCustomerShareForHome(data: ShareDto): Promise<Share> {
    const { user_id, home_id, quantity } = data;
    const currentShares = await this.shareRepository.findOne({ where: { user_id, home_id } });
    if (currentShares) {
      currentShares.quantity = 0;
      currentShares.status = ShareStatus.in_active
      return await this.shareRepository.save(currentShares)
    }
    throw new NotFoundException()
  }

  async getAllShareForCustomer(id: string) {
    const data = await this.shareRepository.findOne({ where: { user_id: id } });
    return { shares: data };
  }

  async getAllCustomersForHome(id: string) {
    const data = await this.shareRepository.findOne({ where: { home_id: id } });
    return { customers: data };
  }

  async getById(id: string) {
    const data = await this.shareRepository.findOne({ where: { id } });
    return data;
  }

  async listAll() {
    const data = await this.shareRepository.find({});
    return data;
  }
}
