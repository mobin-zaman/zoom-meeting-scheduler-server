import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AuthModule } from 'src/auth/auth.module';
import { Admin } from 'src/auth/admin.entity';
import { Expert } from 'src/auth/expert.entity';
import { CustomerServiceRepresentative } from 'src/auth/customerServiceRepresentative.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { ExpertCategory } from 'src/auth/expert.category.entity';
import { ZoomModule } from 'src/zoom/zoom.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      User,
      Expert,
      ExpertCategory,
      Admin,
      CustomerServiceRepresentative,
    ]),
    ZoomModule,
  ],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
