import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ConfigModule } from '@app/config/config.module';
import { DbModule } from '../../db/db.module';
import { HomeShares } from './entity/shares.entity';
import { Bookings } from './entity/booking.entity';
import { AuthModule } from '@app/auth/auth.module';
import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { BookingModule } from './booking/booking.module';
@Module({
  imports: [
    BookingModule,
    DbModule.forRoot({
      entities: [HomeShares, Bookings]
    }),
    AuthModule,
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
