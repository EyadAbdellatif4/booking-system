import { IsNotEmpty, IsInt, IsOptional, IsString, Min, Max } from 'class-validator';
import { ErrorMessage } from '../../shared/enums';

export class CreateRatingDto {
  @IsNotEmpty({ message: ErrorMessage.BOOK_ID_REQUIRED })
  @IsInt()
  book_id: number;

  @IsNotEmpty({ message: ErrorMessage.SCORE_REQUIRED })
  @IsInt()
  @Min(1, { message: ErrorMessage.SCORE_MIN })
  @Max(5, { message: ErrorMessage.SCORE_MAX })
  score: number;

  @IsOptional()
  @IsString()
  comment?: string;
}

