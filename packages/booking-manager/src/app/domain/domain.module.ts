import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ConfigModule } from '@app/config/config.module';
import { DbModule } from '../../db/db.module';
import { Booking } from './entity/booking.entity';
import { AuthModule } from '@app/auth/auth.module';
import { GraphQLFormattedError } from 'graphql';

import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { BookingModule } from './booking/booking.module';
import { GraphQLError } from 'graphql';
import { Share } from './entity/shares.entity';
import { HomeSharesModule } from './home-share/home-share.module';
import { SharesModule } from './share/share.module';
import { HomeShare } from './entity/home-shares.entity';
@Module({
  imports: [
    BookingModule,
    HomeSharesModule,
    SharesModule,
    DbModule.forRoot({
      entities: [Share, Booking, HomeShare]
    }),

    AuthModule,
    ConfigModule,
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      driver: ApolloFederationDriver,
      context: ({ req }: any) => ({ req }),
      formatError: (error: GraphQLError) => {
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
