import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import parsePhoneNumber from 'libphonenumber-js';

@Injectable()
export class UserGeneralService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async searchUser(query: string): Promise<User[]> {
    //if the query is not email then perform username and name search
    if (this.isEmail(query)) {
      return await this.searchByEmail(query);
    } else if (this.isPhoneNumber(query)) {
      return await this.searchByPhoneNumber(query);
    } else {
      return await this.searchByName(query);
    }
  }

  private async searchByEmail(email: string): Promise<User[]> {
    try {
      const users: User[] = await this.userRepository
        .createQueryBuilder()
        .where('email LIKE :email', { email: `%${email}%` })
        .getMany();

      return users;
    } catch (e) {
      console.log('ERROR: UserSearchService.searchByEmail(): ', e);
      return [];
    }
  }

  private async searchByPhoneNumber(phone: string): Promise<User[]> {
    try {
      const users: User[] = await this.userRepository
        .createQueryBuilder()
        .where('phoneNumber = :phone', { phone: `${phone}` })
        .getMany();
      return users;
    } catch (error) {
      console.log('ERROR: UserSearchService.searchByPhone(): ', error);

      return [];
    }
  }

  private async searchByName(name: string): Promise<User[]> {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('UPPER(firstName) LIKE :query OR UPPER(lastName) LIKE :query', {
        query: `%${name.toUpperCase()}%`,
      })
      .getMany();

    return users;
  }

  private isEmail(email: string): boolean {
    const emailCheckRegex = /\S+@\S+\.\S+/;
    return emailCheckRegex.test(email);
  }

  private isPhoneNumber(phone: string): boolean {
    //currently we only support BD phone numbers
    const phoneNumber = parsePhoneNumber(phone, 'BD');

    // return phoneNumber.isValid();

    return phoneNumber ? true : false;
  }
}
