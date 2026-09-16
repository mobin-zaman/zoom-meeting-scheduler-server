import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FirebaseService } from './firebase.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserAuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject(FirebaseService) private firebaseService: FirebaseService,
  ) {}

  // async getUserByFirebaseIdToken(firebaseIdToken: string): Promise<User> {
  //   try {
  //     const uid = await this.firebaseService.getUidFromFirebaseIdToken(
  //       firebaseIdToken,
  //     );
  //     console.log('uid: ', uid);

  //     return await this.userRepository.findOne({
  //       firebaseUid: uid,
  //     });
  //   } catch (e) {
  //     console.log('ERROR: agentService.getAgentByFirebaseIdToken: ', e.message);
  //     throw e;
  //   }
  // }

  async getUserByForumId(id): Promise<User> {
    try {
      return await this.userRepository.findOne({
        where: {
          forumUserId: id,
        },
      });
    } catch (e) {
      console.log('ERROR: agentService.getAgentByFirebaseIdToken: ', e.message);
      throw e;
    }
  }
}
