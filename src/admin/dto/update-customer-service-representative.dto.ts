import { IsString } from 'class-validator';

export class UpdateCustomerServiceRepresentativeDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  phoneNumber: string;
}
