import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { UserLibraryService } from './user-library.service';
import { AddBookToLibraryDto } from './dto/add-book-to-library.dto';
import { AuthGuard } from '../auth/auth.guard';
import { LibraryStatus } from '../shared/enums';

@Controller('user-library')
@UseGuards(AuthGuard)
export class UserLibraryController {
  constructor(private readonly userLibraryService: UserLibraryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  addBookToLibrary(
    @Body(ValidationPipe) addBookDto: AddBookToLibraryDto,
    @Request() req: any,
  ) {
    return this.userLibraryService.addBookToLibrary(req.user.id, addBookDto);
  }

  @Get()
  findAll(@Request() req: any, @Query('status') status?: LibraryStatus) {
    return this.userLibraryService.findAll(req.user.id, status);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.userLibraryService.findOne(req.user.id, +id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.userLibraryService.remove(req.user.id, +id);
  }
}

