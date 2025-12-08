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
import { ChatSender } from '../../shared/enums';

/**
 * ChatLog is a model that represents a chat message
 */
@Table({
  tableName: 'chat_logs',
  timestamps: false,
})
export class ChatLog extends Model<ChatLog> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare message_id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare user_id: number;

  @Column({
    type: DataType.ENUM(...Object.values(ChatSender)),
    allowNull: false,
  })
  declare sender: ChatSender;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare message_content: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  declare timestamp: Date;

  @BelongsTo(() => User)
  user: User;
}
