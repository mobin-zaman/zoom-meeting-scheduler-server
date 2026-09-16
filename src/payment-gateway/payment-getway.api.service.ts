import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as FormData from 'form-data';
import fetch from 'node-fetch';

@Injectable()
export class PaymentGatewayApiService {
  constructor(@Inject(ConfigService) private configService: ConfigService) {}

  // private BASE_URL = 'https://sandbox.sslcommerz.com/gwprocess/v4/invoice.php';
  private BASE_URL = 'https://securepay.sslcommerz.com/gwprocess/v4/invoice.php';


  async createInvoice(
    acct_no: number,
    cus_name: string,
    cus_email: string,
    cus_phone: string,
    payment_fee: number,
  ) {
    // const bodyFormData = new FormData();
    try {
      const bodyFormData = new URLSearchParams();
      console.log('store id: ', this.configService.get('SSL_COMMERZ_STORE_ID'));

      bodyFormData.append(
        'store_id',
        this.configService.get('SSL_COMMERZ_STORE_ID'),
      );
      bodyFormData.append(
        'store_passwd',
        this.configService.get('SSL_COMMERZ_STORE_PASSWD'),
      );
      bodyFormData.append('refer', this.configService.get('SSL_COMMERZ_REFER'));
      //FIXME: total amount should be in database next time, for admin to set
      bodyFormData.append(
        'total_amount',
        // this.configService.get('SSL_COMMERZ_AMOUNT'),
        payment_fee.toString(),
      );
      bodyFormData.append('currency', 'BDT');
      bodyFormData.append('acct_no', acct_no.toString());
      bodyFormData.append('cus_name', cus_name.toString());
      bodyFormData.append('cus_email', cus_email);
      bodyFormData.append('cus_phone', cus_phone);
      bodyFormData.append('is_sent_email', 'yes');
      bodyFormData.append('tran_id', acct_no.toString());
      bodyFormData.append('cus_add1', 'Bangladesh');
      bodyFormData.append('cus_city', 'Dhaka');
      bodyFormData.append('cus_country', 'Bangladesh');
      bodyFormData.append('shipping_method', 'NO');
      bodyFormData.append('product_name', 'Service');
      bodyFormData.append('product_category', 'Service');
      bodyFormData.append('product_profile', 'non-physical-goods');
      bodyFormData.append('value_a', 'ECARE_API');
      bodyFormData.append(
        'ipn_url',
        this.configService.get('SSL_COMMERZ_IPN_URL'),
      );
      // console.log('Body fordata: ', bodyFormData);

      // console.log("Body formdata length", bodyFormData.getLengthSync());

      const response = await axios.post(this.BASE_URL, bodyFormData, {
        headers: {
          // 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      // const options = {
      //     method: "POST",
      //     body: bodyFormData
      // };
      // const response = await fetch(this.BASE_URL, options);

      console.log('Reponse: ', response.data);

      return response.data;
    } catch (e) {
      console.log('Error in create payment: ', e);
    }
  }
}
