# Backend Requirements for Travel Rewards App

## Overview
This document outlines the complete backend requirements for the Travel Rewards mobile application. The backend must provide a RESTful API that serves daily reward data to the mobile clients.

---

## Table of Contents
1. [API Endpoints](#api-endpoints)
2. [Data Models](#data-models)
3. [Response Formats](#response-formats)
4. [Database Schema](#database-schema)
5. [Business Logic](#business-logic)
6. [Error Handling](#error-handling)
7. [Security & CORS](#security--cors)
8. [Deployment Considerations](#deployment-considerations)

---

## API Endpoints

### 1. Get Rewards List
**Endpoint:** `GET /api/rewards`

**Purpose:** Fetch all available rewards grouped by date (Today, Yesterday, This Week, etc.)

**Request:**
- Method: GET
- Headers: None required (can add API key if needed)
- Query Parameters: None
- Body: None

**Response (Success - 200 OK):**
```json
{
  "success": true,
  "message": "Next update in 18 hours",
  "data": [
    {
      "title": "Today",
      "data": [
        {
          "id": "reward_001",
          "label": "50 Energy",
          "icon": "energy",
          "code": "ENERGY50",
          "expired": false,
          "expiresAt": "2026-02-09T23:59:59Z"
        },
        {
          "id": "reward_002",
          "label": "1000 Coins",
          "icon": "coins",
          "code": "COINS1K",
          "expired": false,
          "expiresAt": "2026-02-09T23:59:59Z"
        }
      ]
    },
    {
      "title": "Yesterday",
      "data": [
        {
          "id": "reward_003",
          "label": "100 Gems",
          "icon": "gems",
          "code": "GEMS100",
          "expired": false,
          "expiresAt": "2026-02-08T23:59:59Z"
        }
      ]
    },
    {
      "title": "This Week",
      "data": [
        {
          "id": "reward_004",
          "label": "200 Energy",
          "icon": "energy",
          "code": "ENERGY200",
          "expired": false,
          "expiresAt": "2026-02-15T23:59:59Z"
        }
      ]
    },
    {
      "title": "Older",
      "data": [
        {
          "id": "reward_005",
          "label": "500 Coins",
          "icon": "coins",
          "code": "COINS500",
          "expired": true,
          "expiresAt": "2026-01-31T23:59:59Z"
        }
      ]
    }
  ]
}
```

**Response (Error - 500 Internal Server Error):**
```json
{
  "success": false,
  "error": "Failed to fetch rewards",
  "message": "Internal server error"
}
```

**Response (Error - 503 Service Unavailable):**
```json
{
  "success": false,
  "error": "Service temporarily unavailable",
  "message": "Please try again later"
}
```

---

## Data Models

### Reward Model
```typescript
interface Reward {
  id: string;              // Unique identifier (e.g., "reward_001")
  label: string;           // Display label (e.g., "50 Energy")
  icon: "energy" | "coins" | "gems";  // Icon type
  code: string;            // Redemption code (e.g., "ENERGY50")
  expired: boolean;        // Whether the reward has expired
  expiresAt: string;       // ISO 8601 date string
  createdAt?: string;      // Optional: Creation timestamp
}
```

### RewardSection Model
```typescript
interface RewardSection {
  title: string;           // Section title: "Today", "Yesterday", "This Week", "Older"
  data: Reward[];          // Array of rewards in this section
}
```

### API Response Model
```typescript
interface ApiResponse {
  success: boolean;        // Whether the request was successful
  message?: string;        // Optional message (e.g., "Next update in 18 hours")
  data?: RewardSection[];  // Array of reward sections (if success)
  error?: string;          // Error message (if not success)
}
```

---

## Database Schema

### Rewards Table
```sql
CREATE TABLE rewards (
  id VARCHAR(255) PRIMARY KEY,
  label VARCHAR(255) NOT NULL,
  icon ENUM('energy', 'coins', 'gems') NOT NULL,
  code VARCHAR(50) NOT NULL UNIQUE,
  expired BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_expires_at (expires_at),
  INDEX idx_expired (expired),
  INDEX idx_created_at (created_at)
);
```

### Example Data
```sql
INSERT INTO rewards (id, label, icon, code, expired, expires_at) VALUES
  ('reward_001', '50 Energy', 'energy', 'ENERGY50', false, '2026-02-09 23:59:59'),
  ('reward_002', '1000 Coins', 'coins', 'COINS1K', false, '2026-02-09 23:59:59'),
  ('reward_003', '100 Gems', 'gems', 'GEMS100', false, '2026-02-08 23:59:59'),
  ('reward_004', '200 Energy', 'energy', 'ENERGY200', false, '2026-02-15 23:59:59'),
  ('reward_005', '500 Coins', 'coins', 'COINS500', true, '2026-01-31 23:59:59');
```

---

## Business Logic

### 1. Reward Grouping Algorithm
When the `/api/rewards` endpoint is called, the backend must:

1. **Fetch all rewards** from the database ordered by `created_at DESC`
2. **Update expired status**: Mark rewards as expired if `expires_at < NOW()`
3. **Group rewards by date category**:
   - **Today**: Rewards where `DATE(created_at) = CURDATE()`
   - **Yesterday**: Rewards where `DATE(created_at) = CURDATE() - 1`
   - **This Week**: Rewards where `created_at >= start of current week AND created_at < today`
   - **Older**: Rewards where `created_at < start of current week`

4. **Calculate next update message**:
   - Find the time until midnight (next day)
   - Return message like "Next update in X hours"

### 2. Expired Reward Logic
```javascript
// Pseudo-code for expiration check
function checkExpiration(reward) {
  const now = new Date();
  const expiresAt = new Date(reward.expires_at);
  
  if (expiresAt < now && !reward.expired) {
    // Update the reward as expired
    updateReward(reward.id, { expired: true });
  }
  
  return expiresAt < now;
}
```

### 3. Section Grouping Logic
```javascript
// Pseudo-code for grouping
function groupRewardsBySections(rewards) {
  const today = [];
  const yesterday = [];
  const thisWeek = [];
  const older = [];
  
  const now = new Date();
  const startOfToday = new Date(now.setHours(0, 0, 0, 0));
  const startOfYesterday = new Date(startOfToday - 86400000);
  const startOfWeek = getStartOfWeek(now);
  
  rewards.forEach(reward => {
    const createdDate = new Date(reward.created_at);
    
    if (createdDate >= startOfToday) {
      today.push(reward);
    } else if (createdDate >= startOfYesterday) {
      yesterday.push(reward);
    } else if (createdDate >= startOfWeek) {
      thisWeek.push(reward);
    } else {
      older.push(reward);
    }
  });
  
  const sections = [];
  if (today.length > 0) sections.push({ title: "Today", data: today });
  if (yesterday.length > 0) sections.push({ title: "Yesterday", data: yesterday });
  if (thisWeek.length > 0) sections.push({ title: "This Week", data: thisWeek });
  if (older.length > 0) sections.push({ title: "Older", data: older });
  
  return sections;
}
```

### 4. Next Update Calculation
```javascript
// Pseudo-code for next update message
function calculateNextUpdate() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const hoursUntilUpdate = Math.ceil((tomorrow - now) / (1000 * 60 * 60));
  
  return `Next update in ${hoursUntilUpdate} hours`;
}
```

---

## Error Handling

### Error Response Format
All errors should follow this structure:
```json
{
  "success": false,
  "error": "Error type or message",
  "message": "User-friendly error description"
}
```

### HTTP Status Codes
- **200 OK**: Successful request with data
- **400 Bad Request**: Invalid request parameters
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side error
- **503 Service Unavailable**: Service temporarily down

### Error Scenarios
1. **Database connection failure**:
   ```json
   {
     "success": false,
     "error": "Database connection failed",
     "message": "Unable to connect to database. Please try again later."
   }
   ```

2. **No rewards available**:
   ```json
   {
     "success": true,
     "message": "No rewards available at this time",
     "data": []
   }
   ```

3. **Invalid request**:
   ```json
   {
     "success": false,
     "error": "Invalid request",
     "message": "The request could not be processed"
   }
   ```

---

## Security & CORS

### CORS Configuration
The backend must allow requests from mobile apps:

```javascript
// Express.js example
app.use(cors({
  origin: '*',  // Allow all origins (mobile apps)
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Optional: API Key Authentication
If you want to add basic security:

```javascript
// Middleware example
function authenticateAPIKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Invalid or missing API key'
    });
  }
  
  next();
}
```

### Rate Limiting (Optional)
Implement rate limiting to prevent abuse:

```javascript
// Example using express-rate-limit
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests',
    message: 'Please try again later'
  }
});

app.use('/api/rewards', limiter);
```

---

## Deployment Considerations

### Environment Variables
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=travel_rewards
DB_USER=root
DB_PASSWORD=your_password

# Server
PORT=3000
NODE_ENV=production

# Optional: API Key
API_KEY=your_secret_api_key

# CORS
ALLOWED_ORIGINS=*
```

### Recommended Tech Stack
- **Runtime**: Node.js 18+ or Python 3.9+
- **Framework**: Express.js, Fastify, Flask, or Django
- **Database**: MySQL, PostgreSQL, or MongoDB
- **Hosting**: AWS, Google Cloud, Heroku, or Railway

### Example Implementation (Node.js + Express)
```javascript
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// GET /api/rewards endpoint
app.get('/api/rewards', async (req, res) => {
  try {
    // Fetch rewards from database
    const [rows] = await pool.query(
      'SELECT * FROM rewards ORDER BY created_at DESC'
    );
    
    // Update expired rewards
    const now = new Date();
    rows.forEach(reward => {
      reward.expired = new Date(reward.expiresAt) < now;
    });
    
    // Group rewards by sections
    const sections = groupRewardsBySections(rows);
    
    // Calculate next update message
    const message = calculateNextUpdate();
    
    // Send response
    res.json({
      success: true,
      message: message,
      data: sections
    });
  } catch (error) {
    console.error('Error fetching rewards:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch rewards',
      message: 'Internal server error'
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## Testing the API

### Manual Testing with cURL
```bash
# Test GET /api/rewards
curl -X GET http://localhost:3000/api/rewards

# With API key (if implemented)
curl -X GET http://localhost:3000/api/rewards \
  -H "X-API-Key: your_api_key"
```

### Expected Response Time
- **Target**: < 200ms for /api/rewards endpoint
- **Maximum acceptable**: < 1000ms

### Load Testing Recommendations
- Test with 100+ concurrent users
- Ensure database queries are optimized with indexes
- Consider caching strategies for frequently accessed data

---

## API Endpoint Configuration in Mobile App

After deploying the backend, update the mobile app configuration:

**File**: `src/core/constants/config.ts`

```typescript
export const APP_CONFIG = {
  // ... other config
  API_BASE_URL: 'https://your-backend-url.com/api',  // Update this
  API_TIMEOUT: 10000,
  // ... other config
};
```

---

## Summary Checklist

- [ ] Set up database with `rewards` table
- [ ] Implement `GET /api/rewards` endpoint
- [ ] Add reward grouping logic (Today, Yesterday, This Week, Older)
- [ ] Implement expired reward checking
- [ ] Add next update calculation
- [ ] Configure CORS to allow mobile app requests
- [ ] Add error handling for all failure scenarios
- [ ] Set up environment variables
- [ ] Deploy backend to hosting service
- [ ] Update mobile app with production API URL
- [ ] Test API endpoint with real data
- [ ] Monitor API performance and errors

---

## Support & Maintenance

### Cron Jobs (Optional)
Set up a daily cron job to:
1. Auto-expire old rewards
2. Generate new daily rewards
3. Clean up very old expired rewards (> 30 days)

```javascript
// Example cron job (runs daily at midnight)
const cron = require('node-cron');

cron.schedule('0 0 * * *', async () => {
  // Mark expired rewards
  await pool.query(
    'UPDATE rewards SET expired = TRUE WHERE expires_at < NOW() AND expired = FALSE'
  );
  
  // Generate new daily rewards (your custom logic)
  await generateDailyRewards();
  
  console.log('Daily maintenance completed');
});
```

---

## Questions or Issues?
If you encounter any issues implementing the backend, refer to:
1. This documentation
2. The mobile app source code in `src/core/api/rewards.ts`
3. The mock API implementation in `src/core/api/mockRewards.ts`

The mobile app currently uses mock data. Once the real backend is deployed, simply update the `API_BASE_URL` in the config file to switch to the production API.
