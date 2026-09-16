import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateExpertDto } from 'src/admin/dto/update-expert.dto';
import { Expert } from 'src/auth/expert.entity';
import { ExpertGeneralService } from 'src/auth/expert.general.service';
import { ImageService } from 'src/image/image.service';
import { Meeting } from 'src/meeting/meeting.entity';
import { MeetingService } from 'src/meeting/meeting.service';
import { Repository } from 'typeorm';
import { AcceptMeetingRequestDto } from './dto/accept.meeting.request.dto';
import { RejectMeetingRequestDto } from './dto/reject.meeting.request.dto';

@Injectable()
export class ExpertService {
  constructor(
    @Inject(MeetingService) private meetingService: MeetingService,
    @Inject(ExpertGeneralService)
    private expertGeneralService: ExpertGeneralService,
    @Inject(ImageService) private imageService: ImageService,
    @InjectRepository(Expert) private expertRepository: Repository<Expert>,
  ) {}

  async getMeetingRequests(currentExpert: Expert) {
    const meetings: Meeting[] = await this.meetingService.getAllMeetingsExpert(
      currentExpert,
    );

    return meetings;
  }

  async acceptMeetingRequest(
    meetingId,
    acceptMeetingRequestDto: AcceptMeetingRequestDto,
    currentExpert: Expert,
  ) {
    const { startTime } = acceptMeetingRequestDto;
    await this.meetingService.acceptMeetingRequest(
      meetingId,
      startTime,
      currentExpert,
    );
  }

  async rejectMeeting(
    rejectMeetingRequestDto: RejectMeetingRequestDto,
    currentExpert: Expert,
  ) {
    const { meetingId } = rejectMeetingRequestDto;

    await this.meetingService.rejectMeeting(meetingId, currentExpert);
  }

  async updateExpert(updateExpertDto: UpdateExpertDto, expertId) {
    return await this.expertGeneralService.updateExpert(
      updateExpertDto,
      expertId,
    );
  }

  async uploadProfilePicture(currentUser: Expert, image) {
    const imageUrl = await this.imageService.uploadImage(image.buffer);

    currentUser.photoUrl = imageUrl;

    return await this.expertRepository.save(currentUser);
  }

  async uploadMeetingFile(currentExpert: Expert, fileName: string, meetingId) {
    const meeting = await Meeting.findOneOrFail({
      where: {
        id: meetingId,
        requestReceiverExpert: currentExpert,
      },
    });

    meeting.fileName = fileName;

    await Meeting.save(meeting);
  }
}
