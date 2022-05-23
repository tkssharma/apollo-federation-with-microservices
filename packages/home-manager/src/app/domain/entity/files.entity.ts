import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';


@Entity({ name: 'user_uploads' })
export class UserUploads extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'uuid' })
  public user_id!: string;

  @Column({ type: 'uuid' })
  public reference_id!: string;

  @Column('varchar', { length: 500, nullable: false })
  public name!: string;

  @Column('varchar', { length: 500, nullable: false })
  public url!: string;

  @Column('varchar', { length: 500, nullable: false })
  public storage_unique_name!: string;

  @Column('varchar', { length: 500, nullable: false })
  public mimetype!: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  public created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  public updated_at!: Date;

  @DeleteDateColumn()
  public deleted_at?: Date | null;
}
