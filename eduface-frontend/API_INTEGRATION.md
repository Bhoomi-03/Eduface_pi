# 📡 EduFace Backend Integration Guide

This guide explains how to build the backend API that works with the EduFace frontend.

---

## 🔄 Authentication Flow

### 1. User Registration
**Endpoint:** `POST /api/auth/register`

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@school.com",
  "password": "securePassword123",
  "role": "faculty"
}
```

**Response (Success - 201):**
```json
{
  "message": "User created successfully"
}
```

**Response (Error - 400):**
```json
{
  "message": "Email already exists"
}
```

### 2. User Login
**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "john@school.com",
  "password": "securePassword123"
}
```

**Response (Success - 200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "faculty",
  "userId": "507f1f77bcf86cd799439011",
  "userName": "John Doe"
}
```

**Response (Error - 401):**
```json
{
  "message": "Invalid email or password"
}
```

---

## 👥 Student Management Endpoints

### Get All Students
**Endpoint:** `GET /api/students`  
**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Alice Smith",
    "email": "alice@school.com",
    "rollNumber": "CSE001",
    "class": "10-A"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Bob Johnson",
    "email": "bob@school.com",
    "rollNumber": "CSE002",
    "class": "10-A"
  }
]
```

### Add Student
**Endpoint:** `POST /api/students`  
**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "name": "Charlie Brown",
  "email": "charlie@school.com",
  "rollNumber": "CSE003",
  "class": "10-B"
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "name": "Charlie Brown",
  "email": "charlie@school.com",
  "rollNumber": "CSE003",
  "class": "10-B"
}
```

### Update Student
**Endpoint:** `PUT /api/students/:id`  
**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "name": "Charlie Brown",
  "email": "charlie.brown@school.com",
  "rollNumber": "CSE003",
  "class": "10-B"
}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "name": "Charlie Brown",
  "email": "charlie.brown@school.com",
  "rollNumber": "CSE003",
  "class": "10-B"
}
```

### Delete Student
**Endpoint:** `DELETE /api/students/:id`  
**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
{
  "message": "Student deleted successfully"
}
```

---

## 📋 Attendance Endpoints

### Get Attendance Records
**Endpoint:** `GET /api/attendance?date=2024-11-12`  
**Headers:** `Authorization: Bearer {token}`

**Response (200):**
```json
[
  {
    "_id": "607f1f77bcf86cd799439011",
    "studentId": "507f1f77bcf86cd799439011",
    "studentName": "Alice Smith",
    "rollNumber": "CSE001",
    "date": "2024-11-12",
    "status": "present",
    "time": "09:15 AM"
  },
  {
    "_id": "607f1f77bcf86cd799439012",
    "studentId": "507f1f77bcf86cd799439012",
    "studentName": "Bob Johnson",
    "rollNumber": "CSE002",
    "date": "2024-11-12",
    "status": "absent",
    "time": null
  }
]
```

### Mark Attendance
**Endpoint:** `POST /api/attendance`  
**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "studentId": "507f1f77bcf86cd799439011",
  "date": "2024-11-12",
  "status": "present"
}
```

**Response (201):**
```json
{
  "_id": "607f1f77bcf86cd799439013",
  "studentId": "507f1f77bcf86cd799439011",
  "date": "2024-11-12",
  "status": "present",
  "timestamp": "2024-11-12T09:15:00Z"
}
```

---

## 🔐 Door Control Endpoints

### Open/Close Door
**Endpoint:** `POST /api/door/open`  
**Headers:** `Authorization: Bearer {token}` (Security role only)

**Request:**
```json
{
  "action": "open"
}
```

**Response (200):**
```json
{
  "status": "opened",
  "timestamp": "2024-11-12T09:15:00Z",
  "triggeredBy": "507f1f77bcf86cd799439050"
}
```

**Alternative Request:**
```json
{
  "action": "close"
}
```

**Response (200):**
```json
{
  "status": "locked",
  "timestamp": "2024-11-12T09:20:00Z",
  "triggeredBy": "507f1f77bcf86cd799439050"
}
```

---

## 🚨 Security Alerts Endpoints

### Get All Alerts
**Endpoint:** `GET /api/alerts`  
**Headers:** `Authorization: Bearer {token}` (Security role only)

**Query Parameters (Optional):**
- `?severity=high` - Filter by severity
- `?type=unauthorized_entry` - Filter by type
- `?limit=10` - Limit results

**Response (200):**
```json
[
  {
    "_id": "707f1f77bcf86cd799439011",
    "type": "unauthorized_entry",
    "description": "Unknown face detected at entrance",
    "location": "Main Gate",
    "severity": "high",
    "timestamp": "2024-11-12T08:45:00Z",
    "status": "open"
  },
  {
    "_id": "707f1f77bcf86cd799439012",
    "type": "door_forced",
    "description": "Door opened forcefully",
    "location": "Back Door",
    "severity": "critical",
    "timestamp": "2024-11-12T07:30:00Z",
    "status": "investigating"
  },
  {
    "_id": "707f1f77bcf86cd799439013",
    "type": "suspicious_activity",
    "description": "Multiple failed access attempts (5x)",
    "location": "Lab Block",
    "severity": "high",
    "timestamp": "2024-11-12T06:15:00Z",
    "status": "resolved"
  }
]
```

### Create Alert
**Endpoint:** `POST /api/alerts`  
**Headers:** `Authorization: Bearer {token}`

**Request:**
```json
{
  "type": "unauthorized_entry",
  "description": "Unknown person at entrance",
  "location": "Main Gate",
  "severity": "high"
}
```

**Response (201):**
```json
{
  "_id": "707f1f77bcf86cd799439014",
  "type": "unauthorized_entry",
  "description": "Unknown person at entrance",
  "location": "Main Gate",
  "severity": "high",
  "timestamp": "2024-11-12T09:00:00Z",
  "status": "open"
}
```

---

## 🔒 Authentication & Authorization

### JWT Token Structure
```
Header: Authorization: Bearer <token>
```

### Token Verification
- Decode JWT
- Check expiration
- Validate user role against endpoint requirements

### Role-Based Access
| Endpoint | Admin | Faculty | Security |
|----------|-------|---------|----------|
| GET /students | ✅ | ❌ | ❌ |
| POST /students | ✅ | ❌ | ❌ |
| PUT /students | ✅ | ❌ | ❌ |
| DELETE /students | ✅ | ❌ | ❌ |
| GET /attendance | ✅ | ✅ | ❌ |
| POST /attendance | ✅ | ✅ | ❌ |
| POST /door/open | ❌ | ❌ | ✅ |
| GET /alerts | ❌ | ❌ | ✅ |

---

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "message": "Invalid request data",
  "errors": {
    "email": "Email is required"
  }
}
```

### 401 Unauthorized
```json
{
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied. Admin role required."
}
```

### 404 Not Found
```json
{
  "message": "Student not found"
}
```

### 500 Server Error
```json
{
  "message": "Internal server error"
}
```

---

## 🛠️ Implementation Checklist

### Authentication
- [ ] JWT token generation (sign with secret key)
- [ ] Password hashing (bcrypt)
- [ ] Token verification middleware
- [ ] Refresh token strategy (optional)
- [ ] Rate limiting on auth endpoints

### User Management
- [ ] Create user model with schema
- [ ] Hash passwords before storing
- [ ] Validate email uniqueness
- [ ] Role assignment logic

### Student Management
- [ ] Create student model
- [ ] CRUD operations
- [ ] Validation (email format, roll number)
- [ ] Soft delete (optional)

### Attendance System
- [ ] Create attendance model
- [ ] Daily attendance records
- [ ] Query by date/student
- [ ] Attendance percentage calculation

### Door Control
- [ ] Integrate with GPIO/motor controller
- [ ] Log all door operations
- [ ] Timestamp tracking
- [ ] Action history

### Security Alerts
- [ ] Create alert model
- [ ] Facial recognition integration
- [ ] Alert severity levels
- [ ] Alert status tracking (open/investigating/resolved)

---

## 🚀 Sample Backend Stack

**Recommended Tech Stack:**

```
Node.js + Express
├── Database: MongoDB / PostgreSQL
├── Authentication: JWT (jsonwebtoken)
├── Password Hashing: bcryptjs
├── Validation: joi / express-validator
├── Middleware: cors, dotenv, morgan
└── Hardware Control: RPi GPIO via Python subprocess
```

**Sample Dependencies:**
```json
{
  "express": "^4.18.2",
  "mongoose": "^7.0.0",
  "jsonwebtoken": "^9.0.0",
  "bcryptjs": "^2.4.3",
  "cors": "^2.8.5",
  "dotenv": "^16.0.3",
  "express-validator": "^7.0.0",
  "axios": "^1.4.0"
}
```

---

## 📊 Database Schema Examples

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "admin" | "faculty" | "security",
  createdAt: Date,
  updatedAt: Date
}
```

### Student Schema
```javascript
{
  name: String,
  email: String,
  rollNumber: String (unique),
  class: String,
  faceEncodings: [Buffer], // For facial recognition
  createdAt: Date,
  updatedAt: Date
}
```

### Attendance Schema
```javascript
{
  studentId: ObjectId,
  date: Date,
  status: "present" | "absent",
  timestamp: Date,
  markedBy: ObjectId, // Faculty/Admin
  createdAt: Date
}
```

### Alert Schema
```javascript
{
  type: String,
  description: String,
  location: String,
  severity: "critical" | "high" | "medium" | "low",
  status: "open" | "investigating" | "resolved",
  timestamp: Date,
  triggeredBy: ObjectId, // User or system
  createdAt: Date
}
```

---

## 🔗 Integration with Python Code

Your existing Python code should:

1. **Facial Recognition** (`face_attendance.py`):
   - Call `/api/attendance` POST when face recognized
   - Send student ID + status

2. **Door Control** (`motor_test_safe.py`):
   - Listen to `/api/door/open` requests
   - Trigger motor GPIO
   - Log door actions

3. **Alerts** (`sms.py`, `whatsapp.py`):
   - Monitor `/api/alerts`
   - Send SMS/WhatsApp notifications
   - Update alert status

---

## 🧪 Testing Endpoints

Use Postman or curl:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@school.com",
    "password": "password123",
    "role": "faculty"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@school.com",
    "password": "password123"
  }'

# Get Students (with token)
curl -X GET http://localhost:5000/api/students \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🎯 Implementation Priority

1. **Phase 1**: Auth (login/register)
2. **Phase 2**: Student CRUD
3. **Phase 3**: Attendance tracking
4. **Phase 4**: Door control
5. **Phase 5**: Security alerts

---

## 📝 CORS Configuration

```javascript
// Enable CORS for frontend
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

---

**Ready to build your backend?** Let's connect the frontend to your API! 🚀
