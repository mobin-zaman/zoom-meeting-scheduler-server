import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendMeetingCreationEmail(
    destinationEmail: string,
    doctorName: string,
    description: string,
    meetingTime,
  ) {
    const mailBody = `Your meeting with ${doctorName} about ${description} has been created successfully. It will be hold on ${meetingTime}`;
    const sendEmailArgs = {
      to: destinationEmail,
      subject: 'Meeting Creation Successful',
      text: mailBody, // plaintext version
      html: '<div>' + mailBody + '</div>',
    };
    // console.log("destinationEmail; ",destinationEmail);
    // console.log("Producing result: " )
    const result = await this.mailerService.sendMail(sendEmailArgs);
    // console.log("Result: ", result);
  }

  async sendMeetingConfirmationEmail(
    destinationEmail: string,
    doctorName: string,
    description: string,
    zoomLink: string,
    meetingTime,
  ) {
    const mailBody = `Your meeting with ${doctorName} about ${description} has been confirmed successfully. It will be hold on ${meetingTime}. You can join the meeting using the link: ${zoomLink}`;
    const sendEmailArgs = {
      to: destinationEmail,
      subject: 'Meeting Confirmation Update',
      text: mailBody,
      html: '<div>' + mailBody + '</div>',
    };
    await this.mailerService.sendMail(sendEmailArgs);
  }

  async sendMeetingReminderEmail(
    destinationEmail: string,
    doctorName: string,
    description: string,
    meetingTime,
    zoomLink: string,
  ) {
    const mailBody = `Your meeting with ${doctorName} about ${description} has been scheduled to ${meetingTime}. You can join the meeting using the link: ${zoomLink}`;
    const sendEmailArgs = {
      to: destinationEmail,
      subject: 'Meeting Reminder',
      text: mailBody,
      html: '<div>' + mailBody + '</div>',
    };
    await this.mailerService.sendMail(sendEmailArgs);
  }
}
