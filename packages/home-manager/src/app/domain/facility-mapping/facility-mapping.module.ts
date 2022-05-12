import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeFacilityResolver } from './facility-mapping.resolver';
import { Homes } from '../entity/home.entity';
import { HomeFacility } from '../entity/home-facility.entity';
import { LoggerModule } from '@logger/logger.module';
import { DateScalar } from '@app/scalars/date.scalar';
import { FacilitiesMapping } from '../entity/facilities.entity';
import { HomeFacilityMappingService } from './facility-mapping.service';


@Module({
  imports: [LoggerModule, TypeOrmModule.forFeature([HomeFacility, Homes, FacilitiesMapping])],
  providers: [HomeFacilityMappingService, HomeFacilityMappingService, DateScalar],
})
export class FacilityMappingModule {
}
