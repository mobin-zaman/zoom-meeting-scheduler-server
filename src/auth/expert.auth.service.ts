import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FirebaseService } from './firebase.service';
import { Repository } from 'typeorm';
import { Expert } from './expert.entity';

@Injectable()
export class ExpertAuthService {
  constructor(
    @InjectRepository(Expert) private expertRepository: Repository<Expert>,
    @Inject(FirebaseService) private firebaseService: FirebaseService,
  ) {}

  async getExpertByFirebaseIdToken(firebaseIdToken: string): Promise<Expert> {
    try {
      const uid = await this.firebaseService.getUidFromFirebaseIdToken(
        firebaseIdToken,
      );
      console.log('uid: ', uid);

      return await this.expertRepository.findOne({
        firebaseUid: uid,
      });
    } catch (e) {
      console.log(
        'ERROR: ExpertService.getExpertByFirebaseIdToken(): ',
        e.message,
      );
      throw e;
    }
  }
}
