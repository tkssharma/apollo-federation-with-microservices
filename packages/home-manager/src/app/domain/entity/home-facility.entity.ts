import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Homes } from './home.entity';


@Entity({ name: 'home_facilities' })
export class HomeFacility extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;


  @Column({ type: 'uuid' })
  public user_id!: string;

  @Column('varchar', { length: 500, nullable: true })
  public display!: string;

  @Column({ type: 'jsonb', default: [] })
  public display_images!: string[];

  @Column({ type: 'jsonb', default: [] })
  public original_images!: string[];

  @ManyToOne(() => Homes, (event) => event.facilities)
  @JoinColumn({ name: "home_id" })
  public homes!: Homes

  @Column('varchar', { length: 500 })
  public name!: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  public created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  public updated_at!: Date;

  @DeleteDateColumn()
  public deleted_at?: Date | null;
}
