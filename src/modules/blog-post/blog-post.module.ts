import { Module } from '@nestjs/common';
import { S3Module } from '../storage/s3.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogPost } from 'src/database/entity/blog-post.entity';
import { BlogPostController } from './blog-post.controller';
import { BlogPostService } from './blog-post.service';

@Module({
  imports: [TypeOrmModule.forFeature([BlogPost]), S3Module],
  controllers: [BlogPostController],
  providers: [BlogPostService],
  exports: [BlogPostService],
})
export class BlogPostModule {}
