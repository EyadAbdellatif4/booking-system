import { IsNotEmpty, IsString } from 'class-validator';
import { ErrorMessage } from '../../shared/enums';

export class CreateChatLogDto {
  @IsNotEmpty({ message: ErrorMessage.MESSAGE_CONTENT_REQUIRED })
  @IsString({ message: ErrorMessage.MESSAGE_CONTENT_MUST_BE_STRING })
  message_content: string;
}
