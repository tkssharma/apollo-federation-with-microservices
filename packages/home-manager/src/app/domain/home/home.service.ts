import { Logger } from '@logger/logger';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FacilitiesMapping } from '../entity/facilities.entity';
import { HomeFacility } from '../entity/home-facility.entity';
import { HomeLocality } from '../entity/home-locality.entity';
import { Homes } from '../entity/home.entity';
import { CreateHomeDto } from './home.dto';


@Injectable()
export class HomeService {
  constructor(
    @InjectRepository(Homes) private readonly homeRepository: Repository<Homes>,
    @InjectRepository(HomeLocality) private readonly homeLocalityRepository: Repository<HomeLocality>,
    @InjectRepository(FacilitiesMapping) private readonly homeFacilityMappingRepository: Repository<FacilitiesMapping>,
    private readonly logger: Logger
  ) {
  }

  async createHome(data: any, userid: string): Promise<Homes> {
    const body = data.payload;
    try {
      const existingHome = await this.homeRepository.findOne({ where: { name: body.name }, relations: ['locality'] })
      if (existingHome) {
        return existingHome;
      }
      const locality = await this.homeLocalityRepository.findOne({ where: { id: body.locality_id } })
      const res = await this.homeRepository
        .save({ ...body, locality, user_id: userid });
      return res;
    } catch (err: any) {
      this.logger.error(err);
      throw err;
    }
  }


  async updateHome(id: string, data: any): Promise<Homes> {
    const body = data.payload;
    const homeHome = await this.homeRepository.findOne({ where: { id } });
    const updatedHome = { ...homeHome, ...body }
    return await this.homeRepository.save(updatedHome)
  }

  async listAll() {
    return await this.homeRepository.find({});
  }

  async getById(id: string) {
    return await this.homeRepository.findOne({ where: { id }, relations: ['locality', 'facilities'] });
  }

  async getAllHomeFacilities(id: string) {
    const home = await this.homeRepository.findOne({ where: { id } });
    return await this.homeFacilityMappingRepository.find({
      where: {
        home
      }, relations: ['homes_facilities']
    })
  }

  async getByHomeName(name: string) {
    return await this.homeRepository.findOne({ where: { name } });
  }
}
