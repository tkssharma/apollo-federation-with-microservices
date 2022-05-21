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
import { Home } from './home.entity';


@Entity({ name: 'home_locality' })
export class HomeLocality extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'uuid' })
  public user_id!: string;

  @Column('varchar', { length: 500 })
  public street!: string;

  @Column('varchar', { length: 500 })
  public state!: string;

  @Column('varchar', { length: 500 })
  public city!: string;

  @Column('varchar', { length: 500 })
  public country!: string;

  @Column('varchar', { length: 500 })
  public zip_code!: string;

  @OneToOne(() => Home, (event) => event.locality)
  @JoinColumn({ name: "home_id" })
  public homes!: Home

  @Column('varchar', { length: 500 })
  public name!: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  public created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  public updated_at!: Date;

  @DeleteDateColumn()
  public deleted_at?: Date | null;
}
