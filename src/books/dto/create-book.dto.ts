import { IsNotEmpty, IsString, IsOptional, IsInt, Min, Max, MinLength, MaxLength, IsArray } from 'class-validator';
import { ErrorMessage } from '../../shared/enums';

export class CreateBookDto {
  @IsNotEmpty({ message: ErrorMessage.TITLE_REQUIRED })
  @IsString({ message: ErrorMessage.TITLE_MUST_BE_STRING })
  @MinLength(1, { message: ErrorMessage.TITLE_MIN_LENGTH })
  @MaxLength(200, { message: ErrorMessage.TITLE_MAX_LENGTH })
  title: string;

  @IsNotEmpty({ message: ErrorMessage.AUTHOR_REQUIRED })
  @IsString({ message: ErrorMessage.AUTHOR_MUST_BE_STRING })
  @MinLength(1, { message: ErrorMessage.AUTHOR_MIN_LENGTH })
  @MaxLength(100, { message: ErrorMessage.AUTHOR_MAX_LENGTH })
  author: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  cover_image_url?: string;

  @IsOptional()
  @IsInt()
  @Min(1000, { message: ErrorMessage.PUBLICATION_YEAR_MIN })
  @Max(new Date().getFullYear(), { message: ErrorMessage.PUBLICATION_YEAR_MAX })
  publication_year?: number;

  @IsOptional()
  @IsArray()
  genre_ids?: number[];
}
