import { Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UpdateExpertDto } from 'src/admin/dto/update-expert.dto';
import { Expert } from 'src/auth/expert.entity';
import { ExpertGuard } from 'src/auth/expert.guard';
import { CurrentUser } from 'src/auth/get-user.decorator';
import { AcceptMeetingRequestDto } from './dto/accept.meeting.request.dto';
import { RejectMeetingRequestDto } from './dto/reject.meeting.request.dto';
import { ExpertService } from './expert.service';
import { editFileName } from '../file/file.editfilename';
import { setDestination } from '../file/file.setdestination';

@UseGuards(ExpertGuard)
@Controller('expert')
export class ExpertController {
  constructor(
    @Inject(ExpertService) private expertService: ExpertService,
    private configService: ConfigService,
  ) {}

  @Get('/profile')
  async getExpertProfile(@CurrentUser() currentExpert: Expert) {
    return currentExpert;
  }

  @Put('/profile')
  async editExpertProfile(
    @CurrentUser() currentExpert: Expert,
    @Body() updateExpertDto: UpdateExpertDto,
  ) {
    return await this.expertService.updateExpert(
      updateExpertDto,
      currentExpert.id,
    );
  }

  @Post('/profile-picture')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePicture(
    @CurrentUser() currentUser: Expert,
    @UploadedFile() image: Express.Multer.File,
  ) {
    await this.expertService.uploadProfilePicture(currentUser, image);
  }

  @UsePipes(ValidationPipe)
  @Post('/meeting-request/:meetingId')
  async acceptMeetingRequest(
    @CurrentUser() currentExpert: Expert,
    @Body() acceptMeetingRequestDto: AcceptMeetingRequestDto,
    @Param('meetingId') meetingId,
  ) {
    await this.expertService.acceptMeetingRequest(
      meetingId,
      acceptMeetingRequestDto,
      currentExpert,
    );
  }

  @Get('/meeting-request')
  async getMeetingRequests(@CurrentUser() currentExpert: Expert) {
    return await this.expertService.getMeetingRequests(currentExpert);
  }

  @Post('/meeting-request/reject')
  async rejectMeetingRequest(
    @CurrentUser() currentExpert: Expert,
    @Body() rejectMeetingRequestDto: RejectMeetingRequestDto,
  ) {
    await this.expertService.rejectMeeting(
      rejectMeetingRequestDto,
      currentExpert,
    );
  }

  @Post('/meeting/:meetingId/file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: setDestination,
        filename: editFileName,
      }),
      limits: {
        fileSize: 5242880,
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file,
    @CurrentUser() currentExpert: Expert,
    @Param('meetingId') meetingId,
  ) {
    await this.expertService.uploadMeetingFile(
      currentExpert,
      file.filename,
      meetingId,
    );
  }
}
