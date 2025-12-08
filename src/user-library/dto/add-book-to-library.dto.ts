import { IsNotEmpty, IsInt, IsEnum } from 'class-validator';
import { ErrorMessage, LibraryStatus } from '../../shared/enums';

export class AddBookToLibraryDto {
  @IsNotEmpty({ message: ErrorMessage.BOOK_ID_REQUIRED })
  @IsInt()
  book_id: number;

  @IsNotEmpty({ message: 'Status is required' })
  @IsEnum(LibraryStatus, { message: 'Status must be either FAVORITE or FINISHED' })
  status: LibraryStatus;
}

