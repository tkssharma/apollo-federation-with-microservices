import { Logger } from '@logger/logger';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookings } from '../entity/booking.entity';
import { CreateBookingDto } from './booking.dto';


@Injectable()
export class BookingService {
  constructor(@InjectRepository(Bookings) private readonly bookingRepository: Repository<Bookings>,
    private readonly logger: Logger
  ) {
  }

  async createBooking(data: any, userId: string): Promise<Bookings> {
    const body = data.payload;
    try {
      return await this.bookingRepository
        .save({ ...body, user_id: userId });
    } catch (err: any) {
      this.logger.error(err);
      throw err;
    }
  }


  async updateHome(id: string, data: any): Promise<Bookings> {
    const body = data.payload;
    const homeFacility = await this.bookingRepository.findOne({ where: { id } });
    const updatedFacility = { ...homeFacility, ...body }
    return await this.bookingRepository.save(updatedFacility)
  }

  async listAll() {
    const data = await this.bookingRepository.find({});
    return data;
  }

  async listAllBookingsForHome(homeId: string) {
    return await this.bookingRepository.find({ where: { home_id: homeId } });
  }

  async getById(id: string) {
    const data = await this.bookingRepository.findOne({ where: { id } });
    console.log(data);
    return data;
  }
}
