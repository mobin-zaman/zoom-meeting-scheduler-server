import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateExpertDto {
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

  @IsOptional()
  @IsString()
  availableTime: string;

  @IsNumber()
  fee: number;

  @IsNumber()
  categoryId: number;
}
