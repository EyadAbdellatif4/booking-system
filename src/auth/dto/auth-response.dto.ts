export class UserResponseDto {
  user_id: number;
  username: string;
  email: string;
  created_at: Date;
}

export class RegisterResponseDto {
  message: string;
  user: UserResponseDto;
}

export class LoginResponseDto {
  message: string;
  user: UserResponseDto;
  access_token: string;
}

