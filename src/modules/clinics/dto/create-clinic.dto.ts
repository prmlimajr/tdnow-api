import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ContactType } from '../../../helpers/constants/contact-type';
import { CreateAddressDto } from 'src/modules/addresses/dto/create-address.dto';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

class CreateClinicContactDto {
  contact: string;
  type: ContactType;
}

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

  @IsOptional()
  address?: CreateAddressDto;

  @IsOptional()
  contacts?: CreateClinicContactDto[];

  owner: CreateUserDto;
}
