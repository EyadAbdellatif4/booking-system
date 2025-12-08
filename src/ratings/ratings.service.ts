import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { Rating } from './entities/rating.entity';
import { Book } from '../books/entities/book.entity';
import { User } from '../users/entities/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ResponseMessage, ErrorMessage } from '../shared/enums';

@Injectable()
export class RatingsService {
  constructor(
    @InjectModel(Rating)
    private ratingRepository: typeof Rating,
    @InjectModel(Book)
    private bookRepository: typeof Book,
    @InjectModel(User)
    private userRepository: typeof User,
  ) {}

  async create(createRatingDto: CreateRatingDto, userId: number) {
    const book = await this.bookRepository.findByPk(createRatingDto.book_id);
    if (!book) {
      throw new NotFoundException(ErrorMessage.BOOK_NOT_FOUND);
    }

    const existing = await this.ratingRepository.findOne({
      where: { user_id: userId, book_id: createRatingDto.book_id },
    });

    if (existing) {
      throw new ConflictException(ErrorMessage.RATING_ALREADY_EXISTS);
    }

    const rating = await this.ratingRepository.create({
      ...createRatingDto,
      user_id: userId,
    } as any);

    const ratingWithRelations = await this.ratingRepository.findByPk(rating.rating_id, {
      include: [{ model: Book }, { model: User, attributes: { exclude: ['password_hash'] } }],
    });

    return {
      message: ResponseMessage.RATING_CREATED,
      rating: ratingWithRelations,
    };
  }

  async findAll(bookId?: number) {
    const where: any = {};
    if (bookId) {
      where.book_id = bookId;
    }

    const ratings = await this.ratingRepository.findAll({
      where,
      include: [{ model: Book }, { model: User, attributes: { exclude: ['password_hash'] } }],
    });

    return {
      message: ResponseMessage.RATINGS_RETRIEVED,
      data: ratings,
    };
  }

  async findOne(id: number) {
    const rating = await this.ratingRepository.findByPk(id, {
      include: [{ model: Book }, { model: User, attributes: { exclude: ['password_hash'] } }],
    });

    if (!rating) {
      throw new NotFoundException(ErrorMessage.RATING_NOT_FOUND);
    }

    return {
      message: ResponseMessage.RATING_RETRIEVED,
      rating,
    };
  }

  async update(id: number, updateRatingDto: UpdateRatingDto, userId: number) {
    const rating = await this.ratingRepository.findOne({
      where: { rating_id: id, user_id: userId },
    });

    if (!rating) {
      throw new NotFoundException(ErrorMessage.RATING_NOT_FOUND);
    }

    await rating.update(updateRatingDto as any);

    const updatedRating = await this.ratingRepository.findByPk(id, {
      include: [{ model: Book }, { model: User, attributes: { exclude: ['password_hash'] } }],
    });

    return {
      message: ResponseMessage.RATING_UPDATED,
      rating: updatedRating,
    };
  }

  async remove(id: number, userId: number) {
    const rating = await this.ratingRepository.findOne({
      where: { rating_id: id, user_id: userId },
    });

    if (!rating) {
      throw new NotFoundException(ErrorMessage.RATING_NOT_FOUND);
    }

    await rating.destroy();

    return {
      message: ResponseMessage.RATING_DELETED,
    };
  }
}

