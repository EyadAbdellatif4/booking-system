import {
  BelongsTo,
  Column,
  Model,
  PrimaryKey,
  Table,
  AutoIncrement,
  ForeignKey,
  DataType,
} from 'sequelize-typescript';
import { User } from '../../../users/entities/user.entity';
import { Book } from '../../../books/entities/book.entity';
import { LibraryStatus } from '../../enums';

/**
 * UserLibrary is a model that represents a user's library entry
 */
@Table({
  tableName: 'user_library',
  timestamps: true,
  createdAt: 'added_at',
  updatedAt: 'updated_at',
})
export class UserLibrary extends Model<UserLibrary> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare library_id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare user_id: number;

  @ForeignKey(() => Book)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare book_id: number;

  @Column({
    type: DataType.ENUM(...Object.values(LibraryStatus)),
    allowNull: false,
  })
  declare status: LibraryStatus;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  declare added_at: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  declare updated_at: Date;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Book)
  book: Book;
}
