# SmartHome Backend API Documentation

## Base URL
```
http://localhost:3000/api
```

---

## Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

**Request Body:**
```json
{
  "username": "micheal",
  "email": "micheal@example.com",
  "password": "securePassword123",
  "display_name": "Michaël"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "micheal",
    "email": "micheal@example.com",
    "display_name": "Michaël",
    "created_at": "2024-01-01T10:00:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### 2. Login User
**POST** `/auth/login`

**Request Body:**
```json
{
  "username": "micheal",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "micheal",
    "email": "micheal@example.com",
    "display_name": "Michaël",
    "active_family_id": 1
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### 3. Get User Profile
**GET** `/auth/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "username": "micheal",
    "email": "micheal@example.com",
    "display_name": "Michaël",
    "active_family_id": 1,
    "created_at": "2024-01-01T10:00:00Z"
  },
  "families": [
    {
      "id": 1,
      "name": "Famille Faye",
      "description": "Famille principale",
      "created_at": "2024-01-01T10:00:00Z"
    }
  ]
}
```

---

### 4. Update User Profile
**PUT** `/auth/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "display_name": "Michaël Faye",
  "active_family_id": 1
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "username": "micheal",
    "email": "micheal@example.com",
    "display_name": "Michaël Faye",
    "active_family_id": 1
  }
}
```

---

## Family Endpoints

### 1. Create Family
**POST** `/families`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Famille Faye",
  "description": "Famille principale"
}
```

**Response (201):**
```json
{
  "message": "Family created successfully",
  "family": {
    "id": 1,
    "name": "Famille Faye",
    "description": "Famille principale",
    "created_by_user_id": 1,
    "invite_code": "FAYE2024",
    "created_at": "2024-01-01T10:00:00Z"
  }
}
```

---

### 2. Get Family Details
**GET** `/families/:familyId`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "family": {
    "id": 1,
    "name": "Famille Faye",
    "description": "Famille principale",
    "created_by_user_id": 1,
    "invite_code": "FAYE2024",
    "created_at": "2024-01-01T10:00:00Z"
  },
  "members": [
    {
      "id": 1,
      "family_id": 1,
      "user_id": 1,
      "member_name": "Michaël",
      "role": "Parent",
      "username": "micheal",
      "email": "micheal@example.com",
      "joined_at": "2024-01-01T10:00:00Z"
    }
  ]
}
```

---

### 3. Add Family Member
**POST** `/families/members`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "family_id": 1,
  "member_name": "Fatou",
  "role": "Enfant",
  "user_id": null
}
```

**Response (201):**
```json
{
  "message": "Member added successfully",
  "member": {
    "id": 3,
    "family_id": 1,
    "user_id": null,
    "member_name": "Fatou",
    "role": "Enfant",
    "joined_at": "2024-01-01T10:00:00Z",
    "can_delete": true
  }
}
```

---

### 4. Update Family Member
**PUT** `/families/members/:memberId`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "member_name": "Fatou Faye",
  "role": "Enfant"
}
```

**Response (200):**
```json
{
  "message": "Member updated successfully",
  "member": {
    "id": 3,
    "family_id": 1,
    "member_name": "Fatou Faye",
    "role": "Enfant"
  }
}
```

---

### 5. Remove Family Member
**DELETE** `/families/members/:memberId`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Member removed successfully"
}
```

---

### 6. Join Family with Invite Code
**POST** `/families/join`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "invite_code": "FAYE2024"
}
```

**Response (201):**
```json
{
  "message": "Successfully joined family",
  "family_id": 1,
  "member": {
    "id": 4,
    "family_id": 1,
    "user_id": 2,
    "member_name": "newuser",
    "role": "Enfant",
    "joined_at": "2024-01-02T10:00:00Z"
  }
}
```

---

## Shopping List Endpoints

### 1. Create Shopping List
**POST** `/shopping`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Courses hebdomadaires",
  "family_id": 1
}
```

**Response (201):**
```json
{
  "message": "Shopping list created successfully",
  "list": {
    "id": 1,
    "family_id": 1,
    "name": "Courses hebdomadaires",
    "created_by_user_id": 1,
    "created_at": "2024-01-01T10:00:00Z"
  }
}
```

---

### 2. Get Shopping List with Items
**GET** `/shopping/list/:listId`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "list": {
    "id": 1,
    "family_id": 1,
    "name": "Courses hebdomadaires",
    "created_by_user_id": 1,
    "created_at": "2024-01-01T10:00:00Z"
  },
  "items": [
    {
      "id": 1,
      "shopping_list_id": 1,
      "icon": "🍼",
      "name": "Lait 1er âge",
      "category": "Bébé",
      "urgent": true,
      "checked": false,
      "quantity": "1L",
      "added_by_user_id": 1,
      "added_by_username": "micheal",
      "added_at": "2024-01-01T10:00:00Z"
    }
  ]
}
```

---

### 3. Get Family Shopping Lists
**GET** `/shopping/family/:familyId`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "lists": [
    {
      "id": 1,
      "family_id": 1,
      "name": "Courses hebdomadaires",
      "created_by_user_id": 1,
      "created_at": "2024-01-01T10:00:00Z"
    }
  ]
}
```

---

### 4. Update Shopping List
**PUT** `/shopping/list/:listId`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Courses du mois"
}
```

**Response (200):**
```json
{
  "message": "Shopping list updated successfully",
  "list": {
    "id": 1,
    "family_id": 1,
    "name": "Courses du mois",
    "updated_at": "2024-01-01T10:30:00Z"
  }
}
```

---

### 5. Delete Shopping List
**DELETE** `/shopping/list/:listId`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Shopping list deleted successfully"
}
```

---

### 6. Add Shopping Item
**POST** `/shopping/item`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "shopping_list_id": 1,
  "name": "Lait 1er âge",
  "icon": "🍼",
  "category": "Bébé",
  "urgent": true,
  "quantity": "1L"
}
```

**Response (201):**
```json
{
  "message": "Shopping item added successfully",
  "item": {
    "id": 1,
    "shopping_list_id": 1,
    "icon": "🍼",
    "name": "Lait 1er âge",
    "category": "Bébé",
    "urgent": true,
    "checked": false,
    "quantity": "1L",
    "added_by_user_id": 1,
    "added_at": "2024-01-01T10:00:00Z"
  }
}
```

---

### 7. Update Shopping Item
**PUT** `/shopping/item/:itemId`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Lait 1er âge",
  "checked": true,
  "bought_at": "2024-01-01T12:00:00Z"
}
```

**Response (200):**
```json
{
  "message": "Shopping item updated successfully",
  "item": {
    "id": 1,
    "shopping_list_id": 1,
    "name": "Lait 1er âge",
    "checked": true,
    "bought_at": "2024-01-01T12:00:00Z"
  }
}
```

---

### 8. Delete Shopping Item
**DELETE** `/shopping/item/:itemId`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Shopping item deleted successfully"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Username and password required"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid username or password"
}
```

### 403 Forbidden
```json
{
  "error": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "error": "User not found"
}
```

### 409 Conflict
```json
{
  "error": "Username already exists"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error"
}
```

---

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

The token is obtained from the `/auth/register` or `/auth/login` endpoints.

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding in production.

---

## CORS

CORS is enabled for the following origins (configurable in `.env`):
- http://localhost:19006 (Expo web)
- http://localhost:3000 (Frontend)

---

## Version
Backend API v1.0.0
