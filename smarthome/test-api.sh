#!/bin/bash

# SmartHome Backend - Quick Test Script
# This script tests basic API endpoints

BASE_URL="http://localhost:3000/api"
TOKEN=""

echo "🧪 SmartHome Backend API Tests"
echo "================================"
echo ""

# Test 1: Register
echo "1️⃣ Testing User Registration..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPassword123",
    "display_name": "Test User"
  }')

echo "$REGISTER_RESPONSE" | grep -q "token"
if [ $? -eq 0 ]; then
  echo "✅ Registration successful"
  TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
  echo "Token: $TOKEN"
else
  echo "❌ Registration failed"
  echo "$REGISTER_RESPONSE"
  exit 1
fi

echo ""

# Test 2: Login
echo "2️⃣ Testing User Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "TestPassword123"
  }')

echo "$LOGIN_RESPONSE" | grep -q "Login successful"
if [ $? -eq 0 ]; then
  echo "✅ Login successful"
  TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
else
  echo "❌ Login failed"
  echo "$LOGIN_RESPONSE"
fi

echo ""

# Test 3: Get Profile
echo "3️⃣ Testing Get Profile..."
PROFILE_RESPONSE=$(curl -s -X GET "$BASE_URL/auth/profile" \
  -H "Authorization: Bearer $TOKEN")

echo "$PROFILE_RESPONSE" | grep -q "username"
if [ $? -eq 0 ]; then
  echo "✅ Profile retrieved successfully"
else
  echo "❌ Get profile failed"
  echo "$PROFILE_RESPONSE"
fi

echo ""

# Test 4: Create Family
echo "4️⃣ Testing Create Family..."
FAMILY_RESPONSE=$(curl -s -X POST "$BASE_URL/families" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Test Family",
    "description": "Test family for API testing"
  }')

echo "$FAMILY_RESPONSE" | grep -q "family"
if [ $? -eq 0 ]; then
  echo "✅ Family created successfully"
  FAMILY_ID=$(echo "$FAMILY_RESPONSE" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
  echo "Family ID: $FAMILY_ID"
else
  echo "❌ Create family failed"
  echo "$FAMILY_RESPONSE"
fi

echo ""

# Test 5: Health Check
echo "5️⃣ Testing Health Check..."
HEALTH_RESPONSE=$(curl -s -X GET "http://localhost:3000/health")

echo "$HEALTH_RESPONSE" | grep -q "running"
if [ $? -eq 0 ]; then
  echo "✅ Server is healthy"
else
  echo "❌ Health check failed"
  echo "$HEALTH_RESPONSE"
fi

echo ""
echo "================================"
echo "✨ Tests completed!"
