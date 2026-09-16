import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FirebaseService } from './firebase.service';
import { Repository } from 'typeorm';
import { CustomerServiceRepresentative } from './customerServiceRepresentative.entity';

@Injectable()
export class CustomerServiceRepresentativeAuthService {
  constructor(
    @InjectRepository(CustomerServiceRepresentative)
    private customerServiceRepresentativeRepository: Repository<CustomerServiceRepresentative>,
    @Inject(FirebaseService) private firebaseService: FirebaseService,
  ) {}

  async getCustomerServiceRepresentativeByFirebaseIdToken(
    firebaseIdToken: string,
  ): Promise<CustomerServiceRepresentative> {
    try {
      const uid = await this.firebaseService.getUidFromFirebaseIdToken(
        firebaseIdToken,
      );
      console.log('uid: ', uid);

      return await this.customerServiceRepresentativeRepository.findOne({
        firebaseUid: uid,
      });
    } catch (e) {
      console.log('ERROR: CustomerServiceRepresentativeService(): ', e.message);
      throw e;
    }
  }
}
