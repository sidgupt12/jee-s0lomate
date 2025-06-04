# Chapter Performance Dashboard API

A RESTful API-based backend for a Chapter Performance Dashboard built with Node.js, Express.js, MongoDB, and Redis.

## Tech Stack

- Node.js
- Express.js
- MongoDB (with mongoose)
- Redis (for caching & rate-limiting)

## Features

- RESTful API endpoints for chapter management
- Redis caching for improved performance
- Rate limiting (30 requests/minute per IP)
- Pagination support
- Admin-only chapter upload functionality
- Comprehensive filtering options
- User authentication and authorization

### API Endpoints

#### Authentication

##### POST `/api/v1/auth/register`
Register a new user.

Request Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "your_password",
  "role": "user" // or "admin"
}
```

##### POST `/api/v1/auth/login`
Login user and get JWT token.

Request Body:
```json
{
  "email": "john@example.com",
  "password": "your_password"
}
```

Response:
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Chapter Management

##### GET `/api/v1/chapters`
Returns all chapters with filtering and pagination support.

Query Parameters:
- `class`: Filter by class
- `unit`: Filter by unit
- `status`: Filter by status
- `weakChapters`: Filter by weak chapters
- `subject`: Filter by subject
- `page`: Page number for pagination
- `limit`: Number of items per page

##### GET `/api/v1/chapters/:id`
Returns a specific chapter by ID.

##### POST `/api/v1/chapters`
Upload chapters to the database (Admin only).
- Accepts JSON file upload
- Validates chapter schema
- Returns failed uploads if any

### Caching

- Redis cache implementation for `/api/v1/chapters` endpoint
- Cache duration: 1 hour
- Automatic cache invalidation on new chapter upload

### Rate Limiting

- 30 requests per minute per IP address
- Implemented using Redis
- Applies to all routes

## Installation

```bash
# Clone the repository
git clone https://github.com/sidgupt12/jee-s0lomate

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Start the server
npm start
```

## Environment Variables

Create a `.env` file with the following variables:

```env
PORT=3000
MONGODB_URI=your_mongodb_uri
REDIS_URL=your_redis_url
JWT_SECRET=your_jwt_secret
```

## API Documentation & Testing

For detailed API documentation and testing, please refer to the Postman collection:
[Postman Collection](https://www.postman.com/sinners-2106/workspace/solomate-public/request/39945266-0b7a7954-e00f-4200-870e-7f0706bf0baa?action=share&creator=39945266&ctx=documentation)

## Deployment

The application is deployed on AWS Elastic Beanstalk and can be accessed at:
[Live API](http://s0lomate-mathongo-env.eba-cupm4egm.ap-south-1.elasticbeanstalk.com/)

## Requirements

- Node.js 16+
- MongoDB
- Redis
- npm or yarn
