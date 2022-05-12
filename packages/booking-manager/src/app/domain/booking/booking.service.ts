import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookings } from '../entity/booking.entity';
import { CreateBookingDto } from './booking.dto';


@Injectable()
export class BookingService {
  constructor(@InjectRepository(Bookings) private readonly bookingRepository: Repository<Bookings>
  ) {
  }

  async createBooking(data: CreateBookingDto): Promise<Bookings> {
    let booking = new Bookings();
    await booking.save();
    return booking;
  }


  async updateHome(id: string, data: CreateBookingDto): Promise<Bookings> {
    const booking = await this.bookingRepository.findOne({ where: { id } });
    const updated = { ...booking, ...data }
    return await this.bookingRepository.save(updated)
  }

  async listAll() {
    return await this.bookingRepository.find({});
  }

  async listAllBookingsForHome(homeId: string) {
    return await this.bookingRepository.find({ where: { home_id: homeId } });
  }

  async getById(id: string) {
    return await this.bookingRepository.findOne({ where: { id } });
  }
}
