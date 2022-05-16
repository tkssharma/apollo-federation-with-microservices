import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, CreateDateColumn, DeleteDateColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { HomeLocality } from './home-locality.entity';
import { HomeFacility } from './home-facility.entity';

@Entity('homes')
export class Homes extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column('varchar', { length: 500, unique: true })
  public name!: string;

  @Column({ type: 'uuid' })
  public user_id!: string;

  @OneToOne(() => HomeLocality, (event) => event.homes)
  public locality!: HomeLocality

  @OneToMany(() => HomeFacility, (event) => event.homes)
  public facilities!: HomeFacility[]

  @Column('varchar')
  public description!: string;

  @Column({ type: 'jsonb', default: [] })
  public display_images!: string[];

  @Column({ type: 'jsonb', default: [] })
  public original_images!: string[];

  @Column({ type: 'jsonb', default: null })
  public metadata!: any;

  @Column({ type: 'boolean', default: true, select: true })
  public is_active!: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  public created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  public updated_at!: Date;

  @DeleteDateColumn()
  public deleted_at?: Date | null;

}
