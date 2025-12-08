import {
  Column,
  Model,
  PrimaryKey,
  Table,
  ForeignKey,
  DataType,
} from 'sequelize-typescript';
import { Book } from '../../../books/entities/book.entity';
import { Genre } from '../../../genres/entities/genre.entity';

/**
 * BookGenre is a junction model that represents the many-to-many relationship between books and genres
 */
@Table({
  tableName: 'book_genres',
  timestamps: false,
})
export class BookGenre extends Model<BookGenre> {
  @PrimaryKey
  @ForeignKey(() => Book)
  @Column(DataType.INTEGER)
  declare book_id: number;

  @PrimaryKey
  @ForeignKey(() => Genre)
  @Column(DataType.INTEGER)
  declare genre_id: number;
}
