import { Module } from '@nestjs/common';
import { HomeLocalityService } from './locality.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeLocalityResolver } from './locality.resolver';
import { Home } from '../entity/home.entity';
import { HomeLocality } from '../entity/home-locality.entity';
import { LoggerModule } from '@logger/logger.module';
import { DateScalar } from '@app/scalars/date.scalar';


@Module({
  imports: [LoggerModule, TypeOrmModule.forFeature([HomeLocality, Home])],
  providers: [HomeLocalityService, HomeLocalityResolver, DateScalar],
})
export class LocalityModule {
}
