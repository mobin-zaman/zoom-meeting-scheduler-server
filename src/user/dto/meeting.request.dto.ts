import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class MeetingRequestDto {
  @IsNotEmpty()
  expertId: number;

  @IsString()
  description: string;

  // @IsOptional()
  @Type(() => Date)
  @IsDate()
  preferredTime: Date;

  @IsNotEmpty()
  @IsString()
  preassesmentAnswer: string;
}
