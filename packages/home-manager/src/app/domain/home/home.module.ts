import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeResolver } from './home.resolver';
import { Homes } from '../entity/home.entity';
import { HomeLocality } from '../entity/home-locality.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Homes, HomeLocality])],
  providers: [HomeService, HomeResolver],
})
export class HomeModule {
}
