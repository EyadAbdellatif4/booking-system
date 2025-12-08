import { Module } from '@nestjs/common';
import { ChatLogsService } from './chat-logs.service';
import { ChatLogsController } from './chat-logs.controller';
import { ChatLog } from './entities/chat-log.entity';
import { User } from '../users/entities/user.entity';
import { Book } from '../books/entities/book.entity';
import { UserLibrary } from '../shared/database/entities/user-library.entity';
import { Genre } from '../genres/entities/genre.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    SequelizeModule.forFeature([ChatLog, User, Book, UserLibrary, Genre]),
    AuthModule,
  ],
  controllers: [ChatLogsController],
  providers: [ChatLogsService],
  exports: [ChatLogsService],
})
export class ChatLogsModule {}
