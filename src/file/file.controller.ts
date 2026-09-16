import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as mime from 'mime-types';

@Controller('file')
export class FileController {
  constructor(private configService: ConfigService) {}

  //   @Post('/')
  //   @UseInterceptors(
  //     FileInterceptor('file', {
  //       storage: diskStorage({
  //         destination: setDestination,
  //         filename: editFileName,
  //       }),
  //       limits: {
  //         fileSize: 5242880,
  //       },
  //     }),
  //   )
  //   uploadFile(@UploadedFile() file) {
  //     console.log('File: ', file);
  //     return;
  //   }

  @Get('/:filename')
  async serveFile(@Param('filename') filename, @Res() res) {
    try {
      //TODO: validation needs to be added here

      const directory = this.configService.get('FILE_SAVE_DIRECTORY');

      const filePath = `${directory}/${filename}`;

      const buffer = fs.readFileSync(filePath);

      res.set({
        'Content-Type': mime.lookup(filePath),
        'Content-Disposition': `attachment; filename=${filename}`,
        'Content-Length': buffer.length,

        // prevent cache
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: 0,
      });

      res.end(buffer);
    } catch (e) {
      console.log('Get Ticket error: ', e);
      throw new NotFoundException('file not found');
    }
  }
}
