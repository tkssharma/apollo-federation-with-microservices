import { Module } from '@nestjs/common';
import { HomeFacilityService } from './facility.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeFacilityResolver } from './facility.resolver';
import { Homes } from '../entity/home.entity';
import { HomeFacility } from '../entity/home-facility.entity';
import { LoggerModule } from '@logger/logger.module';
import { DateScalar } from '@app/scalars/date.scalar';
import { FacilitiesMapping } from '../entity/facilities.entity';


@Module({
  imports: [LoggerModule, TypeOrmModule.forFeature([HomeFacility, Homes, FacilitiesMapping])],
  providers: [HomeFacilityService, HomeFacilityResolver, DateScalar],
})
export class FacilityModule {
}
