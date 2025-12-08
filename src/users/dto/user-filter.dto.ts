import { BaseFilterDto } from '../../shared/dto/base-filter.dto';
import { IsOptional, IsString, IsEmail } from 'class-validator';

export class UserFilterDto extends BaseFilterDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}

