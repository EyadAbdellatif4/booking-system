import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { ErrorMessage } from '../../shared/enums';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString({ message: ErrorMessage.USERNAME_MUST_BE_STRING })
  @MinLength(3, { message: ErrorMessage.USERNAME_MIN_LENGTH })
  @MaxLength(50, { message: ErrorMessage.USERNAME_MAX_LENGTH })
  username?: string;

  @IsOptional()
  @IsEmail({}, { message: ErrorMessage.EMAIL_INVALID })
  @MaxLength(100, { message: ErrorMessage.EMAIL_MAX_LENGTH })
  email?: string;

  @IsOptional()
  @IsString({ message: ErrorMessage.PASSWORD_MUST_BE_STRING })
  @MinLength(6, { message: ErrorMessage.PASSWORD_MIN_LENGTH })
  @MaxLength(255, { message: ErrorMessage.PASSWORD_MAX_LENGTH })
  password?: string;
}

