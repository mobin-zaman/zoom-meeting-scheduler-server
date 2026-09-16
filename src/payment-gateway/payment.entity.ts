import { Meeting } from 'src/meeting/meeting.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ColumnType,
  UpdateDateColumn,
} from 'typeorm';

export enum PaymentStatus {
  PENDING = 'PENDING',
  DONE = 'DONE',
}

@Entity()
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn({
    unsigned: true,
  })
  id: number;

  @Column({
    nullable: false,
  })
  invoiceId: string;

  @Column({
    nullable: false,
  })
  payUrl: string;

  @Column({
    nullable: false,
  })
  transactionId: string;

  @Column({
    nullable: false,
    default: true,
  })
  paymentStatus: PaymentStatus = PaymentStatus.PENDING;

  @Column('text', {
    nullable: true,
  })
  ipnBody: string;

  @CreateDateColumn()
  readonly createdAt?: Date;

  @UpdateDateColumn()
  readonly updatedAt?: Date;
}
