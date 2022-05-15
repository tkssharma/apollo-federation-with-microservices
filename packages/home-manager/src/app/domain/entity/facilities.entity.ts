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
import { HomeFacility } from './home-facility.entity';


@Entity({ name: 'facilities_mappings' })
export class FacilitiesMapping extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @ManyToOne(() => Homes, (event) => event.facilities)
  @JoinColumn({ name: 'home_id', referencedColumnName: 'id' })
  public homes!: Homes

  @ManyToOne(() => HomeFacility, (event) => event.facilities_mapping)
  @JoinColumn({ name: 'facility_id', referencedColumnName: 'id' })
  public homes_facilities!: HomeFacility

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  public created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  public updated_at!: Date;

  @DeleteDateColumn()
  public deleted_at?: Date | null;
}
