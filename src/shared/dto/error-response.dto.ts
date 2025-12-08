export class ValidationErrorDto {
  statusCode: number;
  message: string[];
  error: string;
  path?: string;
  method?: string;
  timestamp?: string;
}

export class UnauthorizedErrorDto {
  statusCode: number;
  message: string;
  error: string;
  path?: string;
  method?: string;
  timestamp?: string;
}

export class ForbiddenErrorDto {
  statusCode: number;
  message: string;
  error: string;
  path?: string;
  method?: string;
  timestamp?: string;
}

export class NotFoundErrorDto {
  statusCode: number;
  message: string;
  error: string;
  path?: string;
  method?: string;
  timestamp?: string;
}

export class ConflictErrorDto {
  statusCode: number;
  message: string;
  error: string;
  path?: string;
  method?: string;
  timestamp?: string;
}

export class TooManyRequestsErrorDto {
  statusCode: number;
  message: string;
  error: string;
  path?: string;
  method?: string;
  timestamp?: string;
}

export class InternalServerErrorDto {
  statusCode: number;
  message: string;
  error: string;
  path?: string;
  method?: string;
  timestamp?: string;
}
