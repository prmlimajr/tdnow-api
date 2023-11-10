import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'test1' })
  @IsNotEmpty({ message: 'Favor informar a senha do usuario' })
  @IsString({ message: 'Senha do usuario deve ser uma string' })
  password: string;

  @ApiProperty({ example: 'test1@example.com' })
  @IsNotEmpty({ message: 'Favor informar o email do usuario' })
  @IsEmail({ allow_display_name: true }, { message: 'Email invalido' })
  email: string;
}
