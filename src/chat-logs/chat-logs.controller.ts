import { Controller, Get, Post, Body, UseGuards, Request, HttpCode, HttpStatus, ValidationPipe } from '@nestjs/common';
import { ChatLogsService } from './chat-logs.service';
import { CreateChatLogDto } from './dto/create-chat-log.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('chat-logs')
@UseGuards(AuthGuard)
export class ChatLogsController {
  constructor(private readonly chatLogsService: ChatLogsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body(ValidationPipe) createChatLogDto: CreateChatLogDto, @Request() req: any) {
    return this.chatLogsService.create(createChatLogDto, req.user.id);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.chatLogsService.findAll(req.user.id);
  }
}

