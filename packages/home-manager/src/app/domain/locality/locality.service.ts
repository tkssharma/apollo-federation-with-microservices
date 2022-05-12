import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Homes } from '../entity/home.entity';
import { HomeLocality } from '../entity/home-locality.entity';
import { CreateHomeLocalityDto } from './locality.dto';
import { GetLocalityArgs } from './arg/locality.args';
import { Logger } from '@logger/logger';


@Injectable()
export class HomeLocalityService {
  constructor(
    @InjectRepository(HomeLocality) private readonly homeLocalityRepository: Repository<HomeLocality>,
    private readonly logger: Logger
  ) {
  }

  async createHomeLocality(data: any, userId: string): Promise<HomeLocality> {
    const body = data.payload;
    try {
      return await this.homeLocalityRepository
        .save({ ...body, user_id: userId, name: "ff" });
    } catch (err: any) {
      this.logger.error(err);
      throw err;
    }
  }


  async updateHomeLocality(id: string, data: any): Promise<HomeLocality> {
    const body = data.payload;
    const homeLocality = await this.homeLocalityRepository.findOne({ where: { id } });
    const updatedLocality = { ...homeLocality, ...body }
    return await this.homeLocalityRepository.save(updatedLocality)
  }

  async listAll() {
    return await this.homeLocalityRepository.find({});
  }

  async getLocalityById(id: string) {
    return await this.homeLocalityRepository.findOne({ where: { id } });
  }
}
