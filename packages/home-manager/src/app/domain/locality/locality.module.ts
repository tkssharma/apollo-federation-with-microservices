import { Module } from '@nestjs/common';
import { HomeLocalityService } from './locality.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeLocalityResolver } from './locality.resolver';
import { Homes } from '../entity/home.entity';
import { HomeLocality } from '../entity/home-locality.entity';


@Module({
  imports: [TypeOrmModule.forFeature([HomeLocality])],
  providers: [HomeLocalityService, HomeLocalityResolver],
})
export class LocalityModule {
}
