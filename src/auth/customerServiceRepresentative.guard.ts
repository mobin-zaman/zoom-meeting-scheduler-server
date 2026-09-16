import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CustomerServiceRepresentative } from './customerServiceRepresentative.entity';
import { CustomerServiceRepresentativeAuthService } from './customerServiceRepresentative.auth.service';

@Injectable()
export class CustomerServiceRepresentativeGuard implements CanActivate {
  constructor(
    private customerServiceRepresentativeService: CustomerServiceRepresentativeAuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const authHeader = request.headers.authorization;

      if (!authHeader) {
        console.log('No bearer token');
        throw new UnauthorizedException();
      }

      const firebaseIdToken = authHeader.replace('Bearer ', '');

      const user = await this.verifyIdToken(firebaseIdToken);

      request.user = user;

      return true;
    } catch (e) {
      throw e;
    }
  }

  async verifyIdToken(
    firebaseIdToken: string,
  ): Promise<CustomerServiceRepresentative> {
    try {
      const customerServiceRepresentative: CustomerServiceRepresentative = await this.customerServiceRepresentativeService.getCustomerServiceRepresentativeByFirebaseIdToken(
        firebaseIdToken,
      );

      console.log(
        'customerServiceRepresentative: ',
        customerServiceRepresentative,
      );

      if (!customerServiceRepresentative) {
        console.log('customerServiceRepresentative.guard.ts: not expert ');
        throw new InternalServerErrorException();
      }

      return customerServiceRepresentative;
    } catch (e) {
      console.log('FIREBASE ID TOKEN ERROR: ', e.message);
      throw new UnauthorizedException();
    }
  }
}
