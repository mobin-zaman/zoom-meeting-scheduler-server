import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { UserGuard } from 'src/auth/user.guard';
import { MeetingRequestDto } from './dto/meeting.request.dto';
import { UserService } from './user.service';
import { diskStorage } from 'multer';
import { setDestination } from '../file/file.setdestination';
import { editFileName } from '../file/file.editfilename';
import { Expert } from '../auth/expert.entity';

@UseGuards(UserGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/profile')
  async getUserProfile(@CurrentUser() currentUser: User) {
    return currentUser;
  }

  @Post('/profile-picture')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @CurrentUser() currentUser: User,
    @UploadedFile() image: Express.Multer.File,
  ) {
    await this.userService.uploadProfilePicture(currentUser, image);
  }

  /**
   *  creates a meeting request from the user
   * @param meetingRequestDto
   * @param currentUser
   */
  @UsePipes(ValidationPipe)
  @Post('/meeting-request')
  async requestMeeting(
    @Body() meetingRequestDto: MeetingRequestDto,
    @CurrentUser() currentUser: User,
  ) {
    try {
      await this.userService.requestMeeting(meetingRequestDto, currentUser);
    } catch (error) {
      console.log('Error: ', error);
      throw new BadRequestException(error.message);
    }
  }

  @Get('/meeting-request')
  async getMeetingRequests(@CurrentUser() currentUser: User) {
    return await this.userService.getAllMeetings(currentUser);
  }

  @Delete('/meeting-request/:meetingId')
  async cancelMeetingRequest(
    @CurrentUser() currentUser: User,
    @Param('meetingId') meetingId,
  ) {
    try {
      await this.userService.cancelMeeting(meetingId, currentUser);
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  @Post('/expert/search')
  async expertSearch(@Body('query') query: string) {
    return await this.userService.searchExpert(query);
  }

  @Get('/expert/')
  async getExperts() {
    return await this.userService.getExperts();
  }

  @Get('/expert/category')
  async getExpertCategories() {
    return await this.userService.getExpertCategories();
  }

  @Get('/expert/category/:categoryId')
  async getExpertsByCategory(@Param('categoryId') categoryId) {
    return await this.userService.getExpertByCategory(categoryId);
  }

  @Get('/expert/:expertId/questions')
  async getExpertQuestions(@Param('expertId') expertId) {
    return await this.userService.getExpertQuestions(expertId);
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
    @CurrentUser() currentUser: User,
    @Param('meetingId') meetingId,
  ) {
    try {
      await this.userService.uploadMeetingFile(
        currentUser,
        file.filename,
        meetingId,
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
