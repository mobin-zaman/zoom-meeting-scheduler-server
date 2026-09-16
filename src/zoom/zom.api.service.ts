import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import * as jsonwebtoken from 'jsonwebtoken';

@Injectable()
export class ZoomApiService {
  constructor(
    private configService: ConfigService, // private jwtService: JwtService,
  ) {}

  private BASE_URL = 'https://api.zoom.us/v2/';

  async createUser(firstName: string, lastName: string, email: string) {
    try {
      const requestBody = {
        action: 'custCreate',
        user_info: {
          first_name: firstName,
          last_name: lastName,
          email: email,
          type: 1,
        },
      };

      const ZOOM_USER_ENDPOINT = `${this.BASE_URL}/users`;

      const response = await axios.post(ZOOM_USER_ENDPOINT, requestBody, {
        headers: this.getHeader(),
      });

      console.log('Response: ', response);
      console.log('Response: ', response.data);

      return { zoomUserId: response.data.id };
    } catch (error) {
      console.log('ERROR: : ', error);
    }
  }

  /**
   *
   * @param expertZoomId
   * @param userZoomId
   * @param yyyy_MM_DD -> year, month,date -> example "2020-03-31T12:02:00"
   * @param hh_mm  -> hour minute
   */
  async createMeeting(
    expertZoomId: string,
    description: string,
    yyyy_MM_DD: string,
    hh_mm_ss: string,
  ) {
    //ref:  https://marketplace.zoom.us/docs/api-reference/other-references/abbreviation-lists#timezones
    const TIME_ZONE_ID = 'Asia/Dhaka';
    const startTime = `${yyyy_MM_DD}T${hh_mm_ss}`;
    const ZOOM_MEETING_CREATE_ENDPOINT = `${this.BASE_URL}/users/${expertZoomId}/meetings`;
    const requestBody = {
      type: 2,
      start_time: startTime,
      agenda: description,
      timezone: TIME_ZONE_ID,
      // schedule_for: userZoomId
    };

    try {
      const response = await axios.post(
        ZOOM_MEETING_CREATE_ENDPOINT,
        requestBody,
        {
          headers: this.getHeader(),
        },
      );

      // console.log('Response: ', response);
      return response.data;
    } catch (error) {
      console.log('Error: ', error);
      throw error;
    }
  }

  private getHeader() {
    const header = {
      Authorization: this.getJwtToken(),
      'User-Agent': 'Zoom-Jwt-Request',
      'content-type': 'application/json',
    };
    return header;
  }

  private getJwtToken() {
    //1 hour time from now
    // const expiryTime = (new Date().getTime() + 60 * 60 * 1000) / 1000;
    const expiryTime = (new Date().getTime() + 30 * 1000) / 1000;

    console.log('expiryTime: ', expiryTime);

    const zoomApiKey = this.configService.get<string>('ZOOM_API_KEY');
    const zoomSecret = this.configService.get<string>('ZOOM_SECRET');

    const payload = {
      iss: zoomApiKey,
      // eslint-disable-next-line prettier/prettier
      exp: new Date().getTime() + 500000,
    };

    const token = jsonwebtoken.sign(payload, zoomSecret);

    // console.log("TOKEN TOKEN: ", token);
    // const token =
    // 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6Im1OWVl0eEpqUzFxQmZmR1NfQWRFRHciLCJleHAiOjE2MzkzNjgwMDAsImlhdCI6MTYxNDI2OTcyN30.AiV4qknNCqISV9AjI_S9u9I5irKTG1ujM2WGmiA6yxg';
    // console.log('Token: ', token);
    return `Bearer ${token}`;
  }
}
