#!/usr/bin/env node

/**
 * SmartHome Backend - Quick Test & Diagnostics
 * Tests connectivity and API endpoints
 */

const http = require('http');
require('dotenv').config();

const API_URL = `http://localhost:${process.env.PORT || 3000}`;

console.log('\n🔍 SmartHome Backend - Diagnostic Test\n');
console.log('=' .repeat(50));

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

// Test result logger
function logTest(name, passed, message = '') {
  const status = passed ? `${colors.green}✅ PASS${colors.reset}` : `${colors.red}❌ FAIL${colors.reset}`;
  console.log(`\n${status} ${name}`);
  if (message) console.log(`   📝 ${message}`);
}

// Test function
function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_URL);
    url.pathname = path;

    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data ? JSON.parse(data) : null,
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data,
          });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

// Tests
async function runTests() {
  console.log(`\n📡 Testing API: ${API_URL}\n`);

  // ===== Test 1: Health Check =====
  try {
    const health = await makeRequest('GET', '/health');
    logTest('Health Check', health.statusCode === 200, `Status: ${health.statusCode}`);
    if (health.statusCode === 200) {
      console.log(`   Environment: ${health.body.environment}`);
    }
  } catch (error) {
    logTest('Health Check', false, `Error: ${error.message} - Server not running?`);
  }

  // ===== Test 2: Environment Variables =====
  console.log('\n' + '=' .repeat(50));
  console.log('\n🔐 Environment Configuration:\n');

  const envVars = ['PORT', 'NODE_ENV', 'DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER'];
  const missingVars = [];

  envVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`   ✓ ${varName}: ${varName === 'DB_PASSWORD' ? '***' : value}`);
    } else {
      console.log(`   ✗ ${varName}: ${colors.red}NOT SET${colors.reset}`);
      missingVars.push(varName);
    }
  });

  if (process.env.JWT_SECRET) {
    console.log(`   ✓ JWT_SECRET: ${process.env.JWT_SECRET.substring(0, 10)}...`);
  } else {
    console.log(`   ✗ JWT_SECRET: ${colors.red}NOT SET${colors.reset}`);
    missingVars.push('JWT_SECRET');
  }

  logTest('Environment Variables', missingVars.length === 0, 
    missingVars.length > 0 ? `Missing: ${missingVars.join(', ')}` : 'All variables set'
  );

  // ===== Test 3: Registration Endpoint =====
  console.log('\n' + '=' .repeat(50));
  console.log('\n🧪 API Endpoints Test:\n');

  const testUser = {
    username: 'testuser_' + Date.now(),
    email: `test_${Date.now()}@example.com`,
    password: 'testpass123',
    confirmPassword: 'testpass123',
    display_name: 'Test User',
  };

  let registrationSuccess = false;
  let authToken = null;

  try {
    const register = await makeRequest('POST', '/api/auth/register', testUser);
    registrationSuccess = register.statusCode === 201;
    logTest('User Registration', registrationSuccess, `Status: ${register.statusCode}`);

    if (registrationSuccess && register.body.token) {
      authToken = register.body.token;
      console.log(`   User ID: ${register.body.user.id}`);
      console.log(`   Token: ${register.body.token.substring(0, 20)}...`);
    } else if (register.statusCode >= 400) {
      console.log(`   Error: ${register.body.error}`);
    }
  } catch (error) {
    logTest('User Registration', false, error.message);
  }

  // ===== Test 4: Login Endpoint =====
  try {
    const login = await makeRequest('POST', '/api/auth/login', {
      username: testUser.username,
      password: testUser.password,
    });

    const loginSuccess = login.statusCode === 200;
    logTest('User Login', loginSuccess, `Status: ${login.statusCode}`);

    if (loginSuccess && login.body.token) {
      authToken = login.body.token;
      console.log(`   Token: ${login.body.token.substring(0, 20)}...`);
    } else if (login.statusCode >= 400) {
      console.log(`   Error: ${login.body.error}`);
    }
  } catch (error) {
    logTest('User Login', false, error.message);
  }

  // ===== Test 5: Protected Route (Profile) =====
  if (authToken) {
    try {
      const profileReq = http.request(
        `${API_URL}/api/auth/profile`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        },
        (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            try {
              const body = JSON.parse(data);
              logTest('Protected Route (Profile)', res.statusCode === 200, `Status: ${res.statusCode}`);
              if (res.statusCode === 200) {
                console.log(`   User: ${body.user.username}`);
              } else {
                console.log(`   Error: ${body.error}`);
              }
            } catch (e) {
              logTest('Protected Route (Profile)', false, 'Invalid response');
            }
          });
        }
      );

      profileReq.on('error', (error) => {
        logTest('Protected Route (Profile)', false, error.message);
      });

      profileReq.end();
    } catch (error) {
      logTest('Protected Route (Profile)', false, error.message);
    }
  }

  // ===== Test 6: Invalid Route =====
  try {
    const notFound = await makeRequest('GET', '/invalid-route');
    logTest('404 Handling', notFound.statusCode === 404, `Status: ${notFound.statusCode}`);
  } catch (error) {
    logTest('404 Handling', false, error.message);
  }

  // ===== Summary =====
  console.log('\n' + '=' .repeat(50));
  console.log('\n✅ Diagnostic Test Complete\n');
  console.log('📝 Next Steps:');
  console.log('   1. Check any FAILED tests above');
  console.log('   2. Review the STARTUP_GUIDE.md for solutions');
  console.log('   3. Ensure PostgreSQL is running');
  console.log('   4. Verify .env file has correct settings\n');
}

// Run tests
runTests().catch(console.error);
