import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateClinicDto {
  @IsNotEmpty({ message: 'Favor informar o nome fantasia da clinica' })
  @IsString({ message: 'Nome fantasia da clinica deve ser uma string' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Razao social deve ser uma string' })
  legalName?: string;

  @IsOptional()
  @IsString({ message: 'O CNPJ deve ser uma string' })
  cnpj?: string;
}
