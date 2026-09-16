import { Injectable } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { MeetingService } from './meeting.service';
import { CronJob } from 'cron';

@Injectable()
export class MeetingSchedulingService {
  constructor(
    private mailService: MailService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}
  // var date = new Date("Fri Jan 15 2016 00:00:00");
  // date.setHours(date.getHours()-5);
  // date.setMinutes(date.getMinutes()-30);

  scheduleEmail(
    destinationEmail,
    doctorName,
    description,
    meetingStartTime,
    zoomLink,
  ) {
    const date = new Date(meetingStartTime);
    date.setMinutes(date.getMinutes() - 30);
    // const date = new Date();
    const job = new CronJob(date, () => {
      this.mailService
        .sendMeetingReminderEmail(
          destinationEmail,
          doctorName,
          description,
          meetingStartTime,
          zoomLink,
        )
        .then((r) => {
          console.log('Mail sent: ', r);
        });
      // this.emailService.sendMail({
      //   to: emailSchedule.recipient,
      //   subject: emailSchedule.subject,
      //   text: emailSchedule.content
      // })
    });
    this.schedulerRegistry.addCronJob(
      `${Date.now()}${zoomLink} scheduled for meeting`,
      job,
    );
    job.start();
  }
}
