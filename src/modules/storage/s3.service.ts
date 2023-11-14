import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import {
  AWS_ACCESS_KEY_ID,
  AWS_BLOG_POST_BUCKET_NAME,
  AWS_SECRET_ACCESS_KEY,
} from 'src/config/env';
import { UploadFileDto } from './dto/upload-file.dto';

@Injectable()
export class S3Service {
  private s3: AWS.S3;

  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
    });
  }

  async uploadFileToS3(
    file: Express.Multer.File,
    uploadFileDto: UploadFileDto,
  ): Promise<string> {
    const { bucket, path } = uploadFileDto;

    const params = {
      Bucket: bucket,
      Key: path,
      Body: file.buffer,
    };

    const result = await this.s3.upload(params).promise();

    return result.Location;
  }

  async downloadFileFromS3(fileName: string): Promise<Buffer> {
    const params = {
      Bucket: AWS_BLOG_POST_BUCKET_NAME,
      Key: fileName,
    };

    const data = await this.s3.getObject(params).promise();

    return data.Body as Buffer;
  }
}
