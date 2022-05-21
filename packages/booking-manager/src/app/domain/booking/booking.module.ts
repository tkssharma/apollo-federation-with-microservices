import { AuthModule } from '@app/auth/auth.module';
import { LoggerModule } from '@logger/logger.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from '../entity/booking.entity';
import { HomeShares } from '../entity/shares.entity';
import { BookingResolver } from './booking.resolver';
import { BookingService } from './booking.service';
import { DateScalar } from './scalars/date.scalar';

@Module({
  imports: [AuthModule, LoggerModule, TypeOrmModule.forFeature([Booking, HomeShares])],
  providers: [BookingService, BookingResolver, DateScalar],
})
export class BookingModule {
}
