import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Expert } from 'src/auth/expert.entity';
import { User } from 'src/auth/user.entity';
import { ImageModule } from 'src/image/image.module';
import { MeetingModule } from 'src/meeting/meeting.module';
import { ZoomModule } from 'src/zoom/zoom.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  imports: [
    AuthModule,
    MeetingModule,
    TypeOrmModule.forFeature([User, Expert]),
    ZoomModule,
    ImageModule,
  ],
  providers: [UserService],
})
export class UserModule {}
