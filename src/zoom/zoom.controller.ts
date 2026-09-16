import { Controller, Get } from '@nestjs/common';
import { ZoomService } from './zoom.service';

@Controller('zoom')
export class ZoomController {
  constructor(private zoomService: ZoomService) {}

  // @Get('test')
  // async test() {
  //   await this.zoomService.createNewUser(
  //     'expert',
  //     'hossain',
  //     'expert@test.com',
  //   );
  // }

  // @Get('/test/meeting')
  // async testMeeting() {
  //   try {
  //     await this.zoomService.createMeeting(
  //       'ufM9K2VGSsCqm4djTrKzKw',
  //       'test description',
  //       '2021-02-22',
  //       '16:24:00',
  //     );
  //   } catch (error) {
  //     console.log('error: ', error);
  //     throw error;
  //   }
  // }
}
