import { BadRequestException, Injectable } from '@nestjs/common';
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
    @InjectRepository(Homes) private readonly homeRepository: Repository<Homes>,
    private readonly logger: Logger
  ) {
  }

  async createHomeLocality(data: any, userId: string): Promise<HomeLocality> {
    const body = data.payload;
    try {
      const homes = await this.homeRepository.findOne({ where: { id: body.home_id } });
      return await this.homeLocalityRepository
        .save({ ...body, user_id: userId, name: "OK", homes });
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

  async addLocalityToHome(locality_id: string, home_id: string): Promise<HomeLocality> {
    const homeLocality = await this.homeLocalityRepository.findOne({ where: { id: locality_id } });
    const home = await this.homeRepository.findOne({ where: { id: home_id } });
    if (!(home && homeLocality)) {
      throw new BadRequestException();
    }
    if (homeLocality.homes) {
      return homeLocality;
    }
    homeLocality.homes = home;
    return await this.homeLocalityRepository.save(homeLocality);
  }

  async listAll() {
    return await this.homeLocalityRepository.find({});
  }

  async getLocalityById(id: string) {
    return await this.homeLocalityRepository.findOne({ where: { id } });
  }
}
