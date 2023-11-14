import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';
import { UploadFileDto } from './dto/upload-file.dto';

@Controller('upload')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadFileDto: UploadFileDto,
  ) {
    const uploadedFileUrl = await this.s3Service.uploadFileToS3(
      file,
      uploadFileDto,
    );

    return uploadedFileUrl;
  }

  @Get(':fileName')
  async downloadFile(@Param('fileName') fileName: string, @Res() res) {
    const file = await this.s3Service.downloadFileFromS3(fileName);

    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename=${fileName}`,
    });

    res.send(file);
  }
}
