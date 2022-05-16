import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeResolver } from './home.resolver';
import { Homes } from '../entity/home.entity';
import { HomeLocality } from '../entity/home-locality.entity';
import { LoggerModule } from '@logger/logger.module';
import { FacilitiesMapping } from '../entity/facilities.entity';
import { DateScalar } from '@app/scalars/date.scalar';


@Module({
  imports: [LoggerModule, TypeOrmModule.forFeature([Homes, HomeLocality, FacilitiesMapping])],
  providers: [HomeService, HomeResolver, DateScalar],
})
export class HomeModule {
}
