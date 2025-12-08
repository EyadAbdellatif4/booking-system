import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserLibrary } from '../shared/database/entities/user-library.entity';
import { Book } from '../books/entities/book.entity';
import { AddBookToLibraryDto } from './dto/add-book-to-library.dto';
import { LibraryStatus, ResponseMessage, ErrorMessage } from '../shared/enums';
import { Genre } from '../genres/entities/genre.entity';

@Injectable()
export class UserLibraryService {
  constructor(
    @InjectModel(UserLibrary)
    private userLibraryRepository: typeof UserLibrary,
    @InjectModel(Book)
    private bookRepository: typeof Book,
  ) {}

  /**
   * Add a book to user's library
   * @param userId - The ID of the user
   * @param addBookDto - The book data
   * @returns The created library entry
   */
  async addBookToLibrary(userId: number, addBookDto: AddBookToLibraryDto) {
    const { book_id, status } = addBookDto;

    // Check if book exists
    const book = await this.bookRepository.findByPk(book_id);
    if (!book) {
      throw new NotFoundException(ErrorMessage.BOOK_NOT_FOUND);
    }

    // Check if book is already in library
    const existingEntry = await this.userLibraryRepository.findOne({
      where: {
        user_id: userId,
        book_id: book_id,
      },
    });

    if (existingEntry) {
      // Update status if already exists
      existingEntry.status = status;
      await existingEntry.save();
      return {
        message: ResponseMessage.BOOK_ADDED_TO_LIBRARY,
        libraryEntry: existingEntry,
      };
    }

    // Create new library entry
    const libraryEntry = await this.userLibraryRepository.create({
      user_id: userId,
      book_id: book_id,
      status: status,
    } as any);

    return {
      message: ResponseMessage.BOOK_ADDED_TO_LIBRARY,
      libraryEntry,
    };
  }

  /**
   * Get all books in user's library
   * @param userId - The ID of the user
   * @param status - Optional filter by status
   * @returns List of library entries
   */
  async findAll(userId: number, status?: LibraryStatus) {
    const where: any = { user_id: userId };
    if (status) {
      where.status = status;
    }

    const libraryEntries = await this.userLibraryRepository.findAll({
      where,
      include: [
        {
          model: Book,
          as: 'book',
          include: [
            {
              model: Genre,
              as: 'genres',
              through: { attributes: [] },
            },
          ],
        },
      ],
      order: [['added_at', 'DESC']],
    });

    return {
      message: ResponseMessage.LIBRARY_RETRIEVED,
      libraryEntries,
    };
  }

  /**
   * Get one library entry by ID
   * @param userId - The ID of the user
   * @param libraryId - The ID of the library entry
   * @returns The library entry
   */
  async findOne(userId: number, libraryId: number) {
    const libraryEntry = await this.userLibraryRepository.findOne({
      where: {
        library_id: libraryId,
        user_id: userId,
      },
      include: [
        {
          model: Book,
          as: 'book',
          include: [
            {
              model: Genre,
              as: 'genres',
              through: { attributes: [] },
            },
          ],
        },
      ],
    });

    if (!libraryEntry) {
      throw new NotFoundException(ErrorMessage.LIBRARY_ENTRY_NOT_FOUND);
    }

    return {
      message: ResponseMessage.LIBRARY_RETRIEVED,
      libraryEntry,
    };
  }

  /**
   * Remove a book from user's library
   * @param userId - The ID of the user
   * @param libraryId - The ID of the library entry
   * @returns Success message
   */
  async remove(userId: number, libraryId: number) {
    const libraryEntry = await this.userLibraryRepository.findOne({
      where: {
        library_id: libraryId,
        user_id: userId,
      },
    });

    if (!libraryEntry) {
      throw new NotFoundException(ErrorMessage.LIBRARY_ENTRY_NOT_FOUND);
    }

    await libraryEntry.destroy();

    return {
      message: ResponseMessage.BOOK_REMOVED_FROM_LIBRARY,
    };
  }
}

