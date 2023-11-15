import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyUserDto {
  @ApiProperty({ example: '123456' })
  @IsNotEmpty({ message: 'Favor informar o token de verificacao' })
  @IsString({ message: 'Token de verificacao deve ser uma string' })
  token: string;
}
