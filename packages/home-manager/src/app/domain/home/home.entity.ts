import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

//  tslint:disable:naming-convention
export enum ContractStatus {
  'ACTIVE' = 'ACTIVE',
  'INACTIVE'= 'INACTIVE',
  'ARCHIVED' = 'ARCHIVED',
  'UNARCHIVE' = 'UNARCHIVE'

}
@Index(['supplier_name', 'title'])
@Entity({ name: 'contracts' })
export default class Contract {

  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'uuid' })
  public organization_id!: string;

  @Column({ type: 'uuid', nullable: true })
  public supplier_id!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public supplier_name!: string;

  @Column({  type: 'varchar',  nullable: true })
  public tags!: string;

  @Column({ type: 'jsonb',  nullable: true })
  public stakeholders!: string [];

  @Column({ type: 'varchar', nullable: true })
  public description!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public title!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public document!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public document_originalname!: string;

  @Column({ type: 'boolean', default: false, select: false })
  public is_deleted!: boolean;

  @Column({ type: 'boolean', default: false })
  public is_reminder_set!: boolean;

  @Column({ type: 'boolean', default: false })
  public is_alarm_set!: boolean;

  @Column({ type: 'timestamptz', default: () => null, nullable: true })
  public alarm_date!: Date;

  @Column({ type: 'timestamptz', default: () => null, nullable: true })
  public ends_at!: Date;

  @Column({ type: 'timestamptz', default: () => null, nullable: true })
  public starts_at!: Date;

  @Column({ type: 'timestamptz', default: () => null, nullable: true })
  public payment_date!: Date;

  @Column({ type: 'varchar', nullable: true })
  public payment_terms!: string;

  @Column({ type: 'varchar', length: 255 })
  public contract_type!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public payment_frequency!: string;

  @Column({
    type: 'enum',
    enum: ContractStatus,
    default: ContractStatus.ACTIVE,
  })
  public status!: string;

  @Column({ type: 'int', nullable: true })
  public amount!: number;

  @Column({ type: 'int', nullable: true })
  public cancellation_period!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public currency!: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP'})
  public created_at!: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP'})
  public updated_at!: Date;
}

