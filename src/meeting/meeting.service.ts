import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerServiceRepresentative } from 'src/auth/customerServiceRepresentative.entity';
import { Expert } from 'src/auth/expert.entity';
import { User } from 'src/auth/user.entity';
import { PaymentGatewayService } from 'src/payment-gateway/payment-gateway.service';
import { ZoomService } from 'src/zoom/zoom.service';
import { Repository } from 'typeorm';
import { Meeting, RequestStatus } from './meeting.entity';
import { MailService } from '../mail/mail.service';
import { Raw } from 'typeorm/browser';
import { MeetingSchedulingService } from './meeting.scheduling.service';

@Injectable()
export class MeetingService {
  constructor(
    @InjectRepository(Meeting) private meetingRepository: Repository<Meeting>,
    @Inject(ZoomService) private zoomService: ZoomService,
    @Inject(PaymentGatewayService)
    private paymentGateWayService: PaymentGatewayService,
    @Inject(MailService) private mailService: MailService,
    @Inject(MeetingSchedulingService)
    private meetingSchedulingService: MeetingSchedulingService,
  ) {}

  async createMeeting(
    requestSenderUser: User,
    requestReceiverExpert: Expert,
    description: string,
    preferredTime: Date,
    preassesmentAnswer: string,
  ) {
    // const meetingExists = await this.meetingRepository.findOneOrFail({
    //   where: {
    //     requestSenderUser: requestSenderUser,
    //     requestReceiverExpert: requestReceiverExpert,
    //     status: RequestStatus.PENDING,
    //   },
    // });

    // if (meetingExists)
    //   throw new Error(
    //     `You have already requests the expert, wait for the confirmation`,
    //   );

    const payment = await this.paymentGateWayService.createPayment(
      requestSenderUser.firstName,
      requestSenderUser.email,
      requestSenderUser.phoneNumber,
      requestReceiverExpert.fee,
    );

    // console.log('Payment: ', payment);

    const meeting = new Meeting();

    meeting.requestSenderUser = requestSenderUser;
    meeting.requestReceiverExpert = requestReceiverExpert;
    meeting.payment = payment;
    meeting.description = description;
    meeting.preferredTime = preferredTime;
    meeting.preassesmentAnswers = preassesmentAnswer;

    // console.log('Prefferend time: ', prefferedTime);

    const createdMeeting = await this.meetingRepository.save(meeting);
    await this.mailService.sendMeetingCreationEmail(
      requestSenderUser.email,
      `${requestReceiverExpert.firstName} ${requestReceiverExpert.lastName}`,
      description,
      preferredTime,
    );
    return createdMeeting;
  }

  async createScheduledMeeting(
    requestSenderUser: User,
    requestReceiverExpert: Expert,
    description: string,
    time: Date,
    customerServiceRepresentative: CustomerServiceRepresentative,
  ) {
    const payment = await this.paymentGateWayService.createPayment(
      requestSenderUser.firstName,
      requestSenderUser.email,
      requestSenderUser.phoneNumber,
      requestReceiverExpert.fee,
    );

    const meeting = new Meeting();
    meeting.requestSenderUser = requestSenderUser;
    meeting.requestReceiverExpert = requestReceiverExpert;
    meeting.description = description;
    meeting.customerServiceRepresentative = customerServiceRepresentative;
    meeting.startTime = time;
    meeting.payment = payment;

    const createdMeeting = await this.meetingRepository.save(meeting);
    await this.mailService.sendMeetingCreationEmail(
      requestSenderUser.email,
      `${requestReceiverExpert.firstName} ${requestReceiverExpert.lastName}`,
      description,
      time,
    );
    return createdMeeting;
  }

  async acceptMeetingRequest(
    meetingId: number,
    startTime: Date,
    requestReceiverExpert: Expert,
  ) {
    const meeting = await this.meetingRepository.findOneOrFail({
      where: {
        id: meetingId,
        requestReceiverExpert,
      },
    });

    const dateStartTime = new Date(startTime);
    const yyyy_MM_DD = dateStartTime.toISOString().slice(0, 10);
    const hh_mm_ss = dateStartTime.toTimeString().split(' ')[0];

    // console.log('YY_MM_DD: ', yyyy_MM_DD);
    // console.log('hh_mm_ss: ', hh_mm_ss);

    const zoomMeeting = await this.zoomService.createMeeting(
      requestReceiverExpert.zoomUserId,
      meeting.description,
      yyyy_MM_DD,
      hh_mm_ss,
    );

    const { start_url, join_url } = zoomMeeting;

    meeting.startTime = startTime;
    meeting.status = RequestStatus.ACCEPTED;
    meeting.startUrl = start_url;
    meeting.joinUrl = join_url;
    meeting.zoomApiResponse = JSON.stringify(zoomMeeting);

    const updatedMeeting = await this.meetingRepository.save(meeting);
    await this.mailService.sendMeetingConfirmationEmail(
      updatedMeeting.requestSenderUser.email,
      `${requestReceiverExpert.firstName} ${requestReceiverExpert.lastName}`,
      updatedMeeting.description,
      updatedMeeting.startUrl,
      updatedMeeting.startTime,
    );
    await this.meetingSchedulingService.scheduleEmail(
      updatedMeeting.requestSenderUser.email,
      `${requestReceiverExpert.firstName} ${requestReceiverExpert.lastName}`,
      updatedMeeting.description,
      updatedMeeting.startTime,
      updatedMeeting.startUrl,
    );
  }

  async rejectMeeting(meetingId: number, requestReceiverExpert: Expert) {
    const meeting = await this.meetingRepository.findOneOrFail({
      where: {
        id: meetingId,
        requestReceiverExpert,
      },
    });

    meeting.status = RequestStatus.REJECTED;

    await this.meetingRepository.save(meeting);
  }

  async cancelMeeting(meetingId: number, requestSenderUser: User) {
    console.log('user: ', requestSenderUser);
    console.log('meetingId: ', meetingId);
    const meeting = await this.meetingRepository.findOneOrFail({
      where: {
        id: meetingId,
        requestSenderUser,
      },
    });

    meeting.status = RequestStatus.CANCELED;

    await this.meetingRepository.save(meeting);
  }

  async getPendingMeetingsExpert(requestReceiverExpert: Expert) {
    const meetings: Meeting[] = await this.meetingRepository.find({
      where: {
        requestReceiverExpert,
        status: RequestStatus.PENDING,
      },
    });
    return meetings;
  }

  async getPendingMeetingsUser(requestSenderUser: User) {
    const meetings: Meeting[] = await this.meetingRepository.find({
      where: {
        requestSenderUser,
        status: RequestStatus.PENDING,
      },
    });

    return meetings;
  }

  async getAllMeetingsUser(requestSenderUser: User) {
    const meetings = await this.meetingRepository.find({
      where: {
        requestSenderUser,
      },
    });

    return meetings;
  }

  async getAllMeetingsExpert(requestReceiverExpert: Expert) {
    const meetings = await this.meetingRepository.find({
      where: {
        requestReceiverExpert,
      },
    });
    return meetings;
  }

  async getExpertOfMeeting(meetingId: number): Promise<Expert> {
    const meeting = await this.meetingRepository.findOneOrFail({
      where: {
        id: meetingId,
      },
    });
    return meeting.requestReceiverExpert;
  }

  async getAllMeetings() {
    return await this.meetingRepository.find({
      order: {
        id: 'DESC',
      },
    });
  }
}
