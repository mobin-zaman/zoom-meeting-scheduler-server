import { Meeting } from 'src/meeting/meeting.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class CustomerServiceRepresentative extends BaseEntity {
  @PrimaryGeneratedColumn({
    unsigned: true,
  })
  id: number;

  @Column({
    nullable: false,
  })
  firstName: string;

  @Column({
    nullable: false,
  })
  lastName: string;

  @Column({
    unique: true,
    nullable: false,
  })
  firebaseUid: string;

  @Column({ nullable: true })
  photoUrl: string;

  @Column()
  email: string;

  @Column()
  phoneNumber: string;

  @OneToMany(() => Meeting, (meeting) => meeting.customerServiceRepresentative)
  createdMeeting: Meeting;

  @CreateDateColumn()
  readonly createdAt?: Date;

  @UpdateDateColumn()
  readonly updatedAt?: Date;
}
