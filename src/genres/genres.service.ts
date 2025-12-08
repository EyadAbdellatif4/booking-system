import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Genre } from './entities/genre.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ResponseMessage, ErrorMessage } from '../shared/enums';

@Injectable()
export class GenresService {
  constructor(
    @InjectModel(Genre)
    private genreRepository: typeof Genre,
  ) {}

  async create(createGenreDto: CreateGenreDto) {
    const existing = await this.genreRepository.findOne({
      where: { name: { [Op.iLike]: createGenreDto.name } },
    });

    if (existing) {
      throw new ConflictException(ErrorMessage.GENRE_NAME_EXISTS);
    }

    const genre = await this.genreRepository.create(createGenreDto as any);

    return {
      message: ResponseMessage.GENRE_CREATED,
      genre,
    };
  }

  async findAll() {
    const genres = await this.genreRepository.findAll();

    return {
      message: ResponseMessage.GENRES_RETRIEVED,
      data: genres,
    };
  }

  async findOne(id: number) {
    const genre = await this.genreRepository.findByPk(id);

    if (!genre) {
      throw new NotFoundException(ErrorMessage.GENRE_NOT_FOUND);
    }

    return {
      message: ResponseMessage.GENRE_RETRIEVED,
      genre,
    };
  }

  async update(id: number, updateGenreDto: UpdateGenreDto) {
    const genre = await this.genreRepository.findByPk(id);

    if (!genre) {
      throw new NotFoundException(ErrorMessage.GENRE_NOT_FOUND);
    }

    if (updateGenreDto.name) {
      const existing = await this.genreRepository.findOne({
        where: {
          genre_id: { [Op.ne]: id },
          name: { [Op.iLike]: updateGenreDto.name },
        },
      });

      if (existing) {
        throw new ConflictException(ErrorMessage.GENRE_NAME_EXISTS);
      }
    }

    await genre.update(updateGenreDto as any);

    return {
      message: ResponseMessage.GENRE_UPDATED,
      genre,
    };
  }

  async remove(id: number) {
    const genre = await this.genreRepository.findByPk(id);

    if (!genre) {
      throw new NotFoundException(ErrorMessage.GENRE_NOT_FOUND);
    }

    await genre.destroy();

    return {
      message: ResponseMessage.GENRE_DELETED,
    };
  }
}

