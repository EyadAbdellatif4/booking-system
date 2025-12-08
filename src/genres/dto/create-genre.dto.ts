import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { ErrorMessage } from '../../shared/enums';

export class CreateGenreDto {
  @IsNotEmpty({ message: ErrorMessage.GENRE_NAME_REQUIRED })
  @IsString({ message: ErrorMessage.GENRE_NAME_MUST_BE_STRING })
  @MinLength(2, { message: ErrorMessage.GENRE_NAME_MIN_LENGTH })
  @MaxLength(50, { message: ErrorMessage.GENRE_NAME_MAX_LENGTH })
  name: string;
}

