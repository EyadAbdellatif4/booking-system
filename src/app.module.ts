import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { SequelizeModule } from '@nestjs/sequelize';
import * as fs from 'fs';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { GenresModule } from './genres/genres.module';
import { RatingsModule } from './ratings/ratings.module';
import { ChatLogsModule } from './chat-logs/chat-logs.module';
import { UserLibraryModule } from './user-library/user-library.module';
import databaseModels from './shared/database/databaseModel';
import { AuthGuard } from './auth/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const dbHost = configService.get('DB_HOST') || '';
        const isCloudSqlSocket = dbHost.startsWith('/cloudsql/');
        const isProduction = configService.get('NODE_ENV') === 'production';
        
        // For Cloud SQL Unix socket connections, SSL is not needed
        // For TCP connections in production, SSL is required
        const needsSSL = isProduction && !isCloudSqlSocket;
        
        return {
          dialect: 'postgres',
          host: dbHost,
          port: configService.get('DB_PORT') || 5432,
          username: configService.get('DB_USER'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          dialectOptions: {
            ...(needsSSL
              ? {
                  ssl: {
                    require: true,
                    rejectUnauthorized: false,
                    ca: configService.get<string>('DB_SSL_CA')
                      ? fs
                          .readFileSync(configService.get<string>('DB_SSL_CA')!)
                          .toString()
                      : undefined,
                  },
                }
              : {}),
          },
          models: databaseModels(),
          force: false,
          pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
          },
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    BooksModule,
    GenresModule,
    RatingsModule,
    ChatLogsModule,
    UserLibraryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerModule,
    },
  ],
})
export class AppModule {}
