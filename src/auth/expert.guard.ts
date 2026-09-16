import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ExpertAuthService } from './expert.auth.service';
import { Expert } from './expert.entity';

@Injectable()
export class ExpertGuard implements CanActivate {
  constructor(private expertService: ExpertAuthService) {}

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

  async verifyIdToken(firebaseIdToken: string): Promise<Expert> {
    try {
      const expert: Expert = await this.expertService.getExpertByFirebaseIdToken(
        firebaseIdToken,
      );

      console.log('expert: ', expert);

      if (!expert) {
        console.log('expert.guard.ts: not expert ');
        throw new InternalServerErrorException();
      }

      return expert;
    } catch (e) {
      console.log('FIREBASE ID TOKEN ERROR: ', e.message);
      throw new UnauthorizedException();
    }
  }
}
