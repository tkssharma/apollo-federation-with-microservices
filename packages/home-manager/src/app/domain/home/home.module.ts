import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeResolver } from './home.resolver';
import { Home } from '../entity/home.entity';
import { HomeLocality } from '../entity/home-locality.entity';
import { LoggerModule } from '@logger/logger.module';
import { DateScalar } from '@app/scalars/date.scalar';
import { HomeFacility } from '../entity/home-facility.entity';


@Module({
  imports: [LoggerModule, TypeOrmModule.forFeature([Home, HomeLocality, HomeFacility])],
  providers: [HomeService, HomeResolver, DateScalar],
})
export class HomeModule {
}
