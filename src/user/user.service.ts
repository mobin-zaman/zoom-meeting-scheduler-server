import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Expert } from 'src/auth/expert.entity';
import { ExpertGeneralService } from 'src/auth/expert.general.service';
import { User } from 'src/auth/user.entity';
import { ImageService } from 'src/image/image.service';
import { MeetingService } from 'src/meeting/meeting.service';
import { Repository } from 'typeorm';
import { MeetingRequestDto } from './dto/meeting.request.dto';
import { Meeting } from '../meeting/meeting.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Expert) private expertRepository: Repository<Expert>,
    @Inject(MeetingService) private meetingService: MeetingService,
    @Inject(ExpertGeneralService)
    private expertGeneralService: ExpertGeneralService,
    @Inject(ImageService) private imageService: ImageService,
  ) {}

  async requestMeeting(
    meetingRequestDto: MeetingRequestDto,
    requestSenderUser: User,
  ) {
    const {
      description,
      expertId,
      preferredTime,
      preassesmentAnswer,
    } = meetingRequestDto;

    const expert: Expert = await this.expertRepository.findOneOrFail({
      where: {
        id: expertId,
      },
    });

    console.log('Expert: ', expert);

    await this.meetingService.createMeeting(
      requestSenderUser,
      expert,
      description,
      preferredTime,
      preassesmentAnswer,
    );
  }

  async uploadProfilePicture(currentUser: User, image) {
    const imageUrl = await this.imageService.uploadImage(image.buffer);

    currentUser.photoUrl = imageUrl;

    return await this.userRepository.save(currentUser);
  }

  async getPendingMeetingRequests(user: User) {
    return await this.meetingService.getPendingMeetingsUser(user);
  }

  async getAllMeetings(user: User) {
    return await this.meetingService.getAllMeetingsUser(user);
  }

  async cancelMeeting(meetingId, currentUser: User) {
    await this.meetingService.cancelMeeting(meetingId, currentUser);
  }

  async searchExpert(query) {
    return await this.expertGeneralService.searchExpertByName(query);
  }

  async getExperts() {
    return await this.expertGeneralService.getExperts();
  }

  async getExpertCategories() {
    return await this.expertGeneralService.getExpertCategories();
  }

  async getExpertByCategory(categoryId) {
    return await this.expertGeneralService.getExpertByCategory(categoryId);
  }

  async getExpertQuestions(expertId) {
    return await this.expertGeneralService.getPreAssessmentQuestions(expertId);
  }

  async uploadMeetingFile(currentUser: User, fileName: string, meetingId) {
    const meeting = await Meeting.findOneOrFail({
      where: {
        id: meetingId,
        requestSenderUser: currentUser,
      },
    });

    meeting.userUploadedFileName = fileName;

    await Meeting.save(meeting);
  }
}
