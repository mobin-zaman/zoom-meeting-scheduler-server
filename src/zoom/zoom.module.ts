import { Module } from '@nestjs/common';
import { ZoomApiService } from './zom.api.service';
import { ZoomService } from './zoom.service';
import { ZoomController } from './zoom.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('ZOOM_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [ZoomService, ZoomApiService],
  controllers: [ZoomController],
  exports: [ZoomService, ZoomApiService],
})
export class ZoomModule {}
