import { Meeting } from 'src/meeting/meeting.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ExpertCategory } from './expert.category.entity';

@Entity()
export class Expert extends BaseEntity {
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

  @Column()
  email: string;

  @Column()
  phoneNumber: string;

  @Column({ nullable: true })
  photoUrl: string;

  @Column({
    nullable: true,
  })
  zoomUserId: string;

  @Column({
    nullable: false,
    unique: true,
  })
  firebaseUid: string;

  @Column({ nullable: false })
  fee: number;

  @Column({ nullable: true })
  availableTime: string;

  @Column('text', { nullable: true })
  preAssessmentQuestions: string;

  @OneToMany(() => Meeting, (meeting) => meeting.requestReceiverExpert)
  receivedMeetingRequests: Meeting[];

  @ManyToOne(() => ExpertCategory, (expertCategory) => expertCategory.experts, {
    eager: true,
  })
  category: ExpertCategory;

  @CreateDateColumn()
  readonly createdAt?: Date;

  @UpdateDateColumn()
  readonly updatedAt?: Date;
}
