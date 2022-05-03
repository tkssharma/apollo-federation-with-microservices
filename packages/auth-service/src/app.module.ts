import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { join } from 'path';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { GraphQLFederationModule } from '@nestjs/graphql';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const options: MongooseModuleOptions = {
          uri: configService.mongoUri
        };

        /*if (configService.mongoAuthEnabled) {
          options.user = configService.mongoUser;
          options.pass = configService.mongoPassword;
        }*/

        return options;
      },
      inject: [ConfigService],
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
  ],
})
export class AppModule { }
