import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { DocumentType } from 'src/database/entity/user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'Fulano' })
  @IsNotEmpty({ message: 'Favor informar o nome do usuario' })
  @IsString({ message: 'Nome do usuario deve ser uma string' })
  firstName: string;

  @ApiProperty({ example: 'da Silva' })
  @IsNotEmpty({ message: 'Favor informar o sobrenome do usuario' })
  @IsString({ message: 'Sobrenome do usuario deve ser uma string' })
  lastName: string;

  @ApiProperty({ example: '12345678900' })
  @IsOptional()
  @IsString({ message: 'Documento do usuario deve ser uma string' })
  document?: string;

  @ApiProperty({ example: 'cpf' })
  @IsOptional()
  @IsString({ message: 'Tipo de documento do usuario deve ser uma string' })
  documentType?: DocumentType;

  @ApiProperty({ example: '123' })
  @IsNotEmpty({ message: 'Favor informar a senha do usuario' })
  @IsString({ message: 'Senha do usuario deve ser uma string' })
  password: string;

  @ApiProperty({ example: 'test1@example.com' })
  @IsNotEmpty({ message: 'Favor informar o email do usuario' })
  @IsEmail({ allow_display_name: true }, { message: 'Email invalido' })
  email: string;

  @ApiProperty({ example: 'uuid' })
  @IsOptional()
  @IsUUID('4', { message: 'Favor informar um id de Papel valido' })
  roleId?: string;
}
