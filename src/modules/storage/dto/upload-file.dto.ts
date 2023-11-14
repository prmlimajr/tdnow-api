import { IsNotEmpty, IsString } from 'class-validator';

export class UploadFileDto {
  @IsNotEmpty({ message: 'Favor informar o nome do bucket' })
  @IsString({ message: 'Nome do bucket deve ser uma string' })
  bucket: string;

  @IsNotEmpty({ message: 'Favor informar o id do post' })
  @IsString({ message: 'Id do post deve ser uma string' })
  path: string;
}
