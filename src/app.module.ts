import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirebaseModule } from 'nestjs-firebase';
import { AuthModule } from './auth/auth.module';
import { Expert } from './auth/expert.entity';
import { ExpertCategory } from './auth/expert.category.entity';
import { User } from './auth/user.entity';
import { UserModule } from './user/user.module';
import { MeetingModule } from './meeting/meeting.module';
import { Meeting } from './meeting/meeting.entity';
import { ExpertModule } from './expert/expert.module';
import { CustomerServiceRepresentativeModule } from './customer-service-representative/customer-service-representative.module';
import { CustomerServiceRepresentative } from './auth/customerServiceRepresentative.entity';
import { AdminModule } from './admin/admin.module';
import { Admin } from './auth/admin.entity';
import { ZoomModule } from './zoom/zoom.module';
import { PaymentGatewayModule } from './payment-gateway/payment-gateway.module';
import { Payment } from './payment-gateway/payment.entity';
import { ImageModule } from './image/image.module';
import { FileModule } from './file/file.module';
import { MailModule } from './mail/mail.module';
import { ScheduleModule } from '@nestjs/schedule';

const firebaseConfigJsonPath: string = process.env.FIREBASE_CREDENTIAL_PATH || '';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ScheduleModule.forRoot(),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASS'),
        database: configService.get('DATABASE_NAME'),
        entities: [
          Admin,
          User,
          Expert,
          ExpertCategory,
          Meeting,
          CustomerServiceRepresentative,
          Payment,
        ],
        synchronize: configService.get('DATABASE_SYNC'),
      }),
    }),

    FirebaseModule.forRoot({
      googleApplicationCredential: firebaseConfigJsonPath,
    }),

    AuthModule,

    UserModule,

    MeetingModule,

    ExpertModule,

    CustomerServiceRepresentativeModule,

    AdminModule,

    ZoomModule,

    PaymentGatewayModule,

    ImageModule,

    FileModule,

    MailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
