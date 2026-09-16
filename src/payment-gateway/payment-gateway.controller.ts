import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { PaymentGatewayService } from './payment-gateway.service';

@Controller('payment-gateway')
export class PaymentGatewayController {
  constructor(
    @Inject(PaymentGatewayService)
    private paymentGateWayService: PaymentGatewayService,
  ) {}

  //FIXME: secure this enpoint, with transcation id check
  // also have a weird link
  @Post('/')
  async checkResponse(@Body() body) {
    console.log('Body: ', body);
    await this.paymentGateWayService.verifyIPN(body);
  }

  //   @Get('/test')
  //   async createInvoice() {
  //     console.log('RUninng');
  //     await this.paymentGateWayService.createPayment(
  //       'test',
  //       'test@email.com',
  //       '0101342341',
  //     );
  //   }
}
