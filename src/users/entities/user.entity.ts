import {
  HasMany,
  Column,
  Model,
  PrimaryKey,
  Table,
  AutoIncrement,
  DataType,
} from 'sequelize-typescript';
import { UserLibrary } from '../../shared/database/entities/user-library.entity';
import { Rating } from '../../ratings/entities/rating.entity';
import { ChatLog } from '../../chat-logs/entities/chat-log.entity';

/**
 * User is a model that represents a user
 */
@Table({
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
})
export class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare user_id: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    unique: true,
  })
  declare username: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    unique: true,
  })
  declare email: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare password_hash: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  declare created_at: Date;

  @HasMany(() => UserLibrary)
  libraryEntries: UserLibrary[];

  @HasMany(() => Rating)
  ratings: Rating[];

  @HasMany(() => ChatLog)
  chatLogs: ChatLog[];
}
