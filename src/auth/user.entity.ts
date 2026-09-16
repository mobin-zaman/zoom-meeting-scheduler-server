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
export class User extends BaseEntity {
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
  })
  email: string;

  @Column()
  phoneNumber: string;

  //FIXME: it should be null once the zoom module is set
  @Column({
    unique: true,
    nullable: true,
  })
  zoomUserId: string;

  @Column({
    nullable: true,
  })
  photoUrl: string;

  @Column({
    unique: true,
    nullable: false,
  })
  forumUserId: string;

  @OneToMany(() => Meeting, (meeting) => meeting.requestSenderUser)
  sentMeetingRequests: Meeting[];

  @CreateDateColumn()
  readonly createdAt?: Date;

  @UpdateDateColumn()
  readonly updatedAt?: Date;
}
