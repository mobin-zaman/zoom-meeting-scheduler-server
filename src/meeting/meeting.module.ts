import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentGatewayModule } from 'src/payment-gateway/payment-gateway.module';
import { ZoomModule } from 'src/zoom/zoom.module';
import { Meeting } from './meeting.entity';
import { MeetingService } from './meeting.service';
import { MeetingSchedulingService } from './meeting.scheduling.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Meeting]),
    PaymentGatewayModule,
    ZoomModule,
  ],
  providers: [MeetingService, MeetingSchedulingService],
  exports: [MeetingService],
})
export class MeetingModule {}
