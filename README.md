# Booking System - Backend API

A comprehensive RESTful API backend built with NestJS for managing a book library system. This project includes user authentication, book management, ratings, user libraries, genres, and chat logging functionality.

> **Note for Frontend Developers**: This README is written with frontend developers in mind who are learning backend development. We'll explain backend concepts in a way that's easy to understand!

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Technologies Used](#technologies-used)
3. [Project Structure](#project-structure)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Getting Started](#getting-started)
7. [Environment Variables](#environment-variables)
8. [Authentication System](#authentication-system)
9. [Running the Project](#running-the-project)
10. [Database Migrations](#database-migrations)
11. [Architecture Overview](#architecture-overview)
12. [Common Tasks](#common-tasks)

---

## 🎯 Project Overview

This is a **backend API** (Application Programming Interface) for a book library management system. Think of it as the "server" that your frontend application will communicate with to:

- Register and login users
- Manage books (create, read, update, delete)
- Organize books by genres
- Allow users to rate books
- Let users maintain their personal library (favorites, finished books)
- Log chat interactions (for AI chat features)

### What is a Backend API?

If you're coming from frontend development, think of it this way:
- **Frontend**: The user interface (what users see and interact with)
- **Backend**: The server that processes requests, stores data, and sends responses
- **API**: The set of rules/endpoints that allow frontend and backend to communicate

When your frontend makes a request like `GET /books`, the backend processes it, queries the database, and returns the book data in JSON format.

---

## 🛠 Technologies Used

### Core Framework
- **NestJS** (`@nestjs/core`): A progressive Node.js framework for building efficient and scalable server-side applications. Think of it like React for the backend - it provides structure and reusable components (modules, controllers, services).

### Database & ORM
- **PostgreSQL**: A powerful, open-source relational database. It stores all your data in tables (like a spreadsheet).
- **Sequelize** (`sequelize`): An Object-Relational Mapping (ORM) tool. Instead of writing raw SQL queries, you use JavaScript/TypeScript code to interact with the database. It's like having a translator between your code and the database.

### Authentication
- **JWT** (`@nestjs/jwt`): JSON Web Tokens - a secure way to authenticate users. When a user logs in, they get a token that proves they're authenticated.
- **Passport** (`passport`, `passport-jwt`): Authentication middleware - handles the logic of checking if a user is logged in.
- **bcrypt**: A library for hashing passwords. Passwords are never stored in plain text - they're encrypted before saving to the database.

### Validation & Security
- **class-validator**: Validates incoming data (like checking if an email is valid).
- **class-transformer**: Transforms data between different formats.
- **@nestjs/throttler**: Rate limiting - prevents users from making too many requests (protects against attacks).

### Configuration
- **@nestjs/config**: Manages environment variables (like database credentials, API keys).
- **dotenv**: Loads environment variables from a `.env` file.

### Development Tools
- **TypeScript**: Adds type safety to JavaScript (like PropTypes but for the entire codebase).
- **ESLint**: Code linter - finds and fixes code quality issues.
- **Prettier**: Code formatter - keeps code style consistent.
- **Jest**: Testing framework (like React Testing Library for backend).

---

## 📁 Project Structure

```
booking-system/
├── src/                          # Source code directory
│   ├── main.ts                  # Application entry point (like index.js in React)
│   ├── app.module.ts            # Root module (like App.js - ties everything together)
│   ├── app.controller.ts        # Root controller (handles basic routes)
│   │
│   ├── auth/                    # Authentication module
│   │   ├── auth.controller.ts  # Handles /auth routes (login, register)
│   │   ├── auth.service.ts      # Business logic for authentication
│   │   ├── auth.guard.ts        # Protects routes (checks if user is logged in)
│   │   ├── auth.module.ts       # Auth module configuration
│   │   ├── dto/                 # Data Transfer Objects (defines request/response shapes)
│   │   └── decorators/          # Custom decorators (@Public(), @Roles())
│   │
│   ├── users/                   # User management module
│   │   ├── users.controller.ts # Handles /users routes
│   │   ├── users.service.ts     # User business logic
│   │   ├── users.module.ts      # User module configuration
│   │   ├── dto/                 # User DTOs (CreateUserDto, UpdateUserDto)
│   │   └── entities/            # User database model
│   │
│   ├── books/                   # Book management module
│   │   ├── books.controller.ts # Handles /books routes
│   │   ├── books.service.ts     # Book business logic
│   │   ├── books.module.ts      # Book module configuration
│   │   ├── dto/                 # Book DTOs
│   │   └── entities/            # Book database model
│   │
│   ├── genres/                  # Genre management module
│   ├── ratings/                 # Rating management module
│   ├── user-library/            # User's personal library module
│   ├── chat-logs/               # Chat logging module
│   │
│   └── shared/                  # Shared utilities and configurations
│       ├── database/            # Database configuration and migrations
│       │   ├── migrations/      # Database migration files (creates/updates tables)
│       │   ├── seeders/         # Seed files (populates database with initial data)
│       │   └── config.js        # Database connection configuration
│       ├── dto/                  # Shared DTOs
│       ├── enums/               # Shared enums (constants)
│       └── utils/               # Utility functions
│
├── dist/                        # Compiled JavaScript (generated after build)
├── test/                        # Test files
├── package.json                 # Project dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── nest-cli.json                # NestJS CLI configuration
└── README.md                    # This file!
```

### Key Concepts Explained

#### Modules
A **module** is like a feature container. Each feature (auth, users, books) has its own module. Modules organize related code together.

#### Controllers
**Controllers** handle HTTP requests and responses. They're like route handlers in Express.js. When a request comes to `/books`, the `BooksController` handles it.

#### Services
**Services** contain business logic. Controllers call services to do the actual work. This separation keeps code organized and testable.

#### DTOs (Data Transfer Objects)
**DTOs** define the shape of data being sent to or received from the API. They're like TypeScript interfaces but with validation rules.

Example:
```typescript
// CreateBookDto defines what data is needed to create a book
class CreateBookDto {
  title: string;        // Required
  author: string;       // Required
  description?: string; // Optional
}
```

#### Entities
**Entities** represent database tables. They define the structure of data stored in the database.

---

## 🗄 Database Schema

The database consists of 7 main tables with relationships between them:

### Tables Overview

1. **users** - Stores user accounts
2. **books** - Stores book information
3. **genres** - Stores book genres (Fiction, Non-Fiction, etc.)
4. **book_genres** - Junction table (many-to-many: books can have multiple genres)
5. **ratings** - Stores user ratings for books
6. **user_library** - Stores user's personal library (favorites, finished books)
7. **chat_logs** - Stores chat conversation logs

### Detailed Table Structure

#### `users` Table
```sql
- user_id (Primary Key, Auto-increment)
- username (Unique, Required)
- email (Unique, Required)
- password_hash (Required) - Encrypted password
- created_at (Timestamp)
```

#### `books` Table
```sql
- book_id (Primary Key, Auto-increment)
- title (Required, Max 200 chars)
- author (Required, Max 100 chars)
- description (Optional, Text)
- cover_image_url (Optional, Max 500 chars)
- publication_year (Optional, Integer)
```

#### `genres` Table
```sql
- genre_id (Primary Key, Auto-increment)
- name (Unique, Required, Max 50 chars)
```

#### `book_genres` Table (Junction Table)
```sql
- book_id (Foreign Key → books.book_id)
- genre_id (Foreign Key → genres.genre_id)
- Primary Key: (book_id, genre_id) - Composite key
```

**Why a junction table?** A book can belong to multiple genres (e.g., "Science Fiction" and "Adventure"), and a genre can have many books. This is a many-to-many relationship.

#### `ratings` Table
```sql
- rating_id (Primary Key, Auto-increment)
- user_id (Foreign Key → users.user_id)
- book_id (Foreign Key → books.book_id)
- score (Required, Integer, 1-5)
- comment (Optional, Text)
- created_at (Timestamp)
- Unique Constraint: (user_id, book_id) - A user can only rate a book once
```

#### `user_library` Table
```sql
- library_id (Primary Key, Auto-increment)
- user_id (Foreign Key → users.user_id)
- book_id (Foreign Key → books.book_id)
- status (Required, ENUM: 'FAVORITE' or 'FINISHED')
- added_at (Timestamp)
- updated_at (Timestamp)
- Unique Constraint: (user_id, book_id) - A user can only add a book once
```

#### `chat_logs` Table
```sql
- message_id (Primary Key, Auto-increment)
- user_id (Foreign Key → users.user_id)
- sender (Required, ENUM: 'USER' or 'BOT')
- message_content (Required, Text)
- timestamp (Timestamp)
```

### Relationships Diagram

```
users
  ├── 1:N → ratings (one user can have many ratings)
  ├── 1:N → user_library (one user can have many library entries)
  └── 1:N → chat_logs (one user can have many chat messages)

books
  ├── 1:N → ratings (one book can have many ratings)
  ├── 1:N → user_library (one book can be in many users' libraries)
  └── N:M → genres (many-to-many via book_genres table)
```

---

## 🔌 API Endpoints

All endpoints return JSON responses. Most endpoints require authentication (JWT token in the Authorization header).

### Base URL
```
http://localhost:8080
```

### Authentication Endpoints

#### `POST /auth/register`
Register a new user.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "user_id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Rate Limit:** 3 requests per minute

#### `POST /auth/login`
Login an existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "message": "User logged in successfully",
  "user": {
    "user_id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Rate Limit:** 5 requests per minute

**Note:** Save the `access_token` and include it in subsequent requests:
```
Authorization: Bearer <access_token>
```

---

### User Endpoints

All user endpoints require authentication.

#### `GET /users`
Get all users (with optional filtering).

**Query Parameters:**
- `page` (optional): Page number for pagination
- `limit` (optional): Number of results per page
- `search` (optional): Search by username or email

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "data": [
    {
      "user_id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

#### `GET /users/:id`
Get a specific user by ID.

#### `POST /users`
Create a new user (admin only - typically).

#### `PATCH /users/:id`
Update a user.

#### `DELETE /users/:id`
Delete a user.

---

### Book Endpoints

All book endpoints require authentication.

#### `GET /books`
Get all books (with optional filtering).

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Results per page
- `search` (optional): Search by title or author
- `genre_id` (optional): Filter by genre

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "data": [
    {
      "book_id": 1,
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "description": "A classic American novel...",
      "cover_image_url": "https://example.com/cover.jpg",
      "publication_year": 1925,
      "genres": [
        {
          "genre_id": 1,
          "name": "Fiction"
        }
      ]
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

#### `GET /books/:id`
Get a specific book by ID.

#### `POST /books`
Create a new book.

**Request Body:**
```json
{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "description": "A classic American novel...",
  "cover_image_url": "https://example.com/cover.jpg",
  "publication_year": 1925,
  "genre_ids": [1, 2]
}
```

#### `PATCH /books/:id`
Update a book.

#### `DELETE /books/:id`
Delete a book.

---

### Genre Endpoints

All genre endpoints require authentication.

#### `GET /genres`
Get all genres.

**Response:**
```json
[
  {
    "genre_id": 1,
    "name": "Fiction"
  },
  {
    "genre_id": 2,
    "name": "Non-Fiction"
  }
]
```

#### `GET /genres/:id`
Get a specific genre.

#### `POST /genres`
Create a new genre.

**Request Body:**
```json
{
  "name": "Science Fiction"
}
```

#### `PATCH /genres/:id`
Update a genre.

#### `DELETE /genres/:id`
Delete a genre.

---

### Rating Endpoints

All rating endpoints require authentication.

#### `GET /ratings`
Get all ratings (optionally filtered by book).

**Query Parameters:**
- `book_id` (optional): Filter ratings for a specific book

**Response:**
```json
[
  {
    "rating_id": 1,
    "user_id": 1,
    "book_id": 1,
    "score": 5,
    "comment": "Amazing book!",
    "created_at": "2024-01-01T00:00:00.000Z",
    "user": {
      "username": "john_doe"
    }
  }
]
```

#### `GET /ratings/:id`
Get a specific rating.

#### `POST /ratings`
Create a new rating (automatically uses the authenticated user's ID).

**Request Body:**
```json
{
  "book_id": 1,
  "score": 5,
  "comment": "Amazing book!"
}
```

**Note:** The `user_id` is automatically taken from the JWT token.

#### `PATCH /ratings/:id`
Update a rating (only if you own it).

#### `DELETE /ratings/:id`
Delete a rating (only if you own it).

---

### User Library Endpoints

All user library endpoints require authentication and automatically use the authenticated user's ID.

#### `GET /user-library`
Get all books in the user's library.

**Query Parameters:**
- `status` (optional): Filter by status (`FAVORITE` or `FINISHED`)

**Response:**
```json
[
  {
    "library_id": 1,
    "user_id": 1,
    "book_id": 1,
    "status": "FAVORITE",
    "added_at": "2024-01-01T00:00:00.000Z",
    "book": {
      "book_id": 1,
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald"
    }
  }
]
```

#### `GET /user-library/:id`
Get a specific library entry.

#### `POST /user-library`
Add a book to the user's library.

**Request Body:**
```json
{
  "book_id": 1,
  "status": "FAVORITE"
}
```

**Note:** `status` must be either `"FAVORITE"` or `"FINISHED"`.

#### `DELETE /user-library/:id`
Remove a book from the user's library.

---

### Chat Logs Endpoints

All chat logs endpoints require authentication and automatically use the authenticated user's ID.

#### `GET /chat-logs`
Get all chat logs for the authenticated user.

**Response:**
```json
[
  {
    "message_id": 1,
    "user_id": 1,
    "sender": "USER",
    "message_content": "What books do you recommend?",
    "timestamp": "2024-01-01T00:00:00.000Z"
  },
  {
    "message_id": 2,
    "user_id": 1,
    "sender": "BOT",
    "message_content": "I recommend 'The Great Gatsby'...",
    "timestamp": "2024-01-01T00:00:05.000Z"
  }
]
```

#### `POST /chat-logs`
Create a new chat log entry.

**Request Body:**
```json
{
  "sender": "USER",
  "message_content": "What books do you recommend?"
}
```

**Note:** `sender` must be either `"USER"` or `"BOT"`.

---

## 🚀 Getting Started

### Prerequisites

Before you begin, make sure you have the following installed:

1. **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
2. **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
3. **npm** (comes with Node.js) or **yarn**

### Installation Steps

1. **Clone the repository** (if you haven't already):
```bash
git clone <repository-url>
cd booking-system
```

2. **Install dependencies**:
```bash
npm install
```

This installs all the packages listed in `package.json` (like `npm install` in a React project).

3. **Set up PostgreSQL database**:

   a. Create a new database:
   ```sql
   CREATE DATABASE user_management;
   ```
   
   Or using the command line:
   ```bash
   createdb user_management
   ```

4. **Create a `.env` file** in the root directory:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_DATABASE=user_management

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRES_IN=24h

# Application Configuration
PORT=8080
NODE_ENV=development

# CORS Configuration (comma-separated for multiple origins)
CORS_ORIGIN=http://localhost:5173,http://localhost:3000

# Optional: For production with SSL
# DB_SSL_CA=/path/to/ca-certificate.crt
```

**Important:** Replace `your_password_here` with your actual PostgreSQL password, and generate a secure random string for `JWT_SECRET`.

5. **Run database migrations**:
```bash
npm run db:migrate
```

This creates all the database tables based on the migration files.

6. **Seed the database** (optional - adds initial data):
```bash
npm run db:seed
```

7. **Start the development server**:
```bash
npm run start:dev
```

The server will start on `http://localhost:8080` (or the port specified in your `.env` file).

You should see:
```
Application is running on: http://localhost:8080
```

---

## 🔐 Environment Variables

Environment variables store configuration that changes between environments (development, production) or contains sensitive data (passwords, API keys).

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL server hostname | `localhost` |
| `DB_PORT` | PostgreSQL server port | `5432` |
| `DB_USER` | PostgreSQL username | `postgres` |
| `DB_PASSWORD` | PostgreSQL password | `mypassword123` |
| `DB_DATABASE` | Database name | `user_management` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `my-super-secret-key-12345` |
| `JWT_EXPIRES_IN` | Token expiration time | `24h` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `8080` |
| `NODE_ENV` | Environment mode | `development` |
| `CORS_ORIGIN` | Allowed frontend origins (comma-separated) | `http://localhost:5173` (dev) |
| `DB_SSL_CA` | Path to SSL certificate (production only) | - |

### Generating a Secure JWT Secret

You can generate a random secret using Node.js:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Or use an online generator: [https://randomkeygen.com/](https://randomkeygen.com/)

---

## 🔒 Authentication System

### How Authentication Works

1. **User Registration/Login**: User provides credentials (email/password)
2. **Password Hashing**: Password is hashed using bcrypt before storing
3. **JWT Token Generation**: On successful login, server generates a JWT token
4. **Token Storage**: Frontend stores the token (usually in localStorage or cookies)
5. **Token Validation**: On each request, frontend sends token in `Authorization` header
6. **Route Protection**: Backend validates token and allows/denies access

### JWT Token Structure

A JWT token has three parts separated by dots:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSIsInVzZXJuYW1lIjoiam9obl9kb2UifQ.signature
```

1. **Header**: Algorithm and token type
2. **Payload**: User data (user_id, email, username)
3. **Signature**: Ensures token hasn't been tampered with

### Using Authentication in Frontend

#### 1. Register/Login
```javascript
// Register
const response = await fetch('http://localhost:8080/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'john_doe',
    email: 'john@example.com',
    password: 'securePassword123'
  })
});

const data = await response.json();
const token = data.access_token;

// Store token
localStorage.setItem('token', token);
```

#### 2. Making Authenticated Requests
```javascript
const token = localStorage.getItem('token');

const response = await fetch('http://localhost:8080/books', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
});

const books = await response.json();
```

#### 3. Handling Token Expiration

If a token expires, the API will return a `401 Unauthorized` status. You should redirect the user to login:

```javascript
if (response.status === 401) {
  // Token expired or invalid
  localStorage.removeItem('token');
  // Redirect to login page
  window.location.href = '/login';
}
```

### Public vs Protected Routes

- **Public Routes**: Don't require authentication (e.g., `/auth/register`, `/auth/login`)
- **Protected Routes**: Require valid JWT token (all other routes)

The `@Public()` decorator marks routes as public, bypassing authentication.

---

## 🏃 Running the Project

### Development Mode

```bash
npm run start:dev
```

- Watches for file changes and automatically restarts
- Better error messages
- Slower startup time

### Production Mode

1. **Build the project**:
```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` folder.

2. **Start the production server**:
```bash
npm run start:prod
```

### Debug Mode

```bash
npm run start:debug
```

Allows debugging with breakpoints (useful for troubleshooting).

---

## 🗃 Database Migrations

Migrations are scripts that modify your database schema (create tables, add columns, etc.). They're version-controlled and can be run in any environment.

### Running Migrations

```bash
npm run db:migrate
```

This runs all pending migrations in order.

### Undoing Migrations

**Undo the last migration:**
```bash
npm run db:migrate:undo
```

**Undo all migrations:**
```bash
npm run db:migrate:undo:all
```

### Migration Files

Migrations are located in `src/shared/database/migrations/`. They're named with timestamps to ensure order:
- `20251207123549-create-users-table.js`
- `20251207123554-create-genres-table.js`
- etc.

### Creating a New Migration

```bash
npx sequelize-cli migration:generate --name create-my-table
```

This creates a new migration file in the migrations folder.

---

## 🏗 Architecture Overview

### NestJS Module System

NestJS uses a modular architecture. Each feature is a self-contained module:

```
Module
├── Controller (handles HTTP requests)
├── Service (business logic)
├── DTOs (data validation)
├── Entities (database models)
└── Module (ties everything together)
```

### Request Flow

```
1. HTTP Request → Controller
2. Controller → Service (business logic)
3. Service → Database (via Sequelize)
4. Database → Service (returns data)
5. Service → Controller (returns result)
6. Controller → HTTP Response (JSON)
```

### Example: Getting All Books

1. **Frontend** sends: `GET http://localhost:8080/books`
2. **AuthGuard** checks if user is authenticated
3. **BooksController** receives the request
4. **BooksController** calls `booksService.findAll()`
5. **BooksService** queries the database using Sequelize
6. **Database** returns book records
7. **BooksService** processes and returns data
8. **BooksController** sends JSON response
9. **Frontend** receives the book list

### Dependency Injection

NestJS uses dependency injection (DI) - a design pattern where dependencies are provided to classes rather than created inside them.

**Example:**
```typescript
@Controller('books')
export class BooksController {
  // NestJS automatically provides BooksService
  constructor(private readonly booksService: BooksService) {}
  
  @Get()
  findAll() {
    // Use the injected service
    return this.booksService.findAll();
  }
}
```

This makes code more testable and maintainable.

---

## 📝 Common Tasks

### Adding a New Endpoint

1. **Add method to Controller**:
```typescript
@Get('custom')
findCustom() {
  return this.booksService.findCustom();
}
```

2. **Add method to Service**:
```typescript
async findCustom() {
  return await this.bookRepository.findAll({
    where: { /* your conditions */ }
  });
}
```

### Adding a New Database Table

1. **Create a migration**:
```bash
npx sequelize-cli migration:generate --name create-my-table
```

2. **Edit the migration file** to define the table structure

3. **Run the migration**:
```bash
npm run db:migrate
```

4. **Create an Entity** (TypeScript model) in the appropriate module

5. **Add the entity to the module**:
```typescript
@Module({
  imports: [SequelizeModule.forFeature([MyEntity])],
  // ...
})
```

### Testing the API

You can test the API using:

1. **Postman** - GUI tool for API testing
2. **cURL** - Command-line tool
3. **Thunder Client** - VS Code extension
4. **Your Frontend Application**

**Example cURL commands:**

```bash
# Register
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get Books (with token)
curl -X GET http://localhost:8080/books \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Viewing API Documentation

If Swagger is configured, you can view interactive API documentation at:
```
http://localhost:8080/api
```

### Formatting Code

```bash
npm run format
```

This runs Prettier to format all TypeScript files.

### Linting Code

```bash
npm run lint
```

This runs ESLint to find and fix code quality issues.

---

## 🐛 Troubleshooting

### Database Connection Errors

**Error:** `Connection refused` or `ECONNREFUSED`

**Solutions:**
- Check if PostgreSQL is running: `pg_isready` or check services
- Verify database credentials in `.env`
- Ensure database exists: `psql -l` to list databases

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::8080`

**Solutions:**
- Change `PORT` in `.env` to a different port
- Kill the process using port 8080:
  ```bash
  # Windows
  netstat -ano | findstr :8080
  taskkill /PID <PID> /F
  
  # Mac/Linux
  lsof -ti:8080 | xargs kill
  ```

### Migration Errors

**Error:** `Migration failed` or `Table already exists`

**Solutions:**
- Check if migrations were partially run
- Undo migrations: `npm run db:migrate:undo:all`
- Manually drop tables if needed (be careful!)
- Re-run migrations: `npm run db:migrate`

### JWT Token Errors

**Error:** `Invalid or expired token`

**Solutions:**
- Check if `JWT_SECRET` in `.env` matches the one used to create the token
- Verify token hasn't expired (check `JWT_EXPIRES_IN`)
- Ensure token is sent in the correct format: `Bearer <token>`

---

## 📚 Additional Resources

### NestJS Documentation
- [Official NestJS Docs](https://docs.nestjs.com/)
- [NestJS Fundamentals Course](https://learn.nestjs.com/)

### PostgreSQL
- [PostgreSQL Tutorial](https://www.postgresql.org/docs/current/tutorial.html)
- [PostgreSQL for Beginners](https://www.postgresqltutorial.com/)

### Sequelize
- [Sequelize Documentation](https://sequelize.org/docs/v6/)
- [Sequelize Getting Started](https://sequelize.org/docs/v6/getting-started/)

### JWT
- [JWT.io](https://jwt.io/) - Decode and understand JWT tokens
- [JWT Introduction](https://jwt.io/introduction)

### REST API Best Practices
- [REST API Tutorial](https://restfulapi.net/)
- [HTTP Status Codes](https://httpstatuses.com/)

---

## 🤝 Contributing

When contributing to this project:

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Run linter: `npm run lint`
5. Format code: `npm run format`
6. Submit a pull request

---

## 📄 License

This project is private and unlicensed.

---

## 💡 Tips for Frontend Developers

1. **Start with Authentication**: Test `/auth/register` and `/auth/login` first
2. **Save the Token**: Store the JWT token securely (localStorage or httpOnly cookies)
3. **Include Token in Headers**: Always send `Authorization: Bearer <token>` for protected routes
4. **Handle Errors**: Check for 401 (unauthorized) and 403 (forbidden) status codes
5. **Use Environment Variables**: Store API base URL in your frontend `.env` file
6. **Test with Postman First**: Before integrating with your frontend, test endpoints with Postman
7. **Read Response Messages**: The API returns helpful error messages - use them!

---

## 🎓 Learning Path

If you're new to backend development, here's a suggested learning order:

1. **Understand HTTP**: Learn about GET, POST, PATCH, DELETE requests
2. **Learn REST API Concepts**: Resources, endpoints, status codes
3. **Understand Databases**: SQL basics, relationships, queries
4. **Learn TypeScript**: Type safety, interfaces, classes
5. **Explore NestJS**: Modules, controllers, services, dependency injection
6. **Practice**: Build small features, test with Postman, integrate with frontend

---

**Happy Coding! 🚀**

If you have questions or need help, don't hesitate to ask!
