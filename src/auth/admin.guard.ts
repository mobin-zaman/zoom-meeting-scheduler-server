import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Admin } from './admin.entity';
import { AdminAuthService } from './admin.auth.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private adminService: AdminAuthService) {}

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

  async verifyIdToken(firebaseIdToken: string): Promise<Admin> {
    try {
      const admin: Admin = await this.adminService.getAdminByFirebaseIdToken(
        firebaseIdToken,
      );

      console.log('Admin: ', admin);

      if (!admin) {
        console.log('admin.guard.ts: not admin ');
        throw new InternalServerErrorException();
      }

      return admin;
    } catch (e) {
      console.log('FIREBASE ID TOKEN ERROR: ', e.message);
      throw new UnauthorizedException();
    }
  }
}
