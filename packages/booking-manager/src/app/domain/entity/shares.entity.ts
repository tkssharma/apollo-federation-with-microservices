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

export enum ShareStatus {
  active = 'active',
  review = 'review',
  in_active = 'in-active'
}

@Entity({ name: 'home_shares' })
export class HomeShares extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'integer' })
  public quantity!: number;

  @Column({ type: 'varchar', nullable: true })
  public note!: string;

  @Column({
    type: 'enum',
    enum: ShareStatus,
    default: ShareStatus.active,
  })
  public status!: string;

  @Column({ type: 'uuid' })
  public home_id!: string;

  @Column({ type: 'uuid' })
  public user_id!: string;

  @Column({ type: 'varchar', nullable: true })
  public created_by!: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  public created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  public updated_at!: Date;

  @DeleteDateColumn()
  public deleted_at?: Date | null;
}
