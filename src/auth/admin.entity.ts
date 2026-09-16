import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Admin extends BaseEntity {
  @PrimaryGeneratedColumn({
    unsigned: true,
  })
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  mobileNumber: string;

  @Column({
    nullable: false,
    unique: true,
  })
  firebaseUid: string;
}
