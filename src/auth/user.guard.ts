import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserAuthService } from './user.auth.service';
import { User } from './user.entity';
import axios from 'axios';
import { auth } from 'firebase-admin';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ZoomService } from 'src/zoom/zoom.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    @Inject(UserAuthService) private userAuthService: UserAuthService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject(ZoomService) private zoomService: ZoomService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const authHeader = request.headers.authorization;

      if (!authHeader) {
        console.log('No bearer token');
        throw new UnauthorizedException('need bearer token');
      }
      const token = authHeader.replace('Bearer ', '');

      const data = await this.verifyBearerToken(token);
      // console.log('Data: ', data);

      const user = await this.verifyUser(data);

      // const user = null;
      request.user = user;

      return true;
    } catch (e) {
      console.log('ERROR: ', e);
      return false;
    }
  }

  private async verifyBearerToken(token) {
    const USER_BEARER_TOKEN_VALIDATION_ENDPOINT = this.configService.get(
      'USER_BEARER_TOKEN_VALIDATION_ENDPOINT',
    );
    console.log('Auth header: ', auth);
    console.log('token:', token);

    const response = await axios.post(
      USER_BEARER_TOKEN_VALIDATION_ENDPOINT,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    // console.log("Response: ", response);
    if (response.data.statusCode !== 200) {
      throw new UnauthorizedException('bearer token invalid');
    }

    return response.data.data;
  }

  async verifyUser(data): Promise<User> {
    try {
      const user: User = await this.userAuthService.getUserByForumId(data.id);

      console.log('User: ', user);

      if (!user) {
        console.log('user.guard.ts: not user ');

        // throw new InternalServerErrorException();

        // const { zoomUserId } = await this.zoomService.createNewUser(
        //   data.firstName,
        //   data.lastName,
        //   data.email,
        // );

        const newUser = new User();

        newUser.firstName = data.firstName;
        newUser.lastName = data.lastName;
        newUser.email = data.email;
        newUser.phoneNumber = data.phone;
        newUser.forumUserId = data.id;
        newUser.zoomUserId = null;

        return await this.userRepository.save(newUser);
      } else {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.email = data.email;
        user.phoneNumber = data.phone;
        user.forumUserId = data.id;
        return await this.userRepository.save(user);
      }
    } catch (e) {
      console.log('User guard error: ', e.message);
      throw new UnauthorizedException();
    }
  }
}
