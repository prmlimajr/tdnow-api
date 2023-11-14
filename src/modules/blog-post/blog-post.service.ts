import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogPost } from 'src/database/entity/blog-post.entity';
import { Repository } from 'typeorm';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { User } from 'src/database/entity/user.entity';
import { Roles } from 'src/helpers/constants/roles';
import { fileTypeFromBuffer } from 'file-type';
import { v4 as uuidV4 } from 'uuid';
import { S3Service } from '../storage/s3.service';
import { AWS_BLOG_POST_BUCKET_NAME } from 'src/config/env';
import { BlogPostFile } from 'src/database/entity/blog-post-file.entity';

@Injectable()
export class BlogPostService {
  constructor(
    @InjectRepository(BlogPost)
    private blogPostRepository: Repository<BlogPost>,

    private storageService: S3Service,
  ) {}

  private async uploadFile(file: Express.Multer.File, path: string) {
    await this.storageService.uploadFileToS3(file, {
      bucket: AWS_BLOG_POST_BUCKET_NAME,
      path,
    });
  }

  async create(blogPost: CreateBlogPostDto, user: User) {
    if (user.role.name === Roles.USER) {
      throw new ForbiddenException('Usuário não autorizado');
    }

    const newBlogPost = this.blogPostRepository.create(blogPost);

    return this.blogPostRepository.manager.transaction(async (manager) => {
      const blogPostRepo = manager.getRepository(BlogPost);
      const blogPostFileRepo = manager.getRepository(BlogPostFile);

      // if (blogPost.file) {
      //   const { mime: mimetype } =
      //     (await fileTypeFromBuffer(blogPost.file.buffer)) || {};

      //   const fileId = uuidV4();

      //   const path = `blog-posts/${newBlogPost.id}/${fileId}.${
      //     mimetype.split('/')[1]
      //   }`;

      //   await this.uploadFile(blogPost.file, path);

      //   const blogPostFile = blogPostFileRepo.create({
      //     id: fileId,
      //     name: blogPost.file.originalname,
      //     path,
      //     mimetype: blogPost.file.mimetype,
      //   });

      //   await blogPostFileRepo.save(blogPostFile);
      // }

      return blogPostRepo.save(newBlogPost);
    });
  }

  async listBlogPosts(page: number, size: number, clinicId: string) {
    const [blogPosts, total] = await this.blogPostRepository.findAndCount({
      where: { clinic: { id: clinicId } },
      take: size,
      skip: (page - 1) * size,
    });

    return { blogPosts, total };
  }

  async getBlogPostById(id: string) {
    return this.blogPostRepository.findOne({ where: { id } });
  }
}
