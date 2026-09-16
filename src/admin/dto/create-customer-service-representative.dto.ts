import { IsEmail, IsString } from 'class-validator';

export class CreateCustomerServiceRepresentativeDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  password: string;
}
