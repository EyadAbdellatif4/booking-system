/**
 * Library Status enum
 */
export enum LibraryStatus {
  FAVORITE = 'FAVORITE',
  FINISHED = 'FINISHED',
}

/**
 * Chat Sender enum
 */
export enum ChatSender {
  USER = 'USER',
  BOT = 'BOT',
}

/**
 * Role Names enum
 */
export enum RoleName {
  ADMIN = 'admin',
  USER = 'user',
}

/**
 * Response Messages enum
 */
export enum ResponseMessage {
  // Auth
  USER_REGISTERED = 'User registered successfully',
  USER_LOGGED_IN = 'User logged in successfully',
  
  // Users
  USER_CREATED = 'User created successfully',
  USER_UPDATED = 'User updated successfully',
  USER_DELETED = 'User deleted successfully',
  USER_RETRIEVED = 'User retrieved successfully',
  USERS_RETRIEVED = 'Users retrieved successfully',
  
  // Books
  BOOK_CREATED = 'Book created successfully',
  BOOK_UPDATED = 'Book updated successfully',
  BOOK_DELETED = 'Book deleted successfully',
  BOOK_RETRIEVED = 'Book retrieved successfully',
  BOOKS_RETRIEVED = 'Books retrieved successfully',
  
  // Genres
  GENRE_CREATED = 'Genre created successfully',
  GENRE_UPDATED = 'Genre updated successfully',
  GENRE_DELETED = 'Genre deleted successfully',
  GENRE_RETRIEVED = 'Genre retrieved successfully',
  GENRES_RETRIEVED = 'Genres retrieved successfully',
  
  // Library
  BOOK_ADDED_TO_LIBRARY = 'Book added to library successfully',
  BOOK_REMOVED_FROM_LIBRARY = 'Book removed from library successfully',
  LIBRARY_RETRIEVED = 'Library retrieved successfully',
  
  // Ratings
  RATING_CREATED = 'Rating created successfully',
  RATING_UPDATED = 'Rating updated successfully',
  RATING_DELETED = 'Rating deleted successfully',
  RATING_RETRIEVED = 'Rating retrieved successfully',
  RATINGS_RETRIEVED = 'Ratings retrieved successfully',
  
  // Chat Logs
  CHAT_LOG_CREATED = 'Chat log created successfully',
  CHAT_LOGS_RETRIEVED = 'Chat logs retrieved successfully',
}

/**
 * Default Values enum
 */
export const DefaultValues = {
  IS_ACTIVE: true,
  IS_INACTIVE: false,
} as const;

/**
 * Validation Patterns enum
 */
export enum ValidationPattern {
  NAME = '^[a-zA-Z\\s]+$',
  USERNAME = '^[a-zA-Z0-9_]+$',
}

/**
 * Error Messages enum
 */
export enum ErrorMessage {
  // Validation
  NAME_REQUIRED = 'Name is required',
  USERNAME_REQUIRED = 'Username is required',
  EMAIL_REQUIRED = 'Email is required',
  PASSWORD_REQUIRED = 'Password is required',
  TITLE_REQUIRED = 'Title is required',
  AUTHOR_REQUIRED = 'Author is required',
  GENRE_NAME_REQUIRED = 'Genre name is required',
  BOOK_ID_REQUIRED = 'Book ID is required',
  USER_ID_REQUIRED = 'User ID is required',
  SCORE_REQUIRED = 'Score is required',
  MESSAGE_CONTENT_REQUIRED = 'Message content is required',
  SENDER_REQUIRED = 'Sender is required',
  
  // Type validation
  NAME_MUST_BE_STRING = 'Name must be a string',
  USERNAME_MUST_BE_STRING = 'Username must be a string',
  EMAIL_MUST_BE_STRING = 'Email must be a string',
  PASSWORD_MUST_BE_STRING = 'Password must be a string',
  TITLE_MUST_BE_STRING = 'Title must be a string',
  AUTHOR_MUST_BE_STRING = 'Author must be a string',
  GENRE_NAME_MUST_BE_STRING = 'Genre name must be a string',
  SCORE_MUST_BE_NUMBER = 'Score must be a number',
  MESSAGE_CONTENT_MUST_BE_STRING = 'Message content must be a string',
  
  // Length validation
  NAME_MIN_LENGTH = 'Name must be at least 3 characters long',
  NAME_MAX_LENGTH = 'Name cannot exceed 100 characters',
  USERNAME_MIN_LENGTH = 'Username must be at least 3 characters long',
  USERNAME_MAX_LENGTH = 'Username cannot exceed 50 characters',
  EMAIL_MAX_LENGTH = 'Email cannot exceed 50 characters',
  PASSWORD_MIN_LENGTH = 'Password must be at least 6 characters long',
  PASSWORD_MAX_LENGTH = 'Password cannot exceed 255 characters',
  TITLE_MIN_LENGTH = 'Title must be at least 1 character long',
  TITLE_MAX_LENGTH = 'Title cannot exceed 200 characters',
  AUTHOR_MIN_LENGTH = 'Author must be at least 1 character long',
  AUTHOR_MAX_LENGTH = 'Author cannot exceed 100 characters',
  GENRE_NAME_MIN_LENGTH = 'Genre name must be at least 2 characters long',
  GENRE_NAME_MAX_LENGTH = 'Genre name cannot exceed 50 characters',
  
  // Range validation
  SCORE_MIN = 'Score must be at least 1',
  SCORE_MAX = 'Score cannot exceed 5',
  PUBLICATION_YEAR_MIN = 'Publication year must be at least 1000',
  PUBLICATION_YEAR_MAX = 'Publication year cannot exceed current year',
  
  // Format validation
  EMAIL_INVALID = 'Please provide a valid email address',
  
  // Not Found
  USER_NOT_FOUND = 'User not found',
  BOOK_NOT_FOUND = 'Book not found',
  GENRE_NOT_FOUND = 'Genre not found',
  RATING_NOT_FOUND = 'Rating not found',
  LIBRARY_ENTRY_NOT_FOUND = 'Library entry not found',
  
  // Conflicts
  EMAIL_EXISTS = 'User with this email already exists',
  USERNAME_EXISTS = 'User with this username already exists',
  GENRE_NAME_EXISTS = 'Genre with this name already exists',
  BOOK_ALREADY_IN_LIBRARY = 'Book is already in library',
  RATING_ALREADY_EXISTS = 'Rating already exists for this book by this user',
  
  // Authentication
  ACCESS_TOKEN_REQUIRED = 'Access token is required',
  INVALID_USER_ROLE = 'Invalid user role',
  INSUFFICIENT_PERMISSIONS = 'Insufficient permissions',
  INVALID_CREDENTIALS = 'Invalid credentials',
  USER_NOT_ACTIVE = 'User is not active',
  INVALID_OR_EXPIRED_TOKEN = 'Invalid or expired token',
  
  // General
  INVALID_UUID_FORMAT = 'Invalid UUID format',
}

