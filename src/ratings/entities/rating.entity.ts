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
import { User } from '../../users/entities/user.entity';
import { Book } from '../../books/entities/book.entity';

/**
 * Rating is a model that represents a user's rating for a book
 */
@Table({
  tableName: 'ratings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
})
export class Rating extends Model<Rating> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare rating_id: number;

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
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  })
  declare score: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare comment: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  declare created_at: Date;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Book)
  book: Book;
}
