import { BaseFilterDto } from '../../shared/dto/base-filter.dto';
import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';

export class BookFilterDto extends BaseFilterDto {
  @IsOptional()
  @IsString()
  genre?: string;

  @IsOptional()
  @IsInt()
  @Min(1000)
  @Max(new Date().getFullYear())
  publication_year?: number;
}

