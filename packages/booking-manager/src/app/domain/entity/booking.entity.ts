import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, CreateDateColumn, DeleteDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { HomeShares } from './shares.entity';

export enum BookingStatus {
  reserved = 'reserved',
  booked = 'booked',
  canceled = 'canceled',
  completed = 'completed'
}

@Entity('bookings')
export class Bookings extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'uuid' })
  public home_id!: string;

  @Column({ type: 'uuid' })
  public user_id!: string;

  @Column({ type: 'varchar', default: null, select: true })
  public invoice_id!: string;

  @Column({ type: 'timestamptz', default: null })
  public start_date!: Date;

  @Column({ type: 'timestamptz', default: null })
  public end_date!: Date;


  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.reserved,
  })
  public status!: string;


  @Column('varchar')
  public note?: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  public created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  public updated_at!: Date;


}
