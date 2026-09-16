import { Module } from '@nestjs/common';
import { CustomerServiceRepresentativeService } from './customer-service-representative.service';
import { CustomerServiceRepresentativeController } from './customer-service-representative.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerServiceRepresentative } from 'src/auth/customerServiceRepresentative.entity';
import { AuthModule } from 'src/auth/auth.module';
import { MeetingModule } from 'src/meeting/meeting.module';
import { User } from 'src/auth/user.entity';
import { Expert } from 'src/auth/expert.entity';
import { ImageModule } from 'src/image/image.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerServiceRepresentative, User, Expert]),
    AuthModule,
    MeetingModule,
    ImageModule,
  ],
  providers: [CustomerServiceRepresentativeService],
  controllers: [CustomerServiceRepresentativeController],
})
export class CustomerServiceRepresentativeModule {}
