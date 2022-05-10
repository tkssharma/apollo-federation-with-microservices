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


@Entity({ name: 'home_shares' })
export class HomeShares extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'integer' })
  public quantity!: number;

  @Column({ type: 'uuid' })
  public home_id!: string;

  @Column({ type: 'uuid' })
  public user_id!: string;

  @Column('varchar', { length: 500 })
  public display_name!: string;

  @Column({ type: 'boolean', default: true, select: true })
  public is_active!: boolean;

  @Column('varchar', { length: 500 })
  public name!: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  public created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  public updated_at!: Date;

  @DeleteDateColumn()
  public deleted_at?: Date | null;
}
