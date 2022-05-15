import { AdminGuard } from '@app/auth/guards/admin.guard';
import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation, Parent, ResolveField, Context } from '@nestjs/graphql';
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
  async createBooking(@Args() BookingInput: any, @Context() context: any) {
    console.log(BookingInput)
    const { userid } = context.req.headers;
    return await this.bookingService.createBooking(BookingInput, userid);
  }

  @Mutation()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async updateBooking(@Args('id') id: string, @Args() BookingInput: any) {
    return await this.bookingService.updateHome(id, BookingInput);
  }

  @ResolveField('home')
  getAllFacilities(@Parent() booking: any) {
    return { __typename: 'Home', id: booking.home_id };
  }

  @ResolveField('user')
  getUser(@Parent() booking: any) {
    return { __typename: 'User', id: booking.user_id };
  }
}
