import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateExpertDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @IsNotEmpty()
  @IsNumber()
  fee: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  availableTime: string;
}
