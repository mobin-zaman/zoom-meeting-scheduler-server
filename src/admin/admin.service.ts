import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from 'src/auth/admin.entity';
import { CustomerServiceRepresentative } from 'src/auth/customerServiceRepresentative.entity';
import { ExpertCategory } from 'src/auth/expert.category.entity';
import { Expert } from 'src/auth/expert.entity';
import { ExpertGeneralService } from 'src/auth/expert.general.service';
import { FirebaseService } from 'src/auth/firebase.service';
import { User } from 'src/auth/user.entity';
import { ZoomService } from 'src/zoom/zoom.service';
import { Repository } from 'typeorm';
import { CreateCustomerServiceRepresentativeDto } from './dto/create-customer-service-representative.dto';
import { CreateExpertDto } from './dto/create-expert.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateCustomerServiceRepresentativeDto } from './dto/update-customer-service-representative.dto';
import { UpdateExpertDto } from './dto/update-expert.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(CustomerServiceRepresentative)
    private customerServiceRepresentativeRepository: Repository<CustomerServiceRepresentative>,
    @InjectRepository(Expert) private expertRepository: Repository<Expert>,
    @InjectRepository(ExpertCategory)
    private expertCategoryRepository: Repository<ExpertCategory>,
    @Inject(FirebaseService) private firebaseService: FirebaseService,
    @Inject(ZoomService) private zoomService: ZoomService,
    @Inject(ExpertGeneralService)
    private expertGeneralService: ExpertGeneralService,
  ) {}

  async createCustomerServiceRepresentative(
    createCustomerServiceRepresentativeDto: CreateCustomerServiceRepresentativeDto,
  ) {
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
    } = createCustomerServiceRepresentativeDto;

    const createdCustomerServiceRepresentative = new CustomerServiceRepresentative();

    createdCustomerServiceRepresentative.firstName = firstName;
    createdCustomerServiceRepresentative.lastName = lastName;
    createdCustomerServiceRepresentative.email = email;
    createdCustomerServiceRepresentative.phoneNumber = phoneNumber;

    const firebaseUser = await this.firebaseService.createNewFirebaseUser(
      email,
      password,
    );

    createdCustomerServiceRepresentative.firebaseUid = firebaseUser.uid;

    return await this.customerServiceRepresentativeRepository.save(
      createdCustomerServiceRepresentative,
    );
  }

  async getAllCustomerServiceRepresentative() {
    return await this.customerServiceRepresentativeRepository.find();
  }

  async getCustomerServiceRepresentative(customerServiceRepresentativeId) {
    return await this.customerServiceRepresentativeRepository.findOneOrFail({
      where: { id: customerServiceRepresentativeId },
    });
  }

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

  async deleteCustomerServiceRepresentative(customerServiceRepresentativeId) {
    const user = await this.customerServiceRepresentativeRepository.findOneOrFail(
      {
        where: {
          id: customerServiceRepresentativeId,
        },
      },
    );
    await this.firebaseService.deleteFirebaseUser(user.firebaseUid);
    await this.customerServiceRepresentativeRepository.remove(user);
  }

  // async createUser(createUserDto: CreateUserDto) {
  //   const createdUser = new User();

  //   //first creating the database user
  //   const { firstName, lastName, email, password, phoneNumber } = createUserDto;

  //   createdUser.firstName = firstName;
  //   createdUser.lastName = lastName;
  //   createdUser.email = email;
  //   createdUser.phoneNumber = phoneNumber;

  //   //Then creating the firebase user
  //   const firebaseUser = await this.firebaseService.createNewFirebaseUser(
  //     email,
  //     password,
  //   );
  //   //Then creating the zoom user
  //   //FIXME: will be done after getting the zoom module

  //   //After creating both zoom user and firebase user put them in the database
  //   // createdUser.zoomUserId = zoomUserId;
  //   createdUser.firebaseUid = firebaseUser.uid;
  //   //Save the entity, and return. the user is created

  //   return await this.userRepository.save(createdUser);
  // }

  // async getAllUser() {
  //   return await this.userRepository.find();
  // }

  // async getUser(userId) {
  //   return await this.userRepository.findOneOrFail({
  //     where: {
  //       id: userId,
  //     },
  //   });
  // }

  // async updateUser(updateUserDto: UpdateUserDto, userId) {
  //   const user = await this.userRepository.findOneOrFail({
  //     where: {
  //       id: userId,
  //     },
  //   });

  //   const { firstName, lastName, phoneNumber } = updateUserDto;

  //   user.firstName = firstName;
  //   user.lastName = lastName;
  //   user.phoneNumber = phoneNumber;

  //   return await this.userRepository.save(user);
  // }

  // async deleteUser(userId: any) {
  //   const user = await this.userRepository.findOneOrFail({
  //     where: {
  //       id: userId,
  //     },
  //   });
  //   await this.firebaseService.deleteFirebaseUser(user.firebaseUid);
  //   await this.userRepository.remove(user);
  // }

  async createExpert(createExpertDto: CreateExpertDto) {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      categoryId,
      fee,
      availableTime,
    } = createExpertDto;

    //first create the expert in the database
    const expert = new Expert();

    const expertCategory = await this.expertCategoryRepository.findOneOrFail(
      categoryId,
    );

    expert.firstName = firstName;
    expert.lastName = lastName;
    expert.email = email;
    expert.phoneNumber = phoneNumber;
    expert.category = expertCategory;
    expert.fee = fee;
    expert.availableTime = availableTime;

    //then create the firebase user

    const firebaseUser = await this.firebaseService.createNewFirebaseUser(
      email,
      password,
    );

    //then create the zoom user

    const { zoomUserId } = await this.zoomService.createNewUser(
      firstName,
      lastName,
      email,
    );

    //then save the expert in the database

    // expert.zoomUserId=zoomUserId;

    expert.zoomUserId = zoomUserId;
    expert.firebaseUid = firebaseUser.uid;

    //finally save
    return await this.expertRepository.save(expert);
  }

  async getAllExperts() {
    return await this.expertRepository.find();
  }

  async getExpert(expertId: string) {
    return await this.expertRepository.findOneOrFail({
      where: { id: expertId },
    });
  }

  async searchExpert(query: string) {
    return await this.expertGeneralService.searchExpertByName(query);
  }

  async updateExpert(updateExpertDto: UpdateExpertDto, expertId) {
    return await this.expertGeneralService.updateExpert(
      updateExpertDto,
      expertId,
    );
  }

  async deleteExpert(expertId) {
    const expert = await this.expertRepository.findOneOrFail({
      where: {
        id: expertId,
      },
    });

    //first let's delete the expert from firebase
    await this.firebaseService.deleteFirebaseUser(expert.firebaseUid);
    //then the database
    await this.expertRepository.remove(expert);
  }

  async setExpertPreAssessmentQuestions(expertId: number, questions: string) {
    return await this.expertGeneralService.setPreAssessmentQuestions(
      expertId,
      questions,
    );
  }

  async getExpertPreAssessmentQuestions(expertId: number) {
    return await this.expertGeneralService.getPreAssessmentQuestions(expertId);
  }

  async getExpertCategories() {
    try {
      const categories = await this.expertCategoryRepository.find();
      console.log('Categories: ', categories);
      return categories;
    } catch (error) {
      console.log('ERROR: ', error);
    }
  }

  async addExpertCategory(name: string) {
    const expertCategory = new ExpertCategory();
    expertCategory.name = name;

    return await this.expertCategoryRepository.save(expertCategory);
  }

  async getExpertOfCategory(categoryId: number) {
    const expertCategory = await this.expertCategoryRepository.findOneOrFail({
      where: {
        id: categoryId,
      },
    });

    return await expertCategory.experts;
  }

  async createAdmin(createAdminDto: CreateAdminDto) {
    const { name, email, password, mobileNumber } = createAdminDto;

    const newAdmin = new Admin();
    newAdmin.name = name;
    newAdmin.email = email;
    newAdmin.mobileNumber = mobileNumber;

    const firebaseUser = await this.firebaseService.createNewFirebaseUser(
      email,
      password,
    );

    newAdmin.firebaseUid = firebaseUser.uid;

    return await this.adminRepository.save(newAdmin);
  }

  async getAllAdmins() {
    return await this.adminRepository.find();
  }

  async getAdmin(adminId) {
    return await this.adminRepository.findOneOrFail({
      where: {
        id: adminId,
      },
    });
  }

  async updateAdmin(updateAdminDto: UpdateAdminDto, adminId) {
    const admin: Admin = await this.getAdmin(adminId);
    const { name, mobileNumber } = updateAdminDto;

    admin.name = name;
    admin.mobileNumber = mobileNumber;

    return await this.adminRepository.save(admin);
  }

  async deleteAdmin(adminId) {
    const admin = await this.getAdmin(adminId);
    await this.firebaseService.deleteFirebaseUser(admin.firebaseUid);
    await this.adminRepository.remove(admin);
  }
}
