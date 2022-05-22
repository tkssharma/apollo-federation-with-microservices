import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ConfigModule } from '@app/config/config.module';
import { DbModule } from '../../db/db.module';
import { HomeLocality } from './entity/home-locality.entity';
import { HomeFacility } from './entity/home-facility.entity';
import { Home } from './entity/home.entity';
import { LocalityModule } from './locality/locality.module';
import { HomeModule } from './home/home.module';
import { LoggerModule } from '@logger/logger.module';
import { Upload } from '../Scalars/upload.scalar';

import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { FacilityModule } from './facility/facility.module';
import { GraphQLError, GraphQLFormattedError } from 'graphql';

@Module({
  imports: [
    LoggerModule,
    HomeModule,
    LocalityModule,
    FacilityModule,
    DbModule.forRoot({
      entities: [HomeLocality, HomeFacility, Home]
    }),
    ConfigModule,
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      uploads: {
        maxFileSize: 20000000, // 20 MB
        maxFiles: 5
      },
      driver: ApolloFederationDriver,
      context: ({ req }: any) => ({ req }),
      formatError: (error: GraphQLError) => {
        console.log(error);
        const graphQLFormattedError: GraphQLFormattedError = {
          message: error?.extensions?.exception?.response?.message || error?.message,
        };
        return graphQLFormattedError;
      },
    }),
  ]
})

export class DomainModule {

}
