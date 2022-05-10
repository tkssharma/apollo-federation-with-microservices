import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Homes } from '../entity/home.entity';
import { CreateHomeDto } from './home.dto';


@Injectable()
export class HomeService {
  constructor(@InjectRepository(Homes) private readonly homeRepository: Repository<Homes>
  ) {
  }

  async createHome(data: CreateHomeDto): Promise<Homes> {
    let home = new Homes();
    await home.save();
    return home;
  }


  async updateHome(id: string, data: CreateHomeDto): Promise<Homes> {
    const home = await this.homeRepository.findOne({ where: { id } });
    const updated = { ...home, ...data }
    return await this.homeRepository.save(updated)
  }

  async listAll() {
    return await this.homeRepository.find({});
  }

  async getById(id: string) {
    return await this.homeRepository.findOne({ where: { id } });
  }
}
