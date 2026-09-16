import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentGatewayApiService } from './payment-getway.api.service';
import { Payment, PaymentStatus } from './payment.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PaymentGatewayService {
  constructor(
    @InjectRepository(Payment) private paymentRepository: Repository<Payment>,
    @Inject(PaymentGatewayApiService)
    private paymentGatewayApiService: PaymentGatewayApiService,
  ) {}

  async createPayment(customerName, customerEmail, customerPhone, paymentFee) {
    let phoneNumber = '01111111111';

    if (customerPhone) phoneNumber = customerPhone;

    const transactionId = uuid();

    const data = await this.paymentGatewayApiService.createInvoice(
      transactionId,
      customerName,
      customerEmail,
      phoneNumber,
      paymentFee,
    );

    console.log('payment data: -----> ', data);

    const { pay_url, invoice_id } = data;

    const payment = new Payment();
    payment.payUrl = pay_url;
    payment.invoiceId = invoice_id;
    payment.transactionId = transactionId;

    return await this.paymentRepository.save(payment);
  }

  async verifyIPN(body) {
    const { status, val_id, tran_id } = body;
    console.log("Body of ipn: ", body);

    if (status !== 'VALID') throw new Error('Payment invalid');

    const invoiceId = tran_id.split('-')[0];

    const payment = await this.paymentRepository.findOneOrFail({
      where: {
        invoiceId,
      },
    });

    payment.ipnBody = JSON.stringify(body);
    payment.paymentStatus = PaymentStatus.DONE;
    await this.paymentRepository.save(payment);
  }
}
