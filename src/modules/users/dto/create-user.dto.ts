import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Fulano da Silva' })
  @IsNotEmpty({ message: 'Favor informar o nome do usuario' })
  @IsString({ message: 'Nome do usuario deve ser uma string' })
  name: string;

  @ApiProperty({ example: '123' })
  @IsNotEmpty({ message: 'Favor informar a senha do usuario' })
  @IsString({ message: 'Senha do usuario deve ser uma string' })
  password: string;

  @ApiProperty({ example: '123' })
  @IsNotEmpty({ message: 'Favor confirmar a senha do usuario' })
  @IsString({ message: 'Confirmacao de senha do usuario deve ser uma string' })
  passwordConfirmation: string;

  @ApiProperty({ example: 'test1@example.com' })
  @IsNotEmpty({ message: 'Favor informar o email do usuario' })
  @IsEmail({ allow_display_name: true }, { message: 'Email invalido' })
  email: string;

  @ApiProperty({ example: '12345678901' })
  @IsNotEmpty({ message: 'Favor informar o telefone do usuario' })
  @IsString({ message: 'Telefone do usuario deve ser uma string' })
  phone: string;

  @ApiProperty({ example: 'uuid' })
  @IsOptional()
  @IsUUID('4', { message: 'Favor informar um id de Papel valido' })
  roleId?: string;

  @ApiProperty({ example: 'uuid' })
  @IsOptional()
  @IsUUID('4', { message: 'Favor informar um id de Clinica valido' })
  clinicId?: string;
}
