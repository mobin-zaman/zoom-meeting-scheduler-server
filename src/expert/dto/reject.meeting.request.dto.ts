import { IsNumber } from 'class-validator';

export class RejectMeetingRequestDto {
  @IsNumber()
  meetingId: number;
}
