import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogPost } from 'src/database/entity/blog-post.entity';
import { Repository } from 'typeorm';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { User } from 'src/database/entity/user.entity';
import { Roles } from 'src/helpers/constants/roles';
import { v4 as uuidV4 } from 'uuid';
import { S3Service } from '../storage/s3.service';
import { AWS_BLOG_POST_BUCKET_NAME } from 'src/config/env';
import { BlogPostFile } from 'src/database/entity/blog-post-file.entity';
import { Paginator } from 'src/helpers/pagination/pagination';

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

  async create(
    blogPost: CreateBlogPostDto,
    user: User,
    file: Express.Multer.File,
  ) {
    if (user.role.name !== Roles.ADMIN) {
      throw new ForbiddenException('Usuário não autorizado');
    }

    const newBlogPost = this.blogPostRepository.create({
      id: uuidV4(),
      clinic: user.clinics[0],
      ...blogPost,
    });

    return this.blogPostRepository.manager.transaction(async (manager) => {
      const blogPostRepo = manager.getRepository(BlogPost);
      const blogPostFileRepo = manager.getRepository(BlogPostFile);

      if (file) {
        const fileId = uuidV4();

        const path = `blog-posts/${newBlogPost.id}/${fileId}.${file.originalname}`;

        // await this.uploadFile(file, path);

        const blogPostFile = blogPostFileRepo.create({
          id: fileId,
          name: file.originalname,
          path,
          mimetype: file.mimetype,
        });

        await blogPostFileRepo.save(blogPostFile);

        newBlogPost.file = blogPostFile;
      }

      return blogPostRepo.save(newBlogPost);
    });
  }

  async listBlogPosts(page: number, size: number, clinicId: string) {
    const paginator = new Paginator(this.blogPostRepository);

    const query = this.blogPostRepository
      .createQueryBuilder('blogPost')
      .where('blogPost.clinicId = :clinicId', { clinicId });

    return paginator.paginate(page, size, query);
  }

  async getBlogPostById(id: string) {
    return this.blogPostRepository.findOne({ where: { id } });
  }
}
