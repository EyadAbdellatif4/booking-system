import {
  BelongsToMany,
  HasMany,
  Column,
  Model,
  PrimaryKey,
  Table,
  AutoIncrement,
  DataType,
} from 'sequelize-typescript';
import { Genre } from '../../genres/entities/genre.entity';
import { BookGenre } from '../../shared/database/entities/book-genre.entity';
import { UserLibrary } from '../../shared/database/entities/user-library.entity';
import { Rating } from '../../ratings/entities/rating.entity';

/**
 * Book is a model that represents a book
 */
@Table({
  tableName: 'books',
  timestamps: false,
})
export class Book extends Model<Book> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare book_id: number;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare author: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  declare cover_image_url: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  declare publication_year: number;

  @BelongsToMany(() => Genre, () => BookGenre, 'book_id', 'genre_id')
  genres: Genre[];

  @HasMany(() => UserLibrary)
  libraryEntries: UserLibrary[];

  @HasMany(() => Rating)
  ratings: Rating[];
}
