# SmartHome Backend - Setup Guide

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

#### Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE smarthome_db;

# Exit psql
\q
```

#### Run Database Schema

```bash
# Load the database schema
psql -U postgres -d smarthome_db -f database.sql
```

### 3. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Backend Configuration
PORT=3000
NODE_ENV=development

# PostgreSQL Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smarthome_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Secret (change this in production)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# CORS Origins
CORS_ORIGIN=http://localhost:19006,http://localhost:3000
```

### 4. Start the Backend Server

#### Development Mode (with auto-reload)

```bash
npm run dev
```

#### Production Mode

```bash
npm run server
```

The server will start on `http://localhost:3000`

## Project Structure

```
smarthome/
├── config/
│   └── database.js           # PostgreSQL connection
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── familyController.js   # Family management
│   └── shoppingController.js # Shopping lists
├── middleware/
│   ├── auth.js              # JWT authentication
│   └── errorHandler.js      # Error handling
├── models/
│   ├── User.js              # User queries
│   ├── Family.js            # Family queries
│   └── Shopping.js          # Shopping queries
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   ├── familyRoutes.js      # Family endpoints
│   └── shoppingRoutes.js    # Shopping endpoints
├── utils/
│   ├── validation.js        # Input validation
│   └── activityLog.js       # Activity logging
├── server.js                # Main server file
├── package.json             # Dependencies
├── database.sql             # Database schema
├── .env                     # Environment variables
└── API_DOCUMENTATION.md     # API documentation
```

## API Endpoints Overview

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Families
- `POST /api/families` - Create family
- `GET /api/families/:familyId` - Get family details
- `POST /api/families/members` - Add member
- `PUT /api/families/members/:memberId` - Update member
- `DELETE /api/families/members/:memberId` - Remove member
- `POST /api/families/join` - Join family with code

### Shopping
- `POST /api/shopping` - Create list
- `GET /api/shopping/list/:listId` - Get list with items
- `GET /api/shopping/family/:familyId` - Get all lists
- `PUT /api/shopping/list/:listId` - Update list
- `DELETE /api/shopping/list/:listId` - Delete list
- `POST /api/shopping/item` - Add item
- `PUT /api/shopping/item/:itemId` - Update item
- `DELETE /api/shopping/item/:itemId` - Delete item

## Testing the API

### Using cURL

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"micheal","email":"micheal@example.com","password":"password123","display_name":"Michaël"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"micheal","password":"password123"}'
```

### Using Postman

1. Import the API endpoints
2. Set Authorization header with Bearer token
3. Test each endpoint

## Development Notes

- All protected endpoints require JWT authentication
- Passwords are hashed using bcryptjs
- Activity logs are automatically created for major actions
- CORS is enabled for specified origins
- Error handling includes validation and database error messages

## Production Deployment

Before deploying to production:

1. Change `JWT_SECRET` to a strong random string
2. Set `NODE_ENV=production`
3. Use a PostgreSQL managed service (e.g., AWS RDS, Heroku Postgres)
4. Enable HTTPS
5. Add rate limiting middleware
6. Set up logging and monitoring
7. Use environment-specific `.env` files
8. Add database backups

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Verify DB_HOST, DB_PORT, DB_USER, DB_PASSWORD in `.env`
- Check database exists: `psql -U postgres -l`

### JWT Token Errors
- Ensure JWT_SECRET is set in `.env`
- Verify token format: `Bearer <token>`
- Check token expiration

### CORS Issues
- Update CORS_ORIGIN in `.env`
- Ensure frontend origin is in the list

### Port Already in Use
- Change PORT in `.env`
- Or: `lsof -i :3000` and kill the process

## Additional Resources

- See `API_DOCUMENTATION.md` for complete API reference
- Check `database.sql` for schema details
- Review controllers for business logic

## License

Private - SmartHome Project
