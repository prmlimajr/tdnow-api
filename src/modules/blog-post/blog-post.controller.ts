import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { PageQueryDto } from 'src/helpers/pagination/dto/page-query.dto';
import { AuthGuard } from '@nestjs/passport';
import { Strategies } from 'src/helpers/constants/auth-strategies';
import { LoggedUser } from '../auth/logged-user.decorator';
import { User } from 'src/database/entity/user.entity';
import { BlogPostService } from './blog-post.service';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Blog Post')
@Controller('blog-post')
export class BlogPostController {
  constructor(private blogPostService: BlogPostService) {}

  @Post()
  @UseGuards(AuthGuard(Strategies.JWT))
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() blogPost: CreateBlogPostDto,
    @LoggedUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.blogPostService.create(blogPost, user, file);
  }

  @Get('/:clinicId')
  listBlogPosts(
    @Query() { page, size }: PageQueryDto,
    @Param('clinicId') clinicId: string,
  ) {
    return this.blogPostService.listBlogPosts(page, size, clinicId);
  }

  @Get('post/:blogPostId')
  getBlogPostById(@Param('blogPostId') blogPostId: string) {
    return this.blogPostService.getBlogPostById(blogPostId);
  }
}
