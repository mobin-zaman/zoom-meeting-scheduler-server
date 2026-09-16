import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AdminGuard } from 'src/auth/admin.guard';
import { AdminService } from './admin.service';
import { CreateCustomerServiceRepresentativeDto } from './dto/create-customer-service-representative.dto';
import { CreateExpertDto } from './dto/create-expert.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateCustomerServiceRepresentativeDto } from './dto/update-customer-service-representative.dto';
import { UpdateExpertDto } from './dto/update-expert.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(@Inject(AdminService) private adminService: AdminService) {}

  @UsePipes(ValidationPipe)
  @Post('/customer-service-representative')
  async createCustomerServiceRepresentative(
    @Body()
    createCustomerServiceRepresentativeDto: CreateCustomerServiceRepresentativeDto,
  ) {
    return await this.adminService.createCustomerServiceRepresentative(
      createCustomerServiceRepresentativeDto,
    );
  }

  @Get('/customer-service-representative')
  async getAllCustomerServiceRepresentative() {
    return await this.adminService.getAllCustomerServiceRepresentative();
  }

  @Get('/customer-service-representative/:customerServiceRepresentativeId')
  async getCustomerServiceRepresentative(
    @Param('customerServiceRepresentativeId') customerServiceRepresentativeId,
  ) {
    return await this.adminService.getCustomerServiceRepresentative(
      customerServiceRepresentativeId,
    );
  }

  @UsePipes(ValidationPipe)
  @Put('/customer-service-representative/:customerServiceRepresentativeId')
  async updateCustomerServiceRepresentative(
    @Body()
    updateCustomerServiceRepresentativeDto: UpdateCustomerServiceRepresentativeDto,
    @Param('customerServiceRepresentativeId') customerServiceRepresentativeId,
  ) {
    return await this.adminService.updateCustomerServiceRepresentative(
      updateCustomerServiceRepresentativeDto,
      customerServiceRepresentativeId,
    );
  }

  @Delete('/customer-service-representative/:customerServiceRepresentativeId')
  async deleteCustomerServiceRepresentative(
    @Param('customerServiceRepresentativeId') customerServiceRepresentativeId,
  ) {
    await this.adminService.deleteCustomerServiceRepresentative(
      customerServiceRepresentativeId,
    );
  }

  // @UsePipes(ValidationPipe)
  // @Post('/user')
  // async createUser(@Body() createUserDto: CreateUserDto) {
  //   return await this.adminService.createUser(createUserDto);
  // }

  // @Get('/user')
  // async getAllUser() {
  //   return await this.adminService.getAllUser();
  // }

  // @Get('/user/:userId')
  // async getUser(@Param('userId') userId) {
  //   return await this.adminService.getUser(userId);
  // }

  // @UsePipes(ValidationPipe)
  // @Put('/user/:userId')
  // async updateUser(
  //   @Body() updateUserDto: UpdateUserDto,
  //   @Param('userId') userId,
  // ) {
  //   return await this.adminService.updateUser(updateUserDto, userId);
  // }

  // @Delete('/user/:userId')
  // async deleteUser(@Param('userId') userId) {
  //   return await this.adminService.deleteUser(userId);
  // }

  @UsePipes(ValidationPipe)
  @Post('/expert')
  async createExpert(@Body() createExpertDto: CreateExpertDto) {
    return await this.adminService.createExpert(createExpertDto);
  }

  @Get('/expert')
  async getAllExperts() {
    return await this.adminService.getAllExperts();
  }

  @Get('/expert/:expertId')
  async getExpert(@Param('expertId') expertId) {
    return await this.adminService.getExpert(expertId);
  }

  @UsePipes(ValidationPipe)
  @Put('/expert/:expertId')
  async updateExpert(
    @Param('expertId') expertId,
    @Body() updateExpertDto: UpdateExpertDto,
  ) {
    return await this.adminService.updateExpert(updateExpertDto, expertId);
  }

  @Delete('/expert/:expertId')
  async deleteExpert(@Param('expertId') expertId) {
    await this.adminService.deleteExpert(expertId);
  }

  @Post('/expert/:expertId/questions')
  async setExpertPreAssessmentQuestions(
    @Param('expertId') expertId,
    @Body('questions') questions,
  ) {
    if (!questions) throw Error('provide questions');

    await this.adminService.setExpertPreAssessmentQuestions(
      expertId,
      questions,
    );
  }

  @Get('expert/:expertId/questions')
  async getExpertAssessmentQuestions(@Param('expertId') expertId) {
    return await this.adminService.getExpertPreAssessmentQuestions(expertId);
  }

  @Post('/expert-category')
  async createExpertCategory(@Body('name') name) {
    return await this.adminService.addExpertCategory(name);
  }

  @Get('/expert-category')
  async getAllExpertCategories() {
    return await this.adminService.getExpertCategories();
  }

  @Get('/expert-category/:categoryId/expert')
  async getExpertOfCategory(@Param('categoryId') categoryId) {
    return await this.adminService.getExpertOfCategory(categoryId);
  }

  @Post('/')
  async createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return await this.adminService.createAdmin(createAdminDto);
  }

  @Get('/')
  async getAllAdmins() {
    return await this.adminService.getAllAdmins();
  }

  @Get('/:adminId')
  async getAdmin(@Param('adminId') adminId) {
    return await this.adminService.getAdmin(adminId);
  }

  @Put('/:adminId')
  async updateAdmin(
    @Param('adminId') adminId,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    return await this.adminService.updateAdmin(updateAdminDto, adminId);
  }

  @Delete('/:adminId')
  async deleteAdmin(@Param('adminId') adminId) {
    return await this.adminService.deleteAdmin(adminId);
  }
}
