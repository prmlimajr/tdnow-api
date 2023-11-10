import { IsOptional, Min, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
export class PageQueryDto {
  @IsNumber()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => Number(value))
  page?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => Number(value))
  size?: number;
}
