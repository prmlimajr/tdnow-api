import { IsOptional } from 'class-validator';

export class UserFiltersDto {
  @IsOptional()
  search?: string;
}
