import {
  BelongsToMany,
  Column,
  Model,
  PrimaryKey,
  Table,
  AutoIncrement,
  DataType,
} from 'sequelize-typescript';
import { Book } from '../../books/entities/book.entity';
import { BookGenre } from '../../shared/database/entities/book-genre.entity';

/**
 * Genre is a model that represents a genre
 */
@Table({
  tableName: 'genres',
  timestamps: false,
})
export class Genre extends Model<Genre> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare genre_id: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  declare name: string;

  @BelongsToMany(() => Book, () => BookGenre, 'genre_id', 'book_id')
  books: Book[];
}
