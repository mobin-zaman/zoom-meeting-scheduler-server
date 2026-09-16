import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentGatewayController } from './payment-gateway.controller';
import { PaymentGatewayService } from './payment-gateway.service';
import { PaymentGatewayApiService } from './payment-getway.api.service';
import { Payment } from './payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment])],
  controllers: [PaymentGatewayController],
  providers: [PaymentGatewayService, PaymentGatewayApiService],
  exports: [PaymentGatewayService],
})
export class PaymentGatewayModule {}
