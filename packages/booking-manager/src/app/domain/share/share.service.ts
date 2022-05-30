import { Logger } from '@logger/logger';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { weekdays } from 'moment';

import { createQueryBuilder, In, Repository } from 'typeorm';
import { ShareStatus } from '../entity/home-shares.entity';
import { Share } from '../entity/shares.entity';
import { ShareDto } from './share.dto';


@Injectable()
export class ShareService {
  constructor(@InjectRepository(Share) private readonly shareRepository: Repository<Share>,
    private readonly logger: Logger
  ) {
  }

  async createShareForHome(data: ShareDto): Promise<Share> {
    return await this.shareRepository.save(data)
  }

  async addNewShareForHome(data: any): Promise<Share> {
    try {
      const { home_id, share_id } = data;
      const currentShares = await this.shareRepository.findOne({ where: { home_id, id: share_id } });
      if (currentShares) {
        return await this.shareRepository.save(
          {
            home_id: data.home_id,
            price: data.price,
            metadata: currentShares.metadata,
            initial_price: data.initial_price
          }
        )
      }
      throw new NotFoundException('We don not have saved shares for this Home')
    } catch (err) {
      throw err;
    }
  }
  async updateShareForHome(data: any): Promise<Share> {
    try {
      const { home_id, share_id } = data;
      const currentShares = await this.shareRepository.findOne({ where: { home_id, id: share_id } });
      if (currentShares) {
        return await this.shareRepository.save(
          {
            ...currentShares,
            ...data
          }
        )
      }
      throw new NotFoundException('We don not have saved shares for this Home')
    } catch (err) {
      throw err;
    }
  }
  async removeSharesForHome(data: any): Promise<Share | boolean> {
    try {
      const { home_id, share_ids } = data;
      const currentShares = await this.shareRepository.find({ where: { home_id, id: In(share_ids) } });
      if (currentShares && currentShares.length > 0) {
        for (const share of currentShares) {
          await this.shareRepository.delete(share.id)
        }
      }
      return true;
    } catch (err) {
      throw err;
    }
  }

  async getAllShareForHome(homeId: string) {
    return await this.shareRepository.find({ where: { home_id: homeId } });

  }
  async getActiveShareCountForHome(homeId: string) {
    const count = (await this.shareRepository.find({ where: { home_id: homeId } })).length;
    console.log(count)
    return { count }
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
