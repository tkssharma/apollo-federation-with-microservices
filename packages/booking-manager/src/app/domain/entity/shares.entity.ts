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


@Entity({ name: 'shares' })
export class Share extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'boolean', nullable: true, default: true })
  public is_available!: boolean;

  @Column({ type: 'integer', nullable: false })
  public price!: number;

  @Column({ type: 'integer', nullable: false })
  public initial_price!: number;

  @Column({ type: 'uuid' })
  public home_id!: string;

  @Column({ type: 'jsonb', nullable: true })
  public metadata!: any;

  @Column({ type: 'varchar', nullable: true })
  public created_by!: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  public created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  public updated_at!: Date;

  @DeleteDateColumn()
  public deleted_at?: Date | null;
}
