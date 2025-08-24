# Task Management API

A robust RESTful API for managing tasks with user authentication, built with Node.js, TypeScript, Express, and PostgreSQL.

## Features

- User registration and authentication (JWT)
- Task CRUD operations
- Task status management (pending, in_progress, done)
- Pagination for task listing
- Input validation
- Secure password hashing
- Refresh token mechanism

## Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)
- PostgreSQL (v12 or higher)
- Git

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/mirgalmanthan/Multi-User-Task-Managment-API.git
cd Multi-User-Task-Managment-API
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your configuration:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=taskmanager
   DB_USER=postgres
   DB_PASSWORD=your_password
   
   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=1h
   REFRESH_TOKEN_EXPIRES_IN=7d
   
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # Task Configuration
   TASKS_PER_PAGE=10
   ```

### 4. Database Setup

1. Create a new PostgreSQL database:
   ```sql
   CREATE DATABASE taskmanager;
   ```

2. Run database migrations:
   The following migrations will be executed in order:
   - `20250824000000-create-users.js`: Creates the users table with authentication fields
   - `20250824000001-create-tasks.js`: Creates the tasks table with foreign key to users

   Run the migrations with:
   ```bash
   npx sequelize-cli db:migrate
   ```
   
   To undo the last migration (if needed):
   ```bash
   npx sequelize-cli db:migrate:undo
   ```

### 5. Start the Server

- For development (with hot-reload):
  ```bash
  npm run dev
  ```

- For production:
  ```bash
  npm run build
  npm run prod
  ```

The API will be available at `http://localhost:3000`

## API Documentation

### Authentication

#### Register a new user
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### Tasks

#### Get all tasks (with pagination)
```http
GET /api/tasks?offset=0&limit=10
Authorization: Bearer <access_token>
```

#### Create a new task
```http
POST /api/tasks
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the task management API",
  "status": "in_progress"
}
```

#### Update a task
```http
PUT /api/tasks/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "status": "done"
}
```

#### Delete a task
```http
DELETE /api/tasks/:id
Authorization: Bearer <access_token>
```

## Project Structure

```
src/
├── controllers/       # Request handlers
├── db/               # Database models and connections
├── middlewares/      # Custom middleware functions
├── routers/          # Route definitions
├── structs/          # Type definitions and interfaces
└── utils/            # Utility functions
```

## Environment Variables

- `DB_HOST`: Database host (default: localhost)
- `DB_PORT`: Database port (default: 5432)
- `DB_NAME`: Database name
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `JWT_SECRET`: Secret key for JWT
- `JWT_EXPIRES_IN`: JWT expiration time (default: 1h)
- `REFRESH_TOKEN_EXPIRES_IN`: Refresh token expiration time (default: 7d)
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `TASKS_PER_PAGE`: Number of tasks per page (default: 10)



## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository.
