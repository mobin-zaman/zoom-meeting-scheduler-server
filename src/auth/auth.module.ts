import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirebaseService } from './firebase.service';
import { User } from './user.entity';
import { UserAuthService } from './user.auth.service';
import { ExpertAuthService } from './expert.auth.service';
import { CustomerServiceRepresentative } from './customerServiceRepresentative.entity';
import { Expert } from './expert.entity';
import { AuthController } from './auth.controller';
import { CustomerServiceRepresentativeAuthService } from './customerServiceRepresentative.auth.service';
import { Admin } from './admin.entity';
import { AdminAuthService } from './admin.auth.service';
import { ExpertGeneralService } from './expert.general.service';
import { ExpertCategory } from './expert.category.entity';
import { ZoomModule } from 'src/zoom/zoom.module';
import { ZoomService } from 'src/zoom/zoom.service';
import { CustomerServiceGeneralService } from './customerServiceRepresentative.general.service';
import { UserGeneralService } from './user.general.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Admin,
      User,
      Expert,
      ExpertCategory,
      CustomerServiceRepresentative,
    ]),
    ZoomModule,
  ],
  providers: [
    UserAuthService,
    FirebaseService,
    ExpertAuthService,
    CustomerServiceRepresentativeAuthService,
    CustomerServiceGeneralService,
    AdminAuthService,
    ExpertGeneralService,
    ZoomService,
    UserGeneralService,
  ],
  exports: [
    UserAuthService,
    ExpertAuthService,
    AdminAuthService,
    CustomerServiceRepresentativeAuthService,
    CustomerServiceGeneralService,
    FirebaseService,
    ExpertGeneralService,
    UserGeneralService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
