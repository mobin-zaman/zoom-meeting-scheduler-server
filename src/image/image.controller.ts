import {
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
  constructor(@Inject(ImageService) private imageService: ImageService) {}

  @Post('/upload/test')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() image: Express.Multer.File) {
    console.log('Test image: ', image);
    await this.imageService.uploadImage(image.buffer);
  }
}
