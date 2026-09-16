import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Expert } from 'src/auth/expert.entity';
import { ImageModule } from 'src/image/image.module';
import { MeetingModule } from 'src/meeting/meeting.module';
import { ExpertController } from './expert.controller';
import { ExpertService } from './expert.service';

@Module({
  imports: [
    AuthModule,
    MeetingModule,
    ImageModule,
    TypeOrmModule.forFeature([Expert]),
  ],
  controllers: [ExpertController],
  providers: [ExpertService],
})
export class ExpertModule {}
