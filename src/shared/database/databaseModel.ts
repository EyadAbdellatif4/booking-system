import { User } from '../../users/entities/user.entity';
import { Book } from '../../books/entities/book.entity';
import { Genre } from '../../genres/entities/genre.entity';
import { BookGenre } from './entities/book-genre.entity';
import { UserLibrary } from './entities/user-library.entity';
import { Rating } from '../../ratings/entities/rating.entity';
import { ChatLog } from '../../chat-logs/entities/chat-log.entity';

export default () => {
  return [User, Book, Genre, BookGenre, UserLibrary, Rating, ChatLog];
};

