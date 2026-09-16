import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMeetingDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  expertId: number;

  @IsOptional()
  @IsString()
  description: string;

  @Type(() => Date)
  @IsDate()
  startTime: Date;
}
