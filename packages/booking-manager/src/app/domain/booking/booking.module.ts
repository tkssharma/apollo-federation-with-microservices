import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bookings } from '../entity/booking.entity';
import { HomeShares } from '../entity/shares.entity';
import { BookingResolver } from './booking.resolver';
import { BookingService } from './booking.service';
import { DateScalar } from './scalars/date.scalar';


@Module({
  imports: [TypeOrmModule.forFeature([Bookings, HomeShares])],
  providers: [BookingService, BookingResolver, DateScalar],
})
export class HomeModule {
}
