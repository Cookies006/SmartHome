# SmartHome - Complete Family Management App

A comprehensive family management application built with React Native and Node.js/Express backend with PostgreSQL database.

## 📱 Project Overview

SmartHome is an application designed to help families organize their tasks, manage shopping lists, and coordinate activities together. Features include:

- **User Authentication** - Secure registration and login
- **Family Management** - Create families, manage members, invite users
- **Shopping Lists** - Collaborative shopping list management
- **Activity Tracking** - Track family activities and changes
- **Role-based Access** - Different family roles (Parent, Child, etc.)

## 🏗️ Architecture

### Frontend (React Native + Expo)
- `App.js` - Main app entry point
- `Auth.js` - Authentication screens
- `Dashboard.js` - Main dashboard
- `Courses.js` - Shopping list screen
- `Familles.js` - Family management
- `Historique.js` - Activity history
- `ThemeContext.js` - Theme management

### Backend (Node.js + Express)
- **server.js** - Main server entry point
- **config/** - Configuration files
- **controllers/** - Business logic
- **routes/** - API endpoints
- **middleware/** - Authentication & error handling
- **models/** - Database queries
- **utils/** - Validation & helpers

### Database (PostgreSQL)
- `database.sql` - Complete schema with tables:
  - users
  - families
  - family_members
  - shopping_lists
  - shopping_items
  - activity_logs
  - invite_codes

---

## 🚀 Quick Start

### Backend Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Create Database**
   ```bash
   createdb smarthome_db
   psql -d smarthome_db -f database.sql
   ```

3. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your PostgreSQL credentials
   ```

4. **Start Server**
   ```bash
   npm run dev
   ```

   Server will run at `http://localhost:3000`

### Frontend Setup

1. **Install Expo CLI**
   ```bash
   npm install -g expo-cli
   ```

2. **Start Frontend**
   ```bash
   npm start
   ```

3. **Run on Device/Emulator**
   - Press `w` for web
   - Press `a` for Android
   - Press `i` for iOS

---

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Main Endpoints

#### Authentication
```
POST   /auth/register          - Create new account
POST   /auth/login             - Login user
GET    /auth/profile           - Get user profile
PUT    /auth/profile           - Update profile
```

#### Families
```
POST   /families               - Create family
GET    /families/:id           - Get family details
POST   /families/members       - Add family member
PUT    /families/members/:id   - Update member
DELETE /families/members/:id   - Remove member
POST   /families/join          - Join family with code
```

#### Shopping
```
POST   /shopping               - Create shopping list
GET    /shopping/family/:id    - Get family lists
GET    /shopping/list/:id      - Get list items
POST   /shopping/item          - Add item
PUT    /shopping/item/:id      - Update item
DELETE /shopping/item/:id      - Delete item
```

See `API_DOCUMENTATION.md` for complete reference with examples.

---

## 📁 Project Structure

```
smarthome/
│
├── 📱 Frontend (React Native)
│   ├── App.js
│   ├── App.css
│   ├── Auth.js
│   ├── Dashboard.js
│   ├── Courses.js
│   ├── Familles.js
│   ├── Historique.js
│   ├── ThemeContext.js
│   ├── index.js
│   └── app.json
│
├── 🔧 Backend (Node.js/Express)
│   ├── server.js                    ← Main server
│   ├── package.json
│   │
│   ├── config/
│   │   └── database.js             ← PostgreSQL connection
│   │
│   ├── controllers/
│   │   ├── authController.js       ← Auth logic
│   │   ├── familyController.js     ← Family logic
│   │   └── shoppingController.js   ← Shopping logic
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── familyRoutes.js
│   │   └── shoppingRoutes.js
│   │
│   ├── middleware/
│   │   ├── auth.js                 ← JWT auth
│   │   └── errorHandler.js
│   │
│   ├── models/
│   │   ├── User.js                 ← User queries
│   │   ├── Family.js               ← Family queries
│   │   └── Shopping.js             ← Shopping queries
│   │
│   └── utils/
│       ├── validation.js           ← Input validation
│       └── activityLog.js          ← Activity logging
│
├── 🗄️ Database
│   └── database.sql                ← Schema & sample data
│
├── 📖 Documentation
│   ├── API_DOCUMENTATION.md        ← Full API reference
│   ├── BACKEND_SETUP.md            ← Detailed setup guide
│   ├── BACKEND_README.md           ← Quick start
│   └── README.md                   ← This file
│
├── ⚙️ Configuration
│   ├── .env                        ← Environment variables
│   ├── .env.example                ← Template
│   ├── .gitignore
│   └── package.json
│
└── 🧪 Testing
    └── test-api.sh                ← API test script
```

---

## 🔐 Security Features

✅ **Password Hashing** - bcryptjs encryption  
✅ **JWT Authentication** - Secure token-based auth  
✅ **Input Validation** - Joi schema validation  
✅ **Error Handling** - Secure error messages  
✅ **CORS Protection** - Configurable origins  
✅ **SQL Injection Prevention** - Parameterized queries  

---

## 🔗 Database Schema

### Tables
- **users** - User accounts and profiles
- **families** - Family groups
- **family_members** - Family membership with roles
- **shopping_lists** - Collaborative shopping lists
- **shopping_items** - Items in shopping lists
- **activity_logs** - Activity tracking
- **invite_codes** - Family invite codes

### Key Features
- Cascading deletes for data integrity
- Unique constraints to prevent duplicates
- Indexes for performance optimization
- Timestamps for all records

---

## 🛠️ Development

### Available Scripts

```bash
# Backend
npm run dev          # Development with auto-reload
npm run server       # Production server
npm install          # Install dependencies

# Frontend
npm start            # Start Expo
npm run android      # Run on Android
npm run ios          # Run on iOS
npm run web          # Run on web
```

### Environment Variables

```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smarthome_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:19006,http://localhost:3000
```

---

## 📊 Features

### User Management
- Registration with email validation
- Secure login with JWT
- Profile management
- Family selection

### Family Features
- Create and manage families
- Add family members with different roles
- Invite members with unique codes
- Member role management (Parent, Child, Aunt, Uncle, Grandparent, etc.)

### Shopping Management
- Create collaborative shopping lists
- Add/edit/delete items
- Mark items as urgent
- Check off purchased items
- Categorize items
- Activity tracking for all changes

### Activity Logging
- Track user actions
- Log item changes
- Monitor family activities
- Date/time stamping

---

## 🚨 Error Handling

API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Server Error

---

## 🧪 Testing

### Quick API Test

```bash
# Run test script (Linux/Mac)
bash test-api.sh

# Or use cURL
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"pass123"}'
```

### Using Postman

1. Import API endpoints from `API_DOCUMENTATION.md`
2. Set up authorization with Bearer token
3. Test each endpoint

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `API_DOCUMENTATION.md` | Complete API reference with examples |
| `BACKEND_SETUP.md` | Detailed setup and troubleshooting |
| `BACKEND_README.md` | Quick start guide |
| `README.md` | This file - project overview |

---

## 🐛 Troubleshooting

### Backend Issues

**Database connection error?**
- Check PostgreSQL is running
- Verify credentials in `.env`
- Ensure database schema is loaded

**Port in use?**
- Change PORT in `.env`
- Kill existing process: `lsof -i :3000`

**JWT token errors?**
- Verify token format: `Authorization: Bearer <token>`
- Check token hasn't expired
- Ensure JWT_SECRET is set

### Frontend Issues

**Expo connection error?**
- Ensure backend is running on correct port
- Update API_URL in frontend
- Check CORS settings

---

## 🔄 Workflow Example

1. **User Registration**
   ```
   POST /api/auth/register → Receive JWT token
   ```

2. **Create Family**
   ```
   POST /api/families → Create family (auto-add creator as member)
   ```

3. **Invite Members**
   ```
   GET /families/:id → Get invite code
   Share code with others
   ```

4. **Join Family**
   ```
   POST /families/join → Use invite code to join
   ```

5. **Create Shopping List**
   ```
   POST /shopping → Create list
   POST /shopping/item → Add items
   ```

6. **Manage Items**
   ```
   PUT /shopping/item/:id → Check off items
   DELETE /shopping/item/:id → Remove items
   ```

---

## 🎨 Color Scheme

- **Primary** - #2C5282 (Blue)
- **Background** - #EBF2FA (Light Blue)
- **Surface** - #FFFFFF (White)
- **Text Dark** - #121A2F (Dark Blue)
- **Text Muted** - #64748B (Gray)

---

## 📦 Dependencies

### Backend
- express - Web framework
- pg - PostgreSQL client
- bcryptjs - Password hashing
- jsonwebtoken - JWT authentication
- joi - Input validation
- dotenv - Environment management
- cors - CORS support

### Frontend
- react - UI framework
- react-native - Mobile framework
- expo - Development platform

---

## 📋 Checklist for Deployment

- [ ] Change JWT_SECRET
- [ ] Update database credentials
- [ ] Set NODE_ENV=production
- [ ] Configure CORS origins
- [ ] Set up HTTPS
- [ ] Enable database backups
- [ ] Add logging/monitoring
- [ ] Configure rate limiting
- [ ] Test all endpoints
- [ ] Update frontend API URLs

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API_DOCUMENTATION.md
3. Check BACKEND_SETUP.md
4. Review error logs

---

## 📄 License

Private - SmartHome Project

---

## 🎉 Ready to Start?

1. Follow the Quick Start guide above
2. Check BACKEND_README.md for first-time setup
3. Review API_DOCUMENTATION.md for endpoints
4. Test with the provided test script
5. Connect frontend to backend

Happy coding! 🚀
