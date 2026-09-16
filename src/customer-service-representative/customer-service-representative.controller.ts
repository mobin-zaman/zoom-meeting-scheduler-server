import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CustomerServiceRepresentative } from 'src/auth/customerServiceRepresentative.entity';
import { CustomerServiceRepresentativeGuard } from 'src/auth/customerServiceRepresentative.guard';
import { CurrentUser } from 'src/auth/get-user.decorator';
import { CustomerServiceRepresentativeService } from './customer-service-representative.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateUserDto } from '../admin/dto/update.user.dto';
import { UpdateCustomerServiceRepresentativeDto } from 'src/admin/dto/update-customer-service-representative.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AcceptMeetingRequestDto } from 'src/expert/dto/accept.meeting.request.dto';

@UseGuards(CustomerServiceRepresentativeGuard)
@UsePipes(ValidationPipe)
@Controller('customer-service-representative')
export class CustomerServiceRepresentativeController {
  constructor(
    @Inject(CustomerServiceRepresentativeService)
    private customerServiceRepresentativeService: CustomerServiceRepresentativeService,
  ) {}

  @Get('/profile')
  async getCustomerServiceRepresentativeProfile(
    @CurrentUser() currentCustomerService: CustomerServiceRepresentative,
  ) {
    return currentCustomerService;
  }

  @Put('/profile')
  async editExpertProfile(
    @CurrentUser() currentCustomerService: CustomerServiceRepresentative,
    @Body() updateExpertDto: UpdateCustomerServiceRepresentativeDto,
  ) {
    return await this.customerServiceRepresentativeService.updateProfile(
      updateExpertDto,
      currentCustomerService,
    );
  }

  @Post('/profile-picture')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePicture(
    @CurrentUser() currentCustomerService: CustomerServiceRepresentative,
    @UploadedFile() image: Express.Multer.File,
  ) {
    await this.customerServiceRepresentativeService.uploadProfilePicture(
      currentCustomerService,
      image,
    );
  }

  @Post('/meeting')
  async createMeeting(
    @CurrentUser() currentCustomerService: CustomerServiceRepresentative,
    @Body() createMeetingDto: CreateMeetingDto,
  ) {
    return await this.customerServiceRepresentativeService.createMeeting(
      createMeetingDto,
      currentCustomerService,
    );
  }

  @Get('/meeting')
  async getMeetings() {
    return await this.customerServiceRepresentativeService.getMeetings();
  }

  @Put('/user/:userId')
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Param('userId') userId,
  ) {
    return await this.customerServiceRepresentativeService.updateUser(
      userId,
      updateUserDto,
    );
  }

  @Get('/user')
  async getAllUsers() {
    return await this.customerServiceRepresentativeService.getAllUsers();
  }

  @Post('/user/search')
  async userSearch(@Body('query') query: string) {
    return await this.customerServiceRepresentativeService.searchUser(query);
  }

  @Get('/user/:userId')
  async getUser(@Param('userId') userId) {
    return await this.customerServiceRepresentativeService.getUser(userId);
  }

  @Get('/user/:userId/meetings')
  async getMeetingsOfUser(@Param('userId') userId) {
    return await this.customerServiceRepresentativeService.getMeetingsOfUser(
      userId,
    );
  }

  @Post('/meeting-accept/:meetingId')
  async acceptMeetingRequest(
    @Param('meetingId') meetingId: number,
    @CurrentUser() currentCustomerService: CustomerServiceRepresentative,
    @Body() acceptMeetingRequestDto: AcceptMeetingRequestDto,
  ) {
    await this.customerServiceRepresentativeService.acceptMeetingRequest(
      meetingId,
      acceptMeetingRequestDto,
    );
  }

  @Get('/expert')
  async getAllExperts() {
    return await this.customerServiceRepresentativeService.getAllExperts();
  }

  @Get('/expert/:expertId')
  async getExpert(@Param('expertId') expertId) {
    return await this.customerServiceRepresentativeService.getExpert(expertId);
  }

  @Post('/expert/search')
  async searchExpert(@Body('query') query: string) {
    return await this.customerServiceRepresentativeService.searchExpert(query);
  }

  @Get('/expert/:expertId/meetings')
  async getExpertMeetings(@Param('expertId') expertId) {
    return await this.customerServiceRepresentativeService.getMeetingsOfExpert(
      expertId,
    );
  }
}
