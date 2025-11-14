# EduFace Dashboard Troubleshooting & Setup Guide

## Problem Analysis

The dashboards were showing no content due to several issues:

### 1. **AdminDashboard**
- **Issue**: Mock data used `_id` instead of `id` (MongoDB vs MySQL schema mismatch)
- **Root Cause**: Backend returns `id` (MySQL), but component expected `_id`
- **Fix**: Removed mock data fallback; added error logging

### 2. **FacultyDashboard**
- **Issue**: Missing `student_id` in attendance records
- **Root Cause**: Backend may not return `student_id` in attendance JOIN query
- **Fix**: Added data transformation to ensure `student_id` is available

### 3. **SecurityDashboard**
- **Issue**: Alerts endpoint may fail if `unauthorized_logs` folder doesn't exist
- **Root Cause**: Path construction or missing folder
- **Fix**: Added error handling and mock data fallback

### 4. **Backend**
- **Issue**: Database connection defaults to `127.0.0.1` but Pi uses `localhost`
- **Root Cause**: IPv6 vs IPv4 issues
- **Fix**: Already handled in `db.js`

---

## Setup Instructions

### Step 1: Verify Backend Database

```bash
# SSH into the Pi
ssh pi@raspberrypi

# Check MySQL is running
sudo systemctl status mysql

# Login to MySQL
mysql -u root -p
# Password: bhoomika2003

# Inside MySQL
USE eduface;
SHOW TABLES;
SELECT COUNT(*) FROM students;
SELECT COUNT(*) FROM attendance;
SELECT COUNT(*) FROM users;
```

### Step 2: Environment Variables

Create or update `.env` file in `/home/pi/EduFace/backend/`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=bhoomika2003
DB_NAME=eduface
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=production
```

Create or update `.env` file in `/home/pi/EduFace/eduface-frontend/`:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_DEBUG=true
```

### Step 3: Start Backend Server

```bash
cd /home/pi/EduFace/backend
npm install
npm start
# Should output: "EduFace API running on http://localhost:5000"
```

### Step 4: Start Frontend (on Pi or local machine)

```bash
cd /home/pi/EduFace/eduface-frontend
npm install
npm start
# Should output: "Local: http://localhost:3000"
```

### Step 5: Test API Endpoints

Use curl or Postman to test:

```bash
# 1. Register a user (if not exists)
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@eduface.com",
    "password": "admin123",
    "role": "admin"
  }'

# 2. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@eduface.com",
    "password": "admin123"
  }'
# Response: { token: "...", role: "admin", userId: 1, userName: "Admin User" }

# 3. Fetch students (requires token from login)
curl -X GET http://localhost:5000/api/students \
  -H "Authorization: Bearer <TOKEN_FROM_LOGIN>"

# 4. Fetch attendance for today
curl -X GET "http://localhost:5000/api/attendance?date=2025-11-14" \
  -H "Authorization: Bearer <TOKEN_FROM_LOGIN>"
```

---

## Debugging Checklist

### Dashboard Shows Empty Table

1. **Check Console Logs**:
   - Open browser DevTools (F12)
   - Check Console tab for errors like `[AdminDashboard] Failed to fetch students: ...`
   - Check Network tab - do API calls succeed (200 OK) or fail (401, 500)?

2. **Verify Backend Connection**:
   ```bash
   # From Pi terminal
   curl http://localhost:5000/
   # Should return: {"status":"ok"}
   ```

3. **Check Authentication**:
   - Ensure you're logged in (JWT token in localStorage)
   - Verify token isn't expired
   - Token should be in Authorization header as `Bearer <token>`

4. **Verify Database Data**:
   ```bash
   # Inside MySQL
   SELECT * FROM students LIMIT 5;
   SELECT * FROM attendance LIMIT 5;
   ```

### API Returns 401 Unauthorized

- **Cause**: Missing or expired JWT token
- **Fix**: Login again; token expires after 12 hours
- **Check**: Browser DevTools → Application → Local Storage → `eduface_token`

### API Returns 500 Internal Server Error

- **Cause**: Backend error (database connection, SQL error, etc.)
- **Fix**: Check backend console logs for error messages
- **Debug**: Add console.log statements in `/backend/routes/*.js`

### Database Connection Failed

- **Symptoms**: Backend crashes on startup
- **Check**: 
  ```bash
  # Is MySQL running?
  sudo systemctl status mysql
  
  # Can you connect manually?
  mysql -u root -p -h localhost -e "USE eduface; SELECT 1;"
  ```
- **Fix**: 
  ```bash
  # Restart MySQL
  sudo systemctl restart mysql
  ```

---

## File Changes Summary

### Frontend Fixes

1. **`src/pages/AdminDashboard.js`**
   - Fixed: `student._id` → `student.id`
   - Added: Error logging and error state display
   - Removed: Mock data fallback

2. **`src/pages/FacultyDashboard.js`**
   - Added: Error state and error logging
   - Added: Data transformation to ensure `student_id` field
   - Added: Error Alert display in UI

3. **`src/pages/SecurityDashboard.js`**
   - Added: Error state and error logging
   - Fixed: Alert data transformation to handle both `file` and `file.file`
   - Added: Error Alert display in UI

### Backend (No changes needed)

- All routes already correctly implemented
- Database schema auto-creates on startup
- Alerts route checks for `security` role

---

## Quick Test Workflow

1. **Terminal 1** - Backend:
   ```bash
   cd /home/pi/EduFace/backend
   npm start
   ```

2. **Terminal 2** - Frontend:
   ```bash
   cd /home/pi/EduFace/eduface-frontend
   npm start
   ```

3. **Browser**:
   - Navigate to `http://localhost:3000`
   - Click "Sign In" (or register first)
   - Login with credentials
   - Dashboards should now display data from the database

4. **Verify Data Appears**:
   - AdminDashboard → Students table
   - FacultyDashboard → Attendance records for today
   - SecurityDashboard → Recent unauthorized access alerts

---

## Performance Tips

1. **Reduce API calls**: Queries cache data in state
2. **Add pagination**: For tables with > 100 rows
3. **Add search/filter**: Let users find records
4. **Lazy load**: Load historical data only when requested

---

## Next Steps

1. Run both backend and frontend
2. Test login workflow
3. Verify each dashboard displays data
4. Check browser console for any remaining errors
5. If data still doesn't show: provide backend console output for debugging
