import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from 'typeorm';

@Entity('homes')
export class HomeEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column('varchar', { length: 500, unique: true })
  public name!: string;

  @Column('varchar', { length: 500 })
  public type!: string;

}
