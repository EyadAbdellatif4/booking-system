import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, HttpCode, HttpStatus, ValidationPipe, Query } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('ratings')
@UseGuards(AuthGuard)
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body(ValidationPipe) createRatingDto: CreateRatingDto, @Request() req: any) {
    return this.ratingsService.create(createRatingDto, req.user.id);
  }

  @Get()
  findAll(@Query('book_id') bookId?: string) {
    return this.ratingsService.findAll(bookId ? +bookId : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ratingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body(ValidationPipe) updateRatingDto: UpdateRatingDto, @Request() req: any) {
    return this.ratingsService.update(+id, updateRatingDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.ratingsService.remove(+id, req.user.id);
  }
}

