import { MiddlewareConsumer, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { join } from 'path';
import { ConfigModule } from './config/config.module';
import { LoggerModule } from './logger/logger.module';
import { DbModule } from './db/db.module';
import { UserEntity } from './users/entity/users.entity';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';

@Module({
  imports: [
    DbModule.forRoot({
      entities: [
        UserEntity
      ]
    }),
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      driver: ApolloFederationDriver,
      context: ({ req }: any) => ({ req }),
      definitions: {
        path: join(process.cwd(), 'src/graphql.classes.ts'),
        outputAs: 'class',
      },
    }),
    UsersModule,
    AuthModule,
    ConfigModule,
    LoggerModule
  ],
})
export class AppModule {

}
