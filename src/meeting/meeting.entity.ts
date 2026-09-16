import { CustomerServiceRepresentative } from 'src/auth/customerServiceRepresentative.entity';
import { Expert } from 'src/auth/expert.entity';
import { User } from 'src/auth/user.entity';
import { Payment } from 'src/payment-gateway/payment.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum RequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CANCELED = 'CANCELED',
}

@Entity()
export class Meeting extends BaseEntity {
  @PrimaryGeneratedColumn({
    unsigned: true,
  })
  id: number;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.sentMeetingRequests, {
    eager: true,
  })
  requestSenderUser: User;

  @Column({ nullable: true })
  preferredTime: Date;

  @ManyToOne(() => Expert, (expert) => expert.receivedMeetingRequests, {
    eager: true,
  })
  requestReceiverExpert: Expert;

  @Column({ nullable: false, default: true })
  status: RequestStatus = RequestStatus.PENDING;

  @Column({ nullable: true })
  startTime: Date;

  @Column('text', { nullable: true })
  startUrl: string;

  @Column({ nullable: true })
  joinUrl: string;

  @Column('text', { nullable: true })
  zoomApiResponse: string;

  @ManyToOne(
    () => CustomerServiceRepresentative,
    (customerServiceRepresentative) =>
      customerServiceRepresentative.createdMeeting,
  )
  customerServiceRepresentative: CustomerServiceRepresentative;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @OneToOne((type) => Payment, {
    eager: true,
    nullable: false,
  })
  @JoinColumn()
  payment: Payment;

  @Column('text', { nullable: true })
  preassesmentAnswers: string;

  @Column({ nullable: true })
  fileName: string;

  @Column({ nullable: true })
  userUploadedFileName: string;

  @CreateDateColumn()
  readonly createdAt?: Date;

  @UpdateDateColumn()
  readonly updatedAt?: Date;
}
