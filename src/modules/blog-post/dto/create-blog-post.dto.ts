import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBlogPostDto {
  @ApiProperty({ example: 'Slug do post' })
  @IsOptional()
  @IsString({ message: 'Slug do post deve ser uma string' })
  slug?: string;

  @ApiProperty({ example: 'Titulo do post' })
  @IsNotEmpty({ message: 'Favor informar o titulo do post' })
  @IsString({ message: 'Titulo do post deve ser uma string' })
  title: string;

  @ApiProperty({ example: 'Conteudo do post' })
  @IsNotEmpty({ message: 'Favor informar o conteudo do post' })
  @IsString({ message: 'Conteudo do post deve ser uma string' })
  content: string;

  @ApiProperty({ example: 'wwww.google.com' })
  @IsOptional()
  @IsString({ message: 'Link do post deve ser uma string' })
  link?: string;

  @IsOptional()
  file?: Express.Multer.File;
}
