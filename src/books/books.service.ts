import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookFilterDto } from './dto/book-filter.dto';
import { Book } from './entities/book.entity';
import { Genre } from '../genres/entities/genre.entity';
import { BookGenre } from '../shared/database/entities/book-genre.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ResponseMessage, ErrorMessage } from '../shared/enums';
import {
  buildOrderClause,
  buildSearchClause,
} from '../shared/utils/filter.util';
import {
  calculateOffset,
  getPaginationParams,
  getPaginationMetadata,
} from '../shared/utils/pagination.util';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book)
    private bookRepository: typeof Book,
    @InjectModel(Genre)
    private genreRepository: typeof Genre,
    @InjectModel(BookGenre)
    private bookGenreRepository: typeof BookGenre,
  ) {}

  async create(createBookDto: CreateBookDto) {
    const { genre_ids, ...bookData } = createBookDto;

    const book = await this.bookRepository.create(bookData as any);

    if (genre_ids && genre_ids.length > 0) {
      // Verify all genres exist
      const genres = await this.genreRepository.findAll({
        where: { genre_id: { [Op.in]: genre_ids } },
      });

      if (genres.length !== genre_ids.length) {
        throw new NotFoundException(ErrorMessage.GENRE_NOT_FOUND);
      }

      // Create book-genre associations
      await this.bookGenreRepository.bulkCreate(
        genre_ids.map((genre_id) => ({
          book_id: book.book_id,
          genre_id,
        })) as any,
      );
    }

    const bookWithGenres = await this.bookRepository.findByPk(book.book_id, {
      include: [{ model: Genre, through: { attributes: [] } }],
    });

    return {
      message: ResponseMessage.BOOK_CREATED,
      book: bookWithGenres,
    };
  }

  async findAll(filterDto: BookFilterDto) {
    const { page, limit } = getPaginationParams(filterDto.page, filterDto.limit);
    const offset = calculateOffset(page, limit);

    const where: any = {};
    const whereConditions: any[] = [];

    // Publication year filter
    if (filterDto.publication_year) {
      whereConditions.push({ publication_year: filterDto.publication_year });
    }

    // General search across title, author, and description (book table fields only)
    if (filterDto.search) {
      const searchClause = buildSearchClause(filterDto.search, ['title', 'author', 'description']);
      if (searchClause) {
        whereConditions.push(searchClause);
      }
    }

    // Combine all where conditions
    if (whereConditions.length > 0) {
      where[Op.and] = whereConditions;
    }

    // Build include clause for genres
    const include: any[] = [{ 
      model: Genre, 
      as: 'genres',
      through: { attributes: [] },
      attributes: ['genre_id', 'name'],
    }];

    // If filtering by genre name, use INNER JOIN to filter books
    if (filterDto.genre) {
      include[0].where = { name: { [Op.iLike]: `%${filterDto.genre}%` } };
      include[0].required = true; // Use INNER JOIN instead of LEFT JOIN
    }

    const order = buildOrderClause(filterDto.sortBy || 'book_id', filterDto.sortOrder || 'ASC');

    const { rows, count } = await this.bookRepository.findAndCountAll({
      where,
      include,
      order,
      limit,
      offset,
      distinct: true,
      subQuery: false, // Important for proper counting with joins
    });

    return {
      message: ResponseMessage.BOOKS_RETRIEVED,
      data: rows,
      pagination: getPaginationMetadata(count, page, limit),
    };
  }

  async findOne(id: number) {
    const book = await this.bookRepository.findByPk(id, {
      include: [{ model: Genre, through: { attributes: [] } }],
    });

    if (!book) {
      throw new NotFoundException(ErrorMessage.BOOK_NOT_FOUND);
    }

    return {
      message: ResponseMessage.BOOK_RETRIEVED,
      book,
    };
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    const book = await this.bookRepository.findByPk(id);

    if (!book) {
      throw new NotFoundException(ErrorMessage.BOOK_NOT_FOUND);
    }

    const { genre_ids, ...bookData } = updateBookDto;

    await book.update(bookData as any);

    if (genre_ids !== undefined) {
      // Remove existing associations
      await this.bookGenreRepository.destroy({
        where: { book_id: id },
      });

      // Add new associations
      if (genre_ids.length > 0) {
        const genres = await this.genreRepository.findAll({
          where: { genre_id: { [Op.in]: genre_ids } },
        });

        if (genres.length !== genre_ids.length) {
          throw new NotFoundException(ErrorMessage.GENRE_NOT_FOUND);
        }

        await this.bookGenreRepository.bulkCreate(
          genre_ids.map((genre_id) => ({
            book_id: id,
            genre_id,
          })) as any,
        );
      }
    }

    const bookWithGenres = await this.bookRepository.findByPk(id, {
      include: [{ model: Genre, through: { attributes: [] } }],
    });

    return {
      message: ResponseMessage.BOOK_UPDATED,
      book: bookWithGenres,
    };
  }

  async remove(id: number) {
    const book = await this.bookRepository.findByPk(id);

    if (!book) {
      throw new NotFoundException(ErrorMessage.BOOK_NOT_FOUND);
    }

    await book.destroy();

    return {
      message: ResponseMessage.BOOK_DELETED,
    };
  }
}

