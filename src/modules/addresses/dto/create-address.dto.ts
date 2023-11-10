import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

class CreateAddressDto {
  @IsNotEmpty({ message: 'O campo rua é obrigatório' })
  @IsString({ message: 'A rua deve ser uma string' })
  street: string;

  @IsOptional()
  @IsString({ message: 'O número deve ser uma string' })
  number: string;

  @IsOptional()
  @IsString({ message: 'O campo complemento deve ser uma string' })
  complement: string;

  @IsOptional()
  @IsString({ message: 'O bairro deve ser uma string' })
  neighborhood: string;

  @IsOptional()
  @IsString({ message: 'A cidade deve ser uma string' })
  city: string;

  @IsOptional()
  @IsString({ message: 'O estado deve ser uma string' })
  state: string;

  @IsOptional()
  @IsString({ message: 'O CEP deve ser uma string' })
  zipCode: string;
}

export default CreateAddressDto;
