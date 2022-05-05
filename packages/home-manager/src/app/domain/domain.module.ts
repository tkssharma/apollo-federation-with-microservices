import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ConfigModule } from '@app/config/config.module';
import { DbModule } from '../../db/db.module';
import { HomeEntity } from './entity/home.entity';
import { GraphQLFederationModule } from '@nestjs/graphql';

@Module({
  imports: [
    DbModule.forRoot({
      entities: [HomeEntity]
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
    HomeModule,
  ]
})

export class DomainModule {

}
