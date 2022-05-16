import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Homes } from '../entity/home.entity';
import { HomeFacility } from '../entity/home-Facility.entity';
import { CreateHomeFacilityDto } from './facility.dto';
import { Logger } from '@logger/logger';


@Injectable()
export class HomeFacilityService {
  constructor(
    @InjectRepository(HomeFacility) private readonly homeFacilityRepository: Repository<HomeFacility>,
    @InjectRepository(Homes) private readonly homeRepository: Repository<Homes>,
    private readonly logger: Logger
  ) {
  }

  async createHomeFacility(data: any, userId: string): Promise<HomeFacility> {
    const body = data.payload;
    try {
      const homes = await this.homeRepository.findOne({ where: { id: body.home_id } });
      return await this.homeFacilityRepository
        .save({ ...body, homes, user_id: userId });
    } catch (err: any) {
      this.logger.error(err);
      throw err;
    }
  }

  async addFacilityToHome(facility_id: string, home_id: string): Promise<HomeFacility> {
    const homeFacility = await this.homeFacilityRepository.findOne({ where: { id: facility_id } });
    const home = await this.homeRepository.findOne({ where: { id: home_id } });
    if (!(home && homeFacility)) {
      throw new BadRequestException();
    }
    homeFacility.homes = home;
    return await this.homeFacilityRepository.save(homeFacility);
  }


  async updateHomeFacility(id: string, data: any): Promise<HomeFacility> {
    const body = data.payload;
    const homeFacility = await this.homeFacilityRepository.findOne({ where: { id } });
    const updatedFacility = { ...homeFacility, ...body }
    return await this.homeFacilityRepository.save(updatedFacility)
  }

  async listAll() {
    return await this.homeFacilityRepository.find({ relations: ['facilities_mapping'] });
  }

  async getFacilityById(id: string) {
    console.log(id);
    const data = await this.homeFacilityRepository.findOne({ where: { id }, relations: ['facilities_mapping'] });
    return data;
  }
}
