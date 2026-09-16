import { Injectable } from '@nestjs/common';
// import { FirebaseService } from './firebase.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerServiceRepresentative } from './customerServiceRepresentative.entity';
import { UpdateCustomerServiceRepresentativeDto } from 'src/admin/dto/update-customer-service-representative.dto';

@Injectable()
export class CustomerServiceGeneralService {
  constructor(
    @InjectRepository(CustomerServiceRepresentative)
    private customerServiceRepresentativeRepository: Repository<CustomerServiceRepresentative>,
  ) {}

  async updateCustomerServiceRepresentative(
    updateCustomerServiceRepresentativeDto: UpdateCustomerServiceRepresentativeDto,
    customerServiceRepresentativeId,
  ) {
    const customerServiceRepresentative = await this.customerServiceRepresentativeRepository.findOneOrFail(
      {
        where: {
          id: customerServiceRepresentativeId,
        },
      },
    );

    const {
      firstName,
      lastName,
      phoneNumber,
    } = updateCustomerServiceRepresentativeDto;

    customerServiceRepresentative.firstName = firstName;
    customerServiceRepresentative.lastName = lastName;
    customerServiceRepresentative.phoneNumber = phoneNumber;

    return await this.customerServiceRepresentativeRepository.save(
      customerServiceRepresentative,
    );
  }
}
