import { AdminGuard } from '@app/auth/guards/admin.guard';
import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Bookings } from '../entity/booking.entity';
import { BookingService } from './booking.service';

@Resolver((of: any) => Bookings)
export class BookingResolver {
  constructor(private bookingService: BookingService) {
  }

  @Query()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async bookings() {
    return await this.bookingService.listAll();
  }

  @Query()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async booking(@Args('id') id: string) {
    return await this.bookingService.getById(id);
  }

  @Query()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async allHomeBookings(@Args('id') homeId: string) {
    return await this.bookingService.listAllBookingsForHome(homeId);
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async createBooking(@Args('BookingInput') BookingInput: any) {
    return this.bookingService.createBooking(BookingInput);
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async updateBooking(@Args('id') id: string, @Args('BookingInput') BookingInput: any) {
    return this.bookingService.updateHome(id, BookingInput);
  }
}
