import { Controller, Get, UseGuards } from '@nestjs/common';
import { ExpertGuard } from './expert.guard';
import { UserGuard } from './user.guard';

@Controller('auth')
export class AuthController {
  @UseGuards(UserGuard)
  @Get('/user-type/is-user')
  async checkIfUser() {
    return true;
  }

  @UseGuards(ExpertGuard)
  @Get('/user-type/expert')
  async checkIfExpert() {
    return true;
  }
}
