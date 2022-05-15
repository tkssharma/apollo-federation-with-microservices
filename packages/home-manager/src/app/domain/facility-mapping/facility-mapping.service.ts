import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Homes } from '../entity/home.entity';
import { HomeFacility } from '../entity/home-Facility.entity';
import { Logger } from '@logger/logger';
import { FacilitiesMapping } from '../entity/facilities.entity';


@Injectable()
export class HomeFacilityMappingService {
  constructor(
    @InjectRepository(FacilitiesMapping) private readonly facilityMappingRepository: Repository<FacilitiesMapping>,
    private readonly logger: Logger
  ) {
  }


  async getFacilityById(id: string) {
    const data = await this.facilityMappingRepository.findOne({ where: { id }, relations: ['facilities_mapping', 'homes'] });
    return data;
  }
}
