import { AdminGuard } from '@app/auth/guards/admin.guard';
import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard';
import { Logger } from '@logger/logger';
import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation, Parent, ResolveField, Context, ResolveReference } from '@nestjs/graphql';
import { Booking } from '../entity/booking.entity';
import { CreateBookingDto } from './booking.dto';
import { BookingService } from './booking.service';

@Resolver((of: any) => Booking)
export class BookingResolver {
  constructor(private bookingService: BookingService, private readonly logger: Logger) {
  }

  @Query()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async bookings() {
    return await this.bookingService.listAll();
  }

  @Query()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getAllCustomerBookings(@Args('customerId') id: string) {
    return await this.bookingService.getAllCustomerBookings(id);
  }

  @Query()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async booking(@Args('id') id: string) {
    return await this.bookingService.getById(id);
  }

  @Query()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async allHomeBookings(@Args('homeId') homeId: string) {
    return await this.bookingService.listAllBookingsForHome(homeId);
  }

  @Mutation()
  // only root company managers are allowed
  @UseGuards(JwtAuthGuard, AdminGuard)
  async createBooking(@Args('payload') BookingInput: CreateBookingDto) {
    return await this.bookingService.createBooking(BookingInput);
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async updateBooking(@Args('id') id: string, @Args('payload') BookingInput: CreateBookingDto) {
    console.log(BookingInput);
    return await this.bookingService.updateBooking(id, BookingInput);
  }


  @Mutation()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async updateBookingStatus(@Args('id') id: string, @Args('status') status: string) {
    // release the booking days being booked
    // reserved ->  cancelled/completed
    if (status === 'canceled') {
      return await this.bookingService.cancelBooking(id);
    } else if (status === 'booked') {
      return await this.bookingService.finalizeBooking(id);
    } else if (status === 'completed') {
      return await this.bookingService.completeBooking(id);
    }

  }

  @ResolveReference()
  async resolveReference(reference: { __typename: string; id: string }) {
    this.logger.http("ResolveReference :: booking")
    return await this.bookingService.getById(reference.id);
  }

  @ResolveField('home')
  home(@Parent() booking: any) {
    this.logger.http("ResolveField :: home" + JSON.stringify(booking));
    return { __typename: 'Home', id: booking.home_id };
  }

  @ResolveField('user')
  user(@Parent() booking: any) {
    this.logger.http("ResolveField :: user" + booking)
    return { __typename: 'User', id: booking.user_id };
  }
}
