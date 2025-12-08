import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserLibraryController } from './user-library.controller';
import { UserLibraryService } from './user-library.service';
import { UserLibrary } from '../shared/database/entities/user-library.entity';
import { Book } from '../books/entities/book.entity';
import { Genre } from '../genres/entities/genre.entity';

@Module({
  imports: [SequelizeModule.forFeature([UserLibrary, Book, Genre])],
  controllers: [UserLibraryController],
  providers: [UserLibraryService],
  exports: [UserLibraryService],
})
export class UserLibraryModule {}
