import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerServiceRepresentative } from 'src/auth/customerServiceRepresentative.entity';
import { Expert } from 'src/auth/expert.entity';
import { User } from 'src/auth/user.entity';
import { MeetingService } from 'src/meeting/meeting.service';
import { Repository } from 'typeorm';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateUserDto } from '../admin/dto/update.user.dto';
import { CustomerServiceGeneralService } from 'src/auth/customerServiceRepresentative.general.service';
import { ImageService } from 'src/image/image.service';
import { ExpertGeneralService } from 'src/auth/expert.general.service';
import { UserGeneralService } from 'src/auth/user.general.service';
import { AcceptMeetingRequestDto } from 'src/expert/dto/accept.meeting.request.dto';
import { RequestStatus } from 'src/meeting/meeting.entity';

/**
 *  TODO: customer service
 *  can set meeting
 *  can set user information
 *  can see the meeting user and expert wise
 */
@Injectable()
export class CustomerServiceRepresentativeService {
  constructor(
    @InjectRepository(CustomerServiceRepresentative)
    private customerServiceRepresentativeRepository: Repository<CustomerServiceRepresentative>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Expert) private expertRepository: Repository<Expert>,
    @Inject(MeetingService) private meetingService: MeetingService,
    @Inject(CustomerServiceGeneralService)
    private customerServiceGeneralService: CustomerServiceGeneralService,
    @Inject(ImageService) private imageService: ImageService,
    @Inject(ExpertGeneralService)
    private expertGeneralService: ExpertGeneralService, // @Inject(UserGenralS)
    @Inject(UserGeneralService) private userGeneralService: UserGeneralService,
  ) {}

  async createMeeting(
    createMeetingDto: CreateMeetingDto,
    customerServiceRepresentative: CustomerServiceRepresentative,
  ) {
    const { userId, expertId, description, startTime } = createMeetingDto;
    const user = await this.userRepository.findOneOrFail({
      where: {
        id: userId,
      },
    });

    const expert = await this.expertRepository.findOneOrFail({
      where: {
        id: expertId,
      },
    });

    const meeting = await this.meetingService.createScheduledMeeting(
      user,
      expert,
      description,
      startTime,
      customerServiceRepresentative,
    );

    await this.meetingService.acceptMeetingRequest(
      meeting.id,
      startTime,
      expert,
    );
  }

  async getAllUsers() {
    return await this.userRepository.find();
  }

  async searchUser(query: string) {
    return await this.userGeneralService.searchUser(query);
    // const users = await this.userRepository
    //   .createQueryBuilder('user')
    //   .where('UPPER(firstName) LIKE :query OR UPPER(lastName) LIKE :query', {
    //     query: `%${query.toUpperCase()}%`,
    //   })
    //   .getMany();

    // const resultantUsers: User[] = [];
    // for (const user of users) {
    //   resultantUsers.push(
    //     await this.userRepository.findOne({
    //       where: {
    //         id: user.id,
    //       },
    //     }),
    //   );
    // }

    // return resultantUsers;
  }

  async getUser(userId: any) {
    return await this.userRepository.findOneOrFail({
      where: {
        id: userId,
      },
    });
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneOrFail({
      where: {
        id: userId,
      },
    });

    const { firstName, lastName, phoneNumber } = updateUserDto;

    user.firstName = firstName;
    user.lastName = lastName;
    user.phoneNumber = phoneNumber;

    return await this.userRepository.save(user);
  }

  async getMeetingsOfUser(userId) {
    await this.userRepository.findOneOrFail({
      where: {
        id: userId,
      },
    });

    return await this.meetingService.getAllMeetingsUser(userId);
  }

  async getAllExperts() {
    return await this.expertRepository.find();
  }

  async getExpert(expertId) {
    return await this.expertRepository.findOneOrFail({
      where: {
        id: expertId,
      },
    });
  }

  async searchExpert(query: string) {
    console.log('query: search expert: ', query);
    return await this.expertGeneralService.searchExpertByName(query);
  }

  async getMeetingsOfExpert(expertId) {
    await this.expertRepository.findOneOrFail({
      where: {
        id: expertId,
      },
    });
    return await this.meetingService.getAllMeetingsExpert(expertId);
  }

  async updateProfile(
    updateCustomerServiceRepresentativeDto,
    currentCustomerService,
  ) {
    return await this.customerServiceGeneralService.updateCustomerServiceRepresentative(
      updateCustomerServiceRepresentativeDto,
      currentCustomerService.id,
    );
  }

  async uploadProfilePicture(
    currentCustomerService: CustomerServiceRepresentative,
    image,
  ) {
    const imageUrl = await this.imageService.uploadImage(image.buffer);
    currentCustomerService.photoUrl = imageUrl;
    return await this.customerServiceRepresentativeRepository.save(
      currentCustomerService,
    );
  }

  async acceptMeetingRequest(
    meetingId: number,
    acceptMeetingRequestDto: AcceptMeetingRequestDto,
  ) {
    const { startTime } = acceptMeetingRequestDto;
    const requestReceiverExpert = await this.meetingService.getExpertOfMeeting(
      meetingId,
    );
    await this.meetingService.acceptMeetingRequest(
      meetingId,
      startTime,
      requestReceiverExpert,
    );
  }

  async getMeetings() {
    return await this.meetingService.getAllMeetings();
  }
}
