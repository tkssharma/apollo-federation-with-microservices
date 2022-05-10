import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Homes } from '../entity/home.entity';
import { HomeLocality } from '../entity/home-locality.entity';
import { CreateHomeLocalityDto } from './locality.dto';
import { GetLocalityArgs } from './arg/locality.args';


@Injectable()
export class HomeLocalityService {
  constructor(@InjectRepository(HomeLocality) private readonly homeLocalityRepository: Repository<HomeLocality>
  ) {
  }

  async createHomeLocality(data: GetLocalityArgs): Promise<HomeLocality> {
    let homeLocality = new HomeLocality();
    homeLocality.city = data.city;
    homeLocality.state = data.state;
    homeLocality.street = data.street;
    homeLocality.zip_code = data.zip_code;
    homeLocality.country = data.country;
    await homeLocality.save();
    return homeLocality;
  }


  async updateHomeLocality(id: string, data: CreateHomeLocalityDto): Promise<HomeLocality> {
    const homeLocality = await this.homeLocalityRepository.findOne({ where: { id } });
    const updatedLocality = { ...homeLocality, ...data }
    return await this.homeLocalityRepository.save(updatedLocality)
  }

  async listAll() {
    return await this.homeLocalityRepository.find({});
  }

  async getLocalityById(id: string) {
    return await this.homeLocalityRepository.findOne({ where: { id } });
  }
}
