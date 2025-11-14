# EduFace Frontend

A professional, real-authentication React frontend for the EduFace AI + IoT attendance system.

## 🎯 Features

- **Real Authentication**: JWT-based login/register with role-based access
- **Three User Roles**: Admin, Faculty, Security
- **Role-Based Dashboards**:
  - **Admin**: Student CRUD, attendance overview, system analytics
  - **Faculty**: Mark attendance, view reports, attendance history
  - **Security**: Door control, unauthorized access logs, system health
- **Material UI Design**: Professional navy blue & green theme
- **Jotai State Management**: Lightweight atom-based state
- **Axios Interceptors**: Auto JWT injection on all requests
- **ProtectedRoute**: Token + role verification
- **Responsive Layout**: Sidebar navigation, navbar, mobile-friendly

## 📦 Installation

```bash
# Install dependencies
npm install

# Set environment variables (optional)
export REACT_APP_API_URL=http://localhost:5000/api

# Start development server
npm start
```

The app will open at `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Theme Customization

Edit `src/utils/constants.js`:

```javascript
export const THEME_COLORS = {
  PRIMARY: '#2E3B55',      // Navy Blue
  SECONDARY: '#4CAF50',    // Green
  // ... other colors
};
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Navbar.js          # Top navigation bar with user menu
│   ├── Sidebar.js         # Role-based navigation sidebar
│   └── ProtectedRoute.js  # Route guard for authenticated pages
│
├── pages/
│   ├── LandingPage.js         # Public landing page with features
│   ├── SignUpPage.js          # User registration
│   ├── SignInPage.js          # User login
│   ├── AdminDashboard.js      # Admin panel with student CRUD
│   ├── FacultyDashboard.js    # Faculty attendance marking
│   └── SecurityDashboard.js   # Security & door control
│
├── context/
│   └── authAtom.js        # Jotai auth atoms and state
│
├── utils/
│   ├── api.js             # Axios instance with interceptors
│   └── constants.js       # API endpoints, roles, theme colors
│
├── App.js                 # Main routing setup
├── index.js               # React entry point
└── index.css              # Global styles
```

## 🔐 Authentication Flow

1. **Sign Up** → POST `/api/auth/register`
   - Create new user with name, email, password, role

2. **Sign In** → POST `/api/auth/login`
   - Returns JWT token + user role
   - Store in localStorage + Jotai atom
   - Auto-redirect based on role

3. **API Requests**
   - Axios interceptor auto-adds `Authorization: Bearer {token}`
   - 401 response clears auth & redirects to `/signin`

4. **Logout**
   - Clear localStorage + Jotai state
   - Redirect to `/signin`

## 📡 API Integration

### Authentication Endpoints

```javascript
// Register
POST /api/auth/register
{ name, email, password, role }

// Login
POST /api/auth/login
{ email, password }
// Returns: { token, role, userId, userName }
```

### Dashboard Endpoints

```javascript
// Students
GET /api/students
POST /api/students
PUT /api/students/:id
DELETE /api/students/:id

// Attendance
GET /api/attendance?date=2024-11-12
POST /api/attendance

// Door Control
POST /api/door/open
{ action: "open" | "close" }

// Security Alerts
GET /api/alerts
```

## 🎨 Theme & Styling

**Primary Color**: Navy Blue (`#2E3B55`)  
**Secondary Color**: Green (`#4CAF50`)

All Material UI components are styled with the custom theme. To customize:

1. Edit `THEME_COLORS` in `src/utils/constants.js`
2. Update `createTheme()` in `src/App.js`

## 🧪 Demo Credentials

For testing the frontend without a backend:

```
Admin:
  Email: admin@eduface.com
  Password: password123
  
Faculty:
  Email: faculty@eduface.com
  Password: password123
  
Security:
  Email: security@eduface.com
  Password: password123
```

## 🚀 Building for Production

```bash
npm run build
```

Creates optimized production build in `build/` folder.

## 📋 Role-Based Access

| Page | Admin | Faculty | Security |
|------|-------|---------|----------|
| Dashboard | ✅ | ✅ | ✅ |
| Students | ✅ | ❌ | ❌ |
| Attendance | ✅ | ✅ | ❌ |
| Door Control | ❌ | ❌ | ✅ |
| Alerts | ❌ | ❌ | ✅ |

## 🛠️ Troubleshooting

### CORS Errors
Make sure your backend is running on `http://localhost:5000` and allows CORS for `http://localhost:3000`

### 401 Unauthorized
Token may be expired. Clear localStorage and sign in again:
```javascript
localStorage.clear()
```

### Page Shows "Loading..."
Check browser console for API errors. Ensure backend is responding.

## 📚 Dependencies

- **React 18**: UI framework
- **Material UI 5**: Component library
- **React Router DOM 6**: Client-side routing
- **Axios**: HTTP client
- **Jotai**: State management
- **@mui/icons-material**: Icon library

## 📝 License

© 2024 EduFace. All rights reserved.

---

**Next Steps**: 
1. Install dependencies: `npm install`
2. Configure `REACT_APP_API_URL` environment variable
3. Start development server: `npm start`
4. Create matching backend API endpoints
