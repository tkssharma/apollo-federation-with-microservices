
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export class BookingInput {
    user_id: string;
    invoice_id: string;
    home_id: string;
    start_date?: Nullable<Date>;
    end_Date?: Nullable<Date>;
    status: string;
}

export class Booking {
    id: string;
    user_id: string;
    invoice_id: string;
    home_id: string;
    start_date: Date;
    end_Date: Date;
    status: string;
}

export abstract class IQuery {
    abstract bookings(): Nullable<Booking[]> | Promise<Nullable<Booking[]>>;

    abstract allHomeBookings(id?: Nullable<string>): Nullable<Booking[]> | Promise<Nullable<Booking[]>>;

    abstract booking(id?: Nullable<string>): Booking | Promise<Booking>;
}

export abstract class IMutation {
    abstract createBooking(payload: BookingInput): Nullable<Booking> | Promise<Nullable<Booking>>;

    abstract updateBooking(id: string, payload: BookingInput): Nullable<Booking> | Promise<Nullable<Booking>>;
}

type Nullable<T> = T | null;
