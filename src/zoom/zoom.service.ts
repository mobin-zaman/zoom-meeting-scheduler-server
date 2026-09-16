import { Inject, Injectable } from '@nestjs/common';
import { ZoomApiService } from './zom.api.service';

@Injectable()
export class ZoomService {
  constructor(@Inject(ZoomApiService) private zoomApiService: ZoomApiService) {}

  async createNewUser(firstName: string, lastName: string, email: string) {
    return await this.zoomApiService.createUser(firstName, lastName, email);
    // console.log('zoom user Id: ', zoomUserId);
  }

  async createMeeting(
    expertZoomId: string,
    description: string,
    yyyy_MM_DD: string,
    hh_mm_ss: string,
  ) {
    try {
      const response = await this.zoomApiService.createMeeting(
        expertZoomId,
        description,
        yyyy_MM_DD,
        hh_mm_ss,
      );

      // console.log('Reponse: ', response);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
