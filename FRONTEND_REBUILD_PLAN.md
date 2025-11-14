# EduFace Frontend Rebuild Plan

## Executive Summary
Complete rebuild of the frontend with 3 role-based dashboards (Admin, Faculty, Security), authentication, real-time camera stream, and professional UI. Backend already exists and will be reused.

---

## 1. Tech Stack & Architecture

### Frontend Framework
- **React 18** (via Vite for fast builds and HMR)
- **Vite** (faster than CRA, better dev experience on Pi)
- **Material-UI (MUI)** v5 (professional, pre-built components, consistent design)
- **React Router v6** (page navigation and protected routes)
- **Axios** (HTTP client with interceptors for JWT auth)
- **Context API + useReducer** (state management — lightweight, no external deps)
- **Chart.js + react-chartjs-2** (attendance charts)
- **Papa Parse** (CSV export)
- **Excel** library (XLSX export)

### Backend Reuse
- Existing Node.js/Express backend at `/home/pi/EduFace/backend`
- Endpoints already available:
  - POST /api/auth/register
  - POST /api/auth/login
  - GET /api/students
  - POST /api/students (create)
  - PUT /api/students/:id (update)
  - DELETE /api/students/:id
  - GET /api/attendance?date=YYYY-MM-DD
  - POST /api/attendance
  - GET /api/alerts (unauthorized access images)
  - POST /api/door/open (servo control)

### Camera Stream
- **WebRTC + MediaStream API** (HTML5 getUserMedia for client webcam)
- **Stream from Pi desktop** via:
  - Option A: SSH X11 forwarding (access Pi desktop remotely, but complex)
  - **Option B (Recommended)**: Motion/streaming server on Pi (mjpeg-streamer or GStreamer HTTP stream)
  - **Option C (Best)**: ROS/OpenCV HTTP endpoint that broadcasts camera feed as MJPEG or HLS
- **Fallback**: Show still frames via polling if real-time streaming unavailable

---

## 2. Page Structure & Flows

### Landing Page (`/`)
- Hero section: "EduFace — Smart Identity for Educational Campuses"
- Description from attached image (Overview, Purpose, Features)
- Call-to-action buttons: "Sign In" / "Sign Up"
- Feature highlights (facial recognition, real-time alerts, role-based access)
- Footer with contact info

### Authentication Pages

#### Sign In (`/signin`)
- Email / Username input
- Password input
- "Remember Me" checkbox
- Role selector dropdown (Admin / Faculty / Security) — optional, can auto-detect from JWT
- Submit button
- "Don't have an account? Sign Up" link
- Error handling + loading states
- Success → store JWT in localStorage and redirect to dashboard based on role

#### Sign Up (`/signup`)
- Name input
- Email input (unique)
- Password + Confirm Password
- Role selector (Admin / Faculty / Security)
- Department (for Faculty only) — optional
- Phone number (optional)
- Terms & Conditions checkbox
- Submit button
- Success → redirect to Sign In
- Error handling (email exists, weak password, etc.)

### Admin Dashboard (`/admin/dashboard`)
**URL guards**: Only accessible if role === 'admin'

#### Navbar (Global)
- EduFace logo + branding
- Current user name + role badge
- Logout button
- Sidebar toggle (mobile)

#### Sidebar (Global)
- Dashboard (home icon)
- Students (person icon) → opens student management page
- Reports (chart icon) → attendance reports
- Alerts (bell icon) → unauthorized access log
- Settings (gear icon) → system settings (optional)
- Logout

#### Dashboard Home
**Stats Cards** (KPIs):
- Total Students
- Present Today
- Absent Today
- Unauthorized Access (today)

**Charts**:
- Attendance trend (last 7 days, line chart)
- Department-wise attendance (pie chart)
- Class-wise present/absent (bar chart)

#### Students Page
**Student CRUD**:
- Table listing all students (name, usn, department, sem, section, parent contact)
- Search + filter (by department, semester, section)
- Add Student button → modal form
- Edit button (per row) → pre-filled modal
- Delete button (per row) → confirmation dialog
- Bulk import (CSV upload)

#### Reports Page
**Attendance Report**:
- Date range picker (from/to)
- Filter by: Department, Semester, Section, Status (present/absent/late)
- Display filtered attendance records in table
- **Export buttons**:
  - Download as CSV (Papa Parse)
  - Download as Excel/XLSX (xlsx library)
  - Print-friendly PDF (optional, use jsPDF)

---

### Faculty Dashboard (`/faculty/dashboard`)
**URL guards**: Only accessible if role === 'faculty'

#### Sidebar (same as Admin but fewer options)
- Dashboard
- Attendance (view only)
- Reports (download only)
- Logout

#### Dashboard Home
**Stats Cards**:
- Total Students in My Department
- Present Today (my department)
- Absent Today
- Attendance % (today)

#### Attendance Viewing Page
**Filters**:
- Date picker (default today)
- Department dropdown (pre-filled with faculty's dept)
- Semester dropdown
- Section dropdown
- Status filter (all/present/absent/late)

**Display**:
- Table: Student Name, USN, Status, Time
- Manual Mark button (to manually update attendance if needed)
- Refresh button (to reload data)

**Export**:
- Download attendance as CSV
- Download as Excel/XLSX

---

### Security Dashboard (`/security/dashboard`)
**URL guards**: Only accessible if role === 'security'

#### Sidebar
- Dashboard
- Door Control
- Alerts & Logs
- Logout

#### Dashboard Home
**Status Cards**:
- Door Status (Locked / Unlocked)
- Total Alerts Today
- Unauthorized Access Count
- Last Alert Time

#### Door Control Page
**Door Control Card**:
- Large toggle switch or buttons: Open / Close
- Current door status display
- Manual override checkbox (for emergency)
- Action log (last 10 door actions with timestamp)

**Design**: Large, urgent-style buttons for critical actions

#### Alerts & Unauthorized Access Log
**Alert List** (from /api/alerts):
- Table/card view of unauthorized access events
- Columns: Timestamp, Image thumbnail, Action, Status
- **Action buttons** (per alert):
  - **Open Door button** (bright green, large)
  - **Deny / Dismiss button** (red)
  - **View Image in modal** (click thumbnail)
- Real-time notifications: Toast/snackbar when new alert arrives (polling or WebSocket)
- Filter by: Date, Status (pending/approved/denied)

**Image Viewer Modal**:
- Full-size image of unauthorized person
- Metadata: timestamp, duration detected
- Approval/Denial buttons

---

## 3. Authentication & Authorization

### Flow
1. User signs up → backend creates user record with role
2. User signs in → POST /api/auth/login returns JWT token + role + userId + userName
3. Frontend stores JWT in localStorage (key: `eduface_token`)
4. Axios interceptor adds `Authorization: Bearer <token>` to all requests
5. On app load, check localStorage for token; if present, user stays logged in
6. Protected routes check role; if mismatch, redirect to sign in
7. Logout clears localStorage and redirects to landing page

### JWT Payload (from backend)
```json
{
  "id": 1,
  "role": "admin",
  "userName": "Admin User"
}
```

### Token Expiry
- Backend: 12h expiry (already set)
- Frontend: On 401 response, clear token and redirect to sign in
- Optional: Implement refresh token mechanism (future enhancement)

---

## 4. Camera Integration & Streaming

### Problem Analysis
- Camera `/dev/video0` only exists on Pi; Windows doesn't have Pi's camera
- Need a way to stream from Pi to Windows desktop (or any remote client)

### Solutions

#### Option A: MJPEG HTTP Stream (Recommended & Simple)
**Setup on Pi**:
1. Install `mjpeg-streamer` or `motion`:
   ```bash
   sudo apt-get install motion
   # OR
   sudo apt-get install mjpeg-streamer
   ```
2. Configure to stream camera to HTTP endpoint (e.g., `http://raspberrypi:8081/video`)
3. Run on startup via systemd

**Frontend Integration**:
- Embed `<img src="http://raspberrypi:8081/video" />` in Security Dashboard
- Alternative: Use `<video>` tag with HLS stream (if available)
- Works from Windows, Mac, any network client

**Pros**: Simple, works everywhere, low latency
**Cons**: Requires daemon on Pi

#### Option B: Python Flask/FastAPI Streaming Server
**Setup on Pi**:
1. Create simple Flask app that captures from `/dev/video0` and streams as MJPEG
2. Endpoint: `GET http://raspberrypi:5001/video_feed`
3. Run Flask server alongside Node.js backend

**Frontend**:
- Same as Option A, just change URL to Flask endpoint

**Pros**: Custom control, can add processing
**Cons**: Need extra Python server; more setup

#### Option C: WebRTC with Janus/Kurento (Advanced)
**Pros**: Real-time, low latency, secure
**Cons**: Overkill for this use case; complex setup

### Recommended Plan: Option A (MJPEG Stream)
- Install `motion` on Pi
- Configure to stream camera feed to `http://raspberrypi:8081/?action=stream`
- Frontend `<img>` tag or `<video>` embedded in Security Dashboard
- Fallback: Show "Camera Offline" if stream unavailable

**Frontend Code (Security Dashboard)**:
```jsx
<Box sx={{ mt: 3, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
  <Typography variant="h6">Live Camera Feed</Typography>
  <img 
    src="http://raspberrypi:8081/?action=stream" 
    alt="Live Camera" 
    style={{ maxWidth: '100%', height: 'auto' }}
  />
</Box>
```

---

## 5. Real-Time Alerts (Unauthorized Access)

### Current Flow
- `face_attendance.py` detects unknown face → writes to `/home/pi/EduFace/unauthorized_logs/` + sets `/home/pi/EduFace/alert_flag.txt` to "ALERT"
- Backend GET /api/alerts reads files from that folder

### Enhancement: Real-Time Notifications
- **Polling** (simple): Security Dashboard polls `/api/alerts` every 5 seconds
- **WebSockets** (advanced): Use Socket.IO to push alerts to connected security users
- **Recommended**: Start with polling; upgrade to WebSocket later

### Implementation (Polling)
```jsx
useEffect(() => {
  const interval = setInterval(async () => {
    const response = await apiClient.get('/api/alerts');
    setAlerts(response.data);
  }, 5000); // every 5 seconds
  return () => clearInterval(interval);
}, []);
```

---

## 6. File Exports (CSV & Excel)

### CSV Export
- Use `Papa Parse` library
- Convert attendance table data to CSV string
- Trigger download via `<a href="data:text/csv,..." download>`

### Excel Export
- Use `xlsx` library (SheetJS)
- Create workbook, add sheet, format cells, download

### PDF Export (Optional)
- Use `jsPDF + jspdf-autotable` for formatted tables
- Generate on client side

---

## 7. UI/UX Design System

### Color Scheme
- **Primary**: Navy Blue (#2E3B55)
- **Secondary**: Green (#4CAF50)
- **Danger**: Red (#f44336)
- **Warning**: Orange (#ff9800)
- **Success**: Green (#4CAF50)
- **Background**: Light Gray (#f5f5f5)

### Components (MUI)
- Navbar: AppBar with logo, user menu, logout
- Sidebar: Drawer with navigation links, collapsible on mobile
- Cards: Stats cards, alert cards, student cards
- Tables: Sortable, filterable, paginated
- Modals: Forms for add/edit student, view image
- Charts: Line (trend), Pie (distribution), Bar (comparison)
- Buttons: Primary (action), Secondary (cancel), Danger (delete)
- Forms: Inputs, selects, date pickers, file uploads
- Alerts: Toast notifications for success/error

### Responsive Design
- Desktop: 2-3 column layout, full sidebar
- Tablet: 2 column, collapsible sidebar
- Mobile: 1 column, hamburger menu, stacked cards

---

## 8. Project Structure

```
/home/pi/EduFace/eduface-frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   ├── index.css
│   ├── context/
│   │   └── authContext.js (JWT, user, role)
│   ├── pages/
│   │   ├── LandingPage.js
│   │   ├── SignInPage.js
│   │   ├── SignUpPage.js
│   │   ├── AdminDashboard.js
│   │   ├── AdminStudents.js
│   │   ├── AdminReports.js
│   │   ├── FacultyDashboard.js
│   │   ├── FacultyAttendance.js
│   │   ├── FacultyReports.js
│   │   ├── SecurityDashboard.js
│   │   ├── SecurityDoorControl.js
│   │   └── SecurityAlerts.js
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── Sidebar.js
│   │   ├── ProtectedRoute.js
│   │   ├── StatsCard.js
│   │   ├── StudentModal.js
│   │   ├── AlertCard.js
│   │   └── CameraFeed.js
│   ├── utils/
│   │   ├── api.js (axios instance + interceptors)
│   │   ├── constants.js (colors, endpoints, roles)
│   │   └── exports.js (CSV, Excel helpers)
│   └── hooks/
│       └── useAuth.js (custom hook for auth context)
├── package.json
├── vite.config.js
├── index.html
└── README.md
```

---

## 9. Backend Requirements (Verification)

✅ Already implemented:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/students
- POST /api/students
- PUT /api/students/:id
- DELETE /api/students/:id
- GET /api/attendance?date=YYYY-MM-DD
- POST /api/attendance
- GET /api/alerts
- POST /api/door/open

⚠️ Might need updates:
- Ensure `/api/door/open` works correctly with servo
- Ensure `/api/alerts` returns latest alerts with timestamps
- Optional: Add WebSocket support for real-time alerts (later)

---

## 10. Deployment & Running

### Development (on Pi or Windows with npm installed)
```bash
cd /home/pi/EduFace/eduface-frontend
npm install
npm run dev    # Starts Vite dev server (http://localhost:5173)
```

### Production (on Pi)
```bash
npm run build  # Creates optimized dist/ folder
npm run preview  # Preview build locally
# OR deploy dist/ to any static hosting (Netlify, Vercel, Pi's nginx)
```

### Backend Running (Separate terminal)
```bash
cd /home/pi/EduFace/backend
npm install
npm start      # Node.js server (http://localhost:5000)
```

### Cross-Network Access
- Pi (hostname: `raspberrypi`), Windows can access:
  - Frontend: `http://raspberrypi:5173` (dev) or `http://raspberrypi:3000` (production)
  - Backend: `http://raspberrypi:5000`
  - Camera stream: `http://raspberrypi:8081/?action=stream`

---

## 11. Execution Plan (Sequential)

1. **Setup Vite + React project** (5 min)
2. **Create folder structure + install dependencies** (5 min)
3. **Setup auth context + ProtectedRoute component** (15 min)
4. **Implement Landing Page** (20 min)
5. **Implement Sign In / Sign Up pages** (30 min)
6. **Implement Admin Dashboard (home + students + reports)** (60 min)
7. **Implement Faculty Dashboard (home + attendance + reports)** (45 min)
8. **Implement Security Dashboard (home + door control + alerts + camera)** (50 min)
9. **Export functionality (CSV, Excel)** (15 min)
10. **Testing + error handling + polishing** (30 min)
11. **Push to GitHub** (5 min)

**Total Estimated Time: ~4.5 hours**

---

## 12. Camera Setup (Separate Task — Pre-Frontend)

### Before Starting Frontend, Run on Pi:
```bash
sudo apt-get update
sudo apt-get install motion

# Edit /etc/motion/motion.conf:
# - Uncomment: daemon on
# - Set: stream_port 8081
# - Set: stream_quality 80

sudo systemctl start motion
sudo systemctl enable motion
```

### Verify Stream:
- Open browser on Pi: `http://localhost:8081/?action=stream`
- Open browser on Windows: `http://raspberrypi:8081/?action=stream`

---

## 13. Clarifications & Decisions

**Q1: Camera on Pi only, not Windows**
- A: Stream via MJPEG server on Pi; embed in Security Dashboard
- Any client can view stream from any network

**Q2: Where to add camera screen in dashboard?**
- A: Security Dashboard → Add "Live Camera Feed" card below alerts
- Shows real-time MJPEG stream
- Size: Adjustable, responsive

**Q3: CCTV-like functionality?**
- A: Yes, camera feed visible 24/7 in Security Dashboard
- Optional: Record stream locally (motion daemon can do this)

---

## Approval Checklist

Before I start building, please confirm:
- [ ] Tech stack (Vite + React + MUI) approved
- [ ] 3 dashboards + auth pages + landing page = correct scope
- [ ] Camera streaming via MJPEG on Pi = approved approach
- [ ] Export to CSV/Excel = required features
- [ ] Real-time alerts via polling (not WebSocket yet) = OK
- [ ] Reuse existing backend without changes = agreed
- [ ] Timeline (~4.5 hours) = acceptable

**Any changes or additions before I start?**
