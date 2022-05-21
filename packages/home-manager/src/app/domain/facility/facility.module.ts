import { Module } from '@nestjs/common';
import { HomeFacilityService } from './facility.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeFacilityResolver } from './facility.resolver';
import { Home } from '../entity/home.entity';
import { HomeFacility } from '../entity/home-facility.entity';
import { LoggerModule } from '@logger/logger.module';
import { DateScalar } from '@app/scalars/date.scalar';


@Module({
  imports: [LoggerModule, TypeOrmModule.forFeature([HomeFacility, Home, HomeFacility])],
  providers: [HomeFacilityService, HomeFacilityResolver, DateScalar],
})
export class FacilityModule {
}
