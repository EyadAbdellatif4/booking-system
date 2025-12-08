import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { ValidationPattern, ErrorMessage } from '../../shared/enums';

/**
 * RegisterDto is a DTO for registering a new user
 */
export class RegisterDto {
  @IsNotEmpty({ message: ErrorMessage.NAME_REQUIRED })
  @IsString({ message: ErrorMessage.NAME_MUST_BE_STRING })
  @MinLength(3, { message: ErrorMessage.NAME_MIN_LENGTH })
  @MaxLength(50, { message: ErrorMessage.USERNAME_MAX_LENGTH })
  name: string;

  @IsNotEmpty({ message: ErrorMessage.PASSWORD_REQUIRED })
  @IsString({ message: ErrorMessage.PASSWORD_MUST_BE_STRING })
  @MinLength(6, { message: ErrorMessage.PASSWORD_MIN_LENGTH })
  @MaxLength(255, { message: ErrorMessage.PASSWORD_MAX_LENGTH })
  password: string;

  @IsNotEmpty({ message: ErrorMessage.EMAIL_REQUIRED })
  @IsEmail({}, { message: ErrorMessage.EMAIL_INVALID })
  @MaxLength(50, { message: ErrorMessage.EMAIL_MAX_LENGTH })
  email: string;
}

/**
 * LoginDto is a DTO for logging in a user
 */
export class LoginDto {
  @IsNotEmpty({ message: ErrorMessage.EMAIL_REQUIRED })
  @IsEmail({}, { message: ErrorMessage.EMAIL_INVALID })
  email: string;

  @IsNotEmpty({ message: ErrorMessage.PASSWORD_REQUIRED })
  @IsString({ message: ErrorMessage.PASSWORD_MUST_BE_STRING })
  password: string;
}

