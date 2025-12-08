import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { ValidationPattern, ErrorMessage } from '../../shared/enums';

export class CreateUserDto {
  @IsNotEmpty({ message: ErrorMessage.USERNAME_REQUIRED })
  @IsString({ message: ErrorMessage.USERNAME_MUST_BE_STRING })
  @MinLength(3, { message: ErrorMessage.USERNAME_MIN_LENGTH })
  @MaxLength(50, { message: ErrorMessage.USERNAME_MAX_LENGTH })
  username: string;

  @IsNotEmpty({ message: ErrorMessage.EMAIL_REQUIRED })
  @IsEmail({}, { message: ErrorMessage.EMAIL_INVALID })
  @MaxLength(100, { message: ErrorMessage.EMAIL_MAX_LENGTH })
  email: string;

  @IsNotEmpty({ message: ErrorMessage.PASSWORD_REQUIRED })
  @IsString({ message: ErrorMessage.PASSWORD_MUST_BE_STRING })
  @MinLength(6, { message: ErrorMessage.PASSWORD_MIN_LENGTH })
  @MaxLength(255, { message: ErrorMessage.PASSWORD_MAX_LENGTH })
  password: string;
}

