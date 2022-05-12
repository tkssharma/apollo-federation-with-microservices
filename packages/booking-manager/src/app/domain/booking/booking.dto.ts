import { BookingStatus } from "../entity/booking.entity";

export class CreateBookingDto {
  public home_id!: string;
  public user_id!: string;
  public invoice_id!: string;
  public start_date!: Date;
  public end_date!: Date;
  public status!: BookingStatus;
}
