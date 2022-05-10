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
import { FacilitiesMapping } from './facilities.entity';
import { Homes } from './home.entity';


@Entity({ name: 'home_facilities' })
export class HomeFacility extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column('varchar', { length: 500 })
  public display!: string;

  @Column({ type: 'jsonb', default: [] })
  public display_images!: string[];

  @Column({ type: 'jsonb', default: [] })
  public original_images!: string[];

  @OneToMany(() => FacilitiesMapping, (event) => event.homes_facilities)
  public facilities_mapping!: FacilitiesMapping[]

  @Column('varchar', { length: 500 })
  public name!: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  public created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  public updated_at!: Date;

  @DeleteDateColumn()
  public deleted_at?: Date | null;
}
