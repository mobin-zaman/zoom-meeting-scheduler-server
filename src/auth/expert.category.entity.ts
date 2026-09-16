import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Expert } from './expert.entity';

@Entity()
export class ExpertCategory extends BaseEntity {
  @PrimaryGeneratedColumn({
    unsigned: true,
  })
  id: number;

  @Column({
    nullable: false,
    unique: true,
  })
  name: string;

  @OneToMany(() => Expert, (expert) => expert.category, {
    lazy: true,
  })
  experts: Expert[];

  @CreateDateColumn()
  readonly createdAt?: Date;

  @CreateDateColumn()
  readonly updatedAt?: Date;
}
