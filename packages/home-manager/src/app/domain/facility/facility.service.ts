import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Homes } from '../entity/home.entity';
import { HomeFacility } from '../entity/home-Facility.entity';
import { CreateHomeFacilityDto } from './facility.dto';
import { Logger } from '@logger/logger';
import { FacilitiesMapping } from '../entity/facilities.entity';


@Injectable()
export class HomeFacilityService {
  constructor(
    @InjectRepository(HomeFacility) private readonly homeFacilityRepository: Repository<HomeFacility>,
    @InjectRepository(Homes) private readonly homeRepository: Repository<Homes>,
    @InjectRepository(FacilitiesMapping) private readonly facilityRepository: Repository<FacilitiesMapping>,
    private readonly logger: Logger
  ) {
  }

  async createHomeFacility(data: any): Promise<HomeFacility> {
    const body = data.payload;
    try {
      return await this.homeFacilityRepository
        .save({ ...body });
    } catch (err: any) {
      this.logger.error(err);
      throw err;
    }
  }

  async addFacilityToHome(facility_id: string, home_id: string): Promise<boolean> {
    const homeFacility = await this.homeFacilityRepository.findOne({ where: { id: facility_id } });
    const home = await this.homeRepository.findOne({ where: { id: home_id } });
    if (!(home && homeFacility)) {
      throw new BadRequestException();
    }
    const mapping = await this.facilityRepository.findOne({
      where: {
        homes: home, homes_facilities: homeFacility
      }, relations: ['homes_facilities', 'homes']
    })
    if (mapping) {
      return true
    } else {
      await this.facilityRepository.save({
        homes: home, homes_facilities: homeFacility
      })
      return true;
    }
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
