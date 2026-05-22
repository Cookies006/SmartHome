# SmartHome Backend - Quick Start Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Database

Create PostgreSQL database:
```bash
createdb smarthome_db
psql -d smarthome_db -f database.sql
```

### 3. Configure Environment

Copy `.env.example` to `.env` and update values:
```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials and JWT secret.

### 4. Start Server

Development:
```bash
npm run dev
```

Production:
```bash
npm run server
```

Server runs at: `http://localhost:3000`

---

## 📚 API Endpoints

### Auth
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get profile
- `PUT /api/auth/profile` - Update profile

### Families
- `POST /api/families` - Create family
- `GET /api/families/:id` - Get family
- `POST /api/families/members` - Add member
- `PUT /api/families/members/:id` - Update member
- `DELETE /api/families/members/:id` - Remove member
- `POST /api/families/join` - Join with code

### Shopping
- `POST /api/shopping` - Create list
- `GET /api/shopping/family/:familyId` - Get lists
- `GET /api/shopping/list/:id` - Get items
- `POST /api/shopping/item` - Add item
- `PUT /api/shopping/item/:id` - Update item
- `DELETE /api/shopping/item/:id` - Delete item

See `API_DOCUMENTATION.md` for complete reference.

---

## 🔐 Authentication

All protected endpoints require:
```
Authorization: Bearer <token>
```

Get token from `/api/auth/register` or `/api/auth/login`

---

## 📁 Project Structure

```
├── config/          - Database configuration
├── controllers/     - Business logic
├── middleware/      - Auth & error handling
├── models/         - Database queries
├── routes/         - API routes
├── utils/          - Helpers & validation
├── server.js       - Main server
└── database.sql    - DB schema
```

---

## 🛠️ Key Features

✅ User Authentication (JWT)  
✅ Family Management  
✅ Shopping Lists & Items  
✅ Activity Logging  
✅ CORS Support  
✅ Input Validation  
✅ Error Handling  

---

## 📖 Documentation

- **API_DOCUMENTATION.md** - Complete API reference
- **BACKEND_SETUP.md** - Detailed setup guide

---

## 🐛 Troubleshooting

**Database error?**
- Check PostgreSQL is running
- Verify DB credentials in `.env`
- Ensure database schema is loaded

**Port in use?**
- Change PORT in `.env`
- Or: `lsof -i :3000` and kill process

**CORS error?**
- Add frontend URL to CORS_ORIGIN in `.env`

---

## 📝 Notes

- Passwords are hashed with bcryptjs
- All activities are logged
- Tokens expire in 7 days (configurable)
- Change JWT_SECRET before production

Enjoy building! 🎉
