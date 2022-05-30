import { Logger } from '@logger/logger';
import { ConflictException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createQueryBuilder, getRepository, Repository } from 'typeorm';
import { Booking, BookingStatus } from '../entity/booking.entity';
import { HomeShare, ShareStatus } from '../entity/home-shares.entity';
import { CreateBookingDto } from './booking.dto';


@Injectable()
export class BookingService {
  constructor(@InjectRepository(Booking) private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(HomeShare) private readonly homeShareRepository: Repository<HomeShare>,
    private readonly logger: Logger
  ) {
  }

  // crate booking with default status as reserved
  async createBooking(data: CreateBookingDto): Promise<Booking> {

    try {
      const { home_id, user_id } = data;
      // check if user is a real owner 
      // check shares and quantity 
      // check if user already have active booking 
      const isHomeOwner = await this.checkCustomerAsHomeOwner(user_id, home_id);
      if (!isHomeOwner) {
        throw new UnprocessableEntityException('User is not a Home Owner and booking can not be processed')
      }
      const existingBookings = await this.checkCustomersActiveBooking(user_id, home_id);
      // check active booking and available booking based on 
      // check total number of shares available 
      if (!existingBookings) {
        return await this.bookingRepository
          .save({ ...data, user_id, status: BookingStatus.reserved });
      } else {
        throw new ConflictException('active Booking already available for this Data')
      }
    } catch (err: any) {
      this.logger.error(err);
      throw err;
    }
  }
  async checkCustomerAsHomeOwner(userId: string, homeId: string) {
    const assignedHomes = await this.homeShareRepository.find({ where: { user_id: userId, home_id: homeId, status: ShareStatus.active } })
    if (assignedHomes && assignedHomes.length > 0) {
      return assignedHomes[0];
    }
    return null;
  }

  async checkCustomersActiveBooking(userId: string, homeId: string) {
    const currentBooking = await this.bookingRepository.find({ where: { user_id: userId, home_id: homeId } })
    const activeBookings = currentBooking.filter(i => i.status !== BookingStatus.cancelled);
    if (activeBookings && activeBookings.length > 0) {
      return activeBookings;
    }
    return null;
  }



  async updateBooking(id: string, data: any): Promise<Booking> {
    // only one booking can be active as reserved or booked 
    // user can have many cancelled booking 
    // user can have many completed booking
    // ! add more rules here
    const currentActiveBookings = await getRepository(Booking)
      .createQueryBuilder("bookings")
      .where("bookings.id = :id", { id })
      .where("bookings.status != :status", { status: BookingStatus.cancelled })
      .getOne();

    if (!currentActiveBookings) {
      throw new NotFoundException()
    }
    if (currentActiveBookings.status === BookingStatus.completed) {
      throw new UnprocessableEntityException('Booking already completed, can not be updated')
    }

    const updatedBooking = { ...currentActiveBookings, ...data }
    console.log(updatedBooking);
    return await this.bookingRepository.save(updatedBooking)
  }

  async cancelBooking(id: string): Promise<Booking> {
    return this.updateBooking(id, { status: BookingStatus.cancelled })
  }

  async finalizeBooking(id: string): Promise<Booking> {
    return this.updateBooking(id, { status: BookingStatus.booked })
  }

  async completeBooking(id: string): Promise<Booking> {
    return this.updateBooking(id, { status: BookingStatus.completed })
  }

  async listAll() {
    const data = await this.bookingRepository.find({});
    return data;
  }

  async getAllCustomerBookings(id: string) {
    return await this.bookingRepository.find({ where: { user_id: id } });
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
