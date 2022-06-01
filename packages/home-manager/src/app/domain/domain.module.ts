import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@app/config/config.module';
import { DbModule } from '../../db/db.module';
import { HomeLocality } from './entity/home-locality.entity';
import { HomeFacility } from './entity/home-facility.entity';
import { Home } from './entity/home.entity';
import { LocalityModule } from './locality/locality.module';
import { HomeModule } from './home/home.module';
import { LoggerModule } from '@logger/logger.module';

import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { FacilityModule } from './facility/facility.module';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { FilesModule } from './files/files.module';
import { AWSS3Module } from '@app/lib/aws-s3';
import { UserUploads } from './entity/files.entity';
import { graphqlUploadExpress } from 'graphql-upload';

@Module({
  imports: [
    DbModule.forRoot({
      entities: [HomeLocality, HomeFacility, Home, UserUploads]
    }),
    LoggerModule,
    AWSS3Module,
    HomeModule,
    FilesModule,
    LocalityModule,
    FacilityModule,
    ConfigModule,
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      driver: ApolloFederationDriver,
      debug: true,
      context: ({ req }: any) => {
        return { req }
      },
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
  configure(consumer: MiddlewareConsumer) {
    //consumer.apply(graphqlUploadExpress()).forRoutes("graphql");
  }
}
