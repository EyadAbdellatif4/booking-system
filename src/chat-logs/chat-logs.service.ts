import { Injectable } from '@nestjs/common';
import { CreateChatLogDto } from './dto/create-chat-log.dto';
import { ChatLog } from './entities/chat-log.entity';
import { User } from '../users/entities/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import { ResponseMessage, ChatSender } from '../shared/enums';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';
import { Book } from '../books/entities/book.entity';
import { UserLibrary } from '../shared/database/entities/user-library.entity';
import { Genre } from '../genres/entities/genre.entity';
import { Op } from 'sequelize';

@Injectable()
export class ChatLogsService {
  private genAI: GoogleGenerativeAI;
  private cachedModelName: string | null = null;

  constructor(
    @InjectModel(ChatLog)
    private chatLogRepository: typeof ChatLog,
    @InjectModel(User)
    private userRepository: typeof User,
    @InjectModel(Book)
    private bookRepository: typeof Book,
    @InjectModel(UserLibrary)
    private userLibraryRepository: typeof UserLibrary,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('GOOGLE_AI_API_KEY');
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  /**
   * Get available model name - cache it after first lookup
   */
  private async getAvailableModelName(): Promise<string> {
    if (this.cachedModelName) {
      return this.cachedModelName;
    }

    const apiKey = this.configService.get<string>('GOOGLE_AI_API_KEY');
    if (!apiKey) {
      throw new Error('API key is not configured');
    }

    try {
      // List available models
      const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
      const listResponse = await fetch(listUrl);
      
      if (listResponse.ok) {
        const listData = await listResponse.json();
        
        if (listData.models && Array.isArray(listData.models)) {
          // Find first model that supports generateContent (prefer free tier models)
          const preferredModels = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.5-pro'];
          
          for (const preferredName of preferredModels) {
            const model = listData.models.find(
              (m: any) => 
                (m.name === `models/${preferredName}` || m.name === preferredName) &&
                m.supportedGenerationMethods?.includes('generateContent')
            );
            if (model) {
              // Extract model name (remove 'models/' prefix if present)
              this.cachedModelName = preferredName;
              console.log(`Cached model name: ${this.cachedModelName}`);
              return this.cachedModelName;
            }
          }

          // Fallback to any model that supports generateContent
          for (const model of listData.models) {
            if (model.supportedGenerationMethods?.includes('generateContent')) {
              let modelName: string;
              if (model.name.includes('/')) {
                const parts = model.name.split('/');
                modelName = parts[parts.length - 1] || model.name;
              } else {
                modelName = model.name;
              }
              this.cachedModelName = modelName;
              console.log(`Cached model name (fallback): ${this.cachedModelName}`);
              return this.cachedModelName;
            }
          }
        }
      }
    } catch (error) {
      console.error('Error listing models:', error);
    }

    // Final fallback to known free tier model
    this.cachedModelName = 'gemini-2.5-flash';
    return this.cachedModelName;
  }

  async create(createChatLogDto: CreateChatLogDto, userId: number) {
    const userMessage = createChatLogDto.message_content;

    // Save user message
    const userChatLog = await this.chatLogRepository.create({
      user_id: userId,
      sender: ChatSender.USER,
      message_content: userMessage,
    } as any);

    // Get user's library to exclude those books
    const userLibraryEntries = await this.userLibraryRepository.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Book,
          as: 'book',
        },
      ],
    });

    const excludedBookIds = userLibraryEntries.map((entry) => entry.book_id);

    // Get all available books with genres (excluding user's library)
    const availableBooks = await this.bookRepository.findAll({
      where: excludedBookIds.length > 0 
        ? { book_id: { [Op.notIn]: excludedBookIds } }
        : {},
      include: [
        {
          model: Genre,
          as: 'genres',
          through: { attributes: [] },
        },
      ],
      limit: 50, // Limit to reasonable number for AI context
    });

    // Format books for AI prompt
    const booksInfo = availableBooks.map((book) => ({
      id: book.book_id,
      title: book.title,
      author: book.author,
      description: book.description || '',
      genres: book.genres?.map((g) => g.name).join(', ') || '',
      publication_year: book.publication_year || '',
    }));

    // Generate AI response
    let botResponse = 'I apologize, but I am unable to process your request at the moment.';
    
    if (this.genAI && booksInfo.length > 0) {
      try {
        // Get the available model name (cached after first call)
        const modelName = await this.getAvailableModelName();
        console.log(`Using model: ${modelName}`);
        
        const model = this.genAI.getGenerativeModel({ model: modelName });

        const prompt = `You are a helpful book recommendation assistant. A user is asking for book recommendations.

User's question: "${userMessage}"

Available books (DO NOT recommend books that are not in this list):
${JSON.stringify(booksInfo, null, 2)}

Instructions:
1. If the user asks about a genre, recommend books from that genre from the available books list.
2. If the user mentions books they've read, recommend similar books based on genre or theme from the available books list.
3. If the user mentions a mood (like "I'm happy", "I'm sad", etc.), recommend books that match that mood from the available books list.
4. Always recommend books ONLY from the available books list provided above.
5. Format your response as a friendly recommendation, mentioning the book title, author, and why you think they would like it.
6. If no suitable books are found, politely explain that you couldn't find a good match.

Respond with a natural, conversational recommendation. Do not include book IDs in your response.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        botResponse = response.text();
        console.log('Successfully generated response from AI');
      } catch (error: any) {
        console.error('Error calling Google Generative AI:', error);
        // Clear cached model name on error to retry discovery
        this.cachedModelName = null;
        botResponse = `I apologize, but I encountered an error while processing your request: ${error.message || 'Unknown error'}. Please try again.`;
      }
    } else if (booksInfo.length === 0) {
      botResponse = 'I notice you have already added all available books to your library! There are no new books to recommend at the moment.';
    }

    // Save bot response
    const botChatLog = await this.chatLogRepository.create({
      user_id: userId,
      sender: ChatSender.BOT,
      message_content: botResponse,
    } as any);

    // Return both messages
    return {
      message: ResponseMessage.CHAT_LOG_CREATED,
      userMessage: {
        message_id: userChatLog.message_id,
        sender: userChatLog.sender,
        message_content: userChatLog.message_content,
        timestamp: userChatLog.timestamp,
      },
      botResponse: {
        message_id: botChatLog.message_id,
        sender: botChatLog.sender,
        message_content: botChatLog.message_content,
        timestamp: botChatLog.timestamp,
      },
    };
  }

  async findAll(userId: number) {
    const chatLogs = await this.chatLogRepository.findAll({
      where: { user_id: userId },
      include: [{ model: User, attributes: { exclude: ['password_hash'] } }],
      order: [['timestamp', 'ASC']],
    });

    return {
      message: ResponseMessage.CHAT_LOGS_RETRIEVED,
      data: chatLogs,
    };
  }
}
