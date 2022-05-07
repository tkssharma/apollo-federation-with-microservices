import { MiddlewareConsumer, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { join } from 'path';
import { ConfigModule } from './config/config.module';
import { GraphQLFederationModule } from '@nestjs/graphql';
import { LoggerModule } from './logger/logger.module';
import { DbModule } from './db/db.module';
import { UserEntity } from './users/entity/users.entity';

@Module({
  imports: [
    DbModule.forRoot({
      entities: [
        UserEntity
      ]
    }),
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      installSubscriptionHandlers: true,
      context: ({ req }: any) => ({ req }),
      definitions: {
        path: join(process.cwd(), 'src/graphql.classes.ts'),
        outputAs: 'class',
      },
    }),
    GraphQLFederationModule.forRoot({
      debug: false,
      playground: false,
      path: '/graphql-federated',
      typePaths: ['./**/*.{graphql,graphql.federation}'],
    }),
    UsersModule,
    AuthModule,
    ConfigModule,
    LoggerModule
  ],
})
export class AppModule {

}
