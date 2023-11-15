import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserPasswordDto {
  @ApiProperty({ example: '123456Aa!' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @IsString({ message: 'Senha deve ser uma string' })
  password: string;

  @ApiProperty({ example: '123456Aa!' })
  @IsNotEmpty({ message: 'Confirmação de senha é obrigatória' })
  @IsString({ message: 'Confirmação de senha deve ser uma string' })
  passwordConfirmation: string;
}
