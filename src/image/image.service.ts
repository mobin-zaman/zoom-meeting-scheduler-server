import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { Duplex } from 'stream';

@Injectable()
export class ImageService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(buffer): Promise<any> {
    const readableStream = this.bufferToStream(buffer);
    const response = await this.uploadImageToCloudinary(readableStream);
    console.log('Cloudinary Response: ', response);
    return response;
  }

  private bufferToStream(imageBuffer) {
    const tmp = new Duplex();
    tmp.push(imageBuffer);
    tmp.push(null);
    return tmp;
  }

  private async uploadImageToCloudinary(createReadStream) {
    return new Promise(async (resolve, reject) => {
      const cloudinaryUploadStream = cloudinary.uploader.upload_stream(
        {
          folder: this.configService.get('CLOUDINARY_FOLDER_NAME'),
        },
        function (error, result) {
          if (error) reject(error);
          resolve(result.secure_url);
        },
      );

      try {
        createReadStream.pipe(cloudinaryUploadStream);
      } catch (error) {
        console.log('error: ', error);
        throw error;
      }
    });
  }
}
