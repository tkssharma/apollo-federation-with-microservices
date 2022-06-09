import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@app/config/config.module';
import { DbModule } from '../../db/db.module';
import { LoggerModule } from '@logger/logger.module';

import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { AWSS3Module } from '@app/lib/aws-s3';
import { graphqlUploadExpress } from 'graphql-upload';
import { FileModule } from './file/file.module';
import { File } from './entity/files.entity';
import { AuthModule } from '@app/auth/auth.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    DbModule.forRoot({ entities: [File] }),
    FilesModule,
    LoggerModule,
    AWSS3Module,
    FileModule,
    AuthModule,
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
}
