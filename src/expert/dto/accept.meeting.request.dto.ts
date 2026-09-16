import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';
export class AcceptMeetingRequestDto {
  @Type(() => Date)
  @IsDate()
  startTime: Date;
}
