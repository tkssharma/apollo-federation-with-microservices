import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ConfigModule } from '@app/config/config.module';
import { DbModule } from '../../db/db.module';
import { HomeLocality } from './entity/home-locality.entity';
import { HomeFacility } from './entity/home-facility.entity';
import { Homes } from './entity/home.entity';
import { LocalityModule } from './locality/locality.module';
import { HomeModule } from './home/home.module';
import { LoggerModule } from '@logger/logger.module';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { FacilityModule } from './facility/facility.module';

@Module({
  imports: [
    LoggerModule,
    HomeModule,
    LocalityModule,
    FacilityModule,
    DbModule.forRoot({
      entities: [HomeLocality, HomeFacility, Homes]
    }),
    ConfigModule,
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      driver: ApolloFederationDriver,
      context: ({ req }: any) => ({ req })
    }),
  ]
})

export class DomainModule {

}
