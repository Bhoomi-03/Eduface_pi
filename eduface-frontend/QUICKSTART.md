# 🚀 EduFace Frontend - Quick Start Guide

## Installation & Setup

### Prerequisites
- Node.js 18+ installed
- npm 9+
- Backend API running on `http://localhost:5000` (or configure `VITE_API_URL`)

### Steps

1. **Clone the repository** (if not already done)
   ```bash
   git clone https://github.com/Bhoomi-03/Eduface_pi.git
   cd Eduface_pi/eduface-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   - Open http://localhost:5173 in your browser

4. **Build for production**
   ```bash
   npm run build
   npm run preview  # Test production build locally
   ```

---

## 🔐 Demo Credentials

Use these to test the application:

| Role     | Email                  | Password |
|----------|------------------------|----------|
| Admin    | admin@eduface.com      | Admin123 |
| Faculty  | faculty@eduface.com    | Faculty123 |
| Security | security@eduface.com   | Security123 |

---

## 📱 Interface Overview

### Landing Page
- Hero section with feature highlights
- Sign in / Sign up buttons
- Responsive design for all screen sizes

### Sign In / Sign Up
- Email and password validation
- Role selection (Admin, Faculty, Security)
- Error messages with retry logic

### Admin Dashboard
- **Home**: Real-time KPI cards and attendance trends
- **Students**: CRUD operations for student management
- **Reports**: Export attendance data as CSV or Excel

### Faculty Dashboard
- **Home**: Department/semester overview
- **Attendance**: View filtered attendance records
- **Reports**: Download class-wise reports

### Security Dashboard
- **Home**: Real-time unauthorized access alerts
- **Door Control**: Actuate door lock/unlock
- **Alerts**: View failed authentication logs
- **Camera**: Live video feed from Pi camera

---

## ⚙️ Configuration

### API Base URL
- **Development**: `http://localhost:5000/api` (default)
- **Production**: Set `VITE_API_URL` environment variable
  ```bash
  VITE_API_URL=http://raspberrypi:5000/api npm run dev
  ```

### Camera Stream URL
- **Default**: `http://raspberrypi:8081/?action=stream`
- Edit in `SecurityDashboard.jsx` if needed

---

## 🧪 Testing Workflows

### Test Sign Up
1. Click "Sign Up" on landing page
2. Enter name, email, password (min 6 chars)
3. Select a role
4. Click "Create Account"
5. Auto-redirects to Sign In

### Test Admin Dashboard
1. Sign in with admin@eduface.com / Admin123
2. View KPI cards on home
3. Go to Students → add/edit/delete students
4. Go to Reports → export as CSV/Excel

### Test Faculty Dashboard
1. Sign in with faculty@eduface.com / Faculty123
2. View department/semester stats
3. Filter attendance by date/student
4. Download report

### Test Security Dashboard
1. Sign in with security@eduface.com / Security123
2. Check live camera feed (if available)
3. Click "Open Door" to actuate motor
4. View unauthorized access alerts

### Test Logout
1. Click user avatar (top-right corner)
2. Click "Logout"
3. Redirected to landing page
4. Token cleared from localStorage

---

## 📊 Project Structure

```
eduface-frontend/
├── src/
│   ├── pages/          # 12 page components (roles-specific)
│   ├── components/     # Reusable UI components
│   ├── context/        # Auth state management
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # API client, exports, constants
│   ├── App.jsx         # Router & layout
│   └── index.css       # Global styles
├── public/             # Static assets
├── dist/               # Production build (5.4 MB)
├── vite.config.js      # Vite configuration
└── package.json        # Dependencies
```

---

## 🛠️ Common Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:5173)

# Production
npm run build            # Build for production (dist/)
npm run preview          # Preview production build

# Quality
npm run lint             # Check code quality (if eslint installed)

# Cleanup
npm run clean            # Clear dist/ and cache (if configured)
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module" errors
**Solution**: 
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: API returns 401 Unauthorized
**Solution**:
- Check backend is running on http://localhost:5000
- Verify credentials are correct
- Clear localStorage and try again

### Issue: Camera feed not showing
**Solution**:
- Ensure `motion` or `mjpeg_streamer` running on Pi
- Check port 8081 is accessible
- Verify URL in SecurityDashboard.jsx

### Issue: Build fails with "Parse error"
**Solution**:
- This is fixed in the .jsx/.js shim structure
- Clear node_modules and reinstall if issue persists

---

## 📈 Performance Tips

- **Dev Server**: 900ms startup time
- **Build Time**: ~60 seconds (first), ~5 seconds (cached)
- **Bundle Size**: 5.4 MB (includes all dependencies)
- **Cache Busting**: Automatic with Vite (content hash)

---

## 🔗 Related Documentation

- **Backend Setup**: See `backend/README.md`
- **Face Recognition**: See `encode_faces.py`, `face_attendance.py`
- **Hardware**: See Pi camera and motor setup docs
- **GitHub**: https://github.com/Bhoomi-03/Eduface_pi

---

## ✅ Pre-Deployment Checklist

- [ ] Backend API running and accessible
- [ ] Database connected and populated
- [ ] Face encodings (encodings.pkl) available
- [ ] Camera stream accessible on port 8081
- [ ] Motor/servo controller working
- [ ] All 3 demo users exist in database
- [ ] No console errors in dev tools
- [ ] Build completes successfully
- [ ] All routes accessible and protected
- [ ] CSV/Excel exports working

---

## 🎉 You're All Set!

The EduFace frontend is ready to use. Start with `npm run dev` and explore the application. For issues or questions, check GitHub Issues or the documentation files.

Happy coding! 🚀
