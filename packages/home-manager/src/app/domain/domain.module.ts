import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ConfigModule } from '@app/config/config.module';
import { DbModule } from '../../db/db.module';
import { GraphQLFederationModule } from '@nestjs/graphql';
import { HomeLocality } from './entity/home-locality.entity';
import { HomeFacility } from './entity/home-facility.entity';
import { Homes } from './entity/home.entity';
import { FacilitiesMapping } from './entity/facilities.entity';
import { LocalityModule } from './locality/locality.module';
import { HomeModule } from './home/home.module';
@Module({
  imports: [
    HomeModule,
    LocalityModule,
    DbModule.forRoot({
      entities: [HomeLocality, HomeFacility, Homes, FacilitiesMapping]
    }),
    ConfigModule,
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'graphql.schama.ts'),
        outputAs: 'class'
      }
    }),
    GraphQLFederationModule.forRoot({
      debug: false,
      path: '/graphql-federated',
      typePaths: ['./**/*.{graphql,graphql.federation}'],
    }),
  ]
})

export class DomainModule {

}
