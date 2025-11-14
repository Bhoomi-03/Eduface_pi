# @context: EduFace Full System Definition

## 🧠 EDUFACE PROJECT CONTEXT — FOR COPILOT UNDERSTANDING

### 1️⃣ Project Overview

EduFace is an **AI + IoT–powered attendance and security management system** designed for educational institutions. It integrates **facial recognition**, **automated attendance marking**, **servo-controlled door access**, **SMS/WhatsApp alerts**, and a **React web frontend** for admin, faculty, and security dashboards.

**Core Concept:**

* The Raspberry Pi continuously monitors an entrance camera.
* When a student is recognized:
  * Attendance is marked in the database.
  * Door servo opens for authorized entry.
  * Parent receives a WhatsApp/SMS notification if late or half-day.
* If an **unauthorized person** is detected:
  * Snapshot saved.
  * Alert flag is raised.
  * Security dashboard displays and controls the response.

---

### 2️⃣ Hardware Components

* **Raspberry Pi 4 (or 3B+)** — main controller.
* **USB / Pi Camera Module** — for facial recognition.
* **Servo Motor (SG90 / MG90)** — controls the entrance gate.
* **Database (MySQL)** — stores student data, attendance, and alerts.
* **Internet Connection** — for sending WhatsApp/SMS alerts via Twilio.

---

### 3️⃣ Software Stack

| Layer                | Technology                                            |
| -------------------- | ----------------------------------------------------- |
| **AI/Recognition**   | Python + OpenCV + face_recognition                    |
| **Hardware Control** | RPi.GPIO for servo motor                              |
| **Database**         | MySQL                                                 |
| **Backend API**      | Flask / FastAPI or Node.js (to connect Pi ↔ Frontend) |
| **Frontend**         | React + Material UI + Axios + Jotai                   |
| **Notifications**    | Twilio (WhatsApp/SMS API)                             |

---

### 4️⃣ Backend Responsibilities

The backend (Flask or Node.js) provides REST APIs for:

* **Authentication** — JWT-based signup/login for Admin, Faculty, and Security users.
* **Students CRUD** — Add, Edit, Delete student records.
* **Attendance** — Fetch and filter by date, status, or student.
* **Security Alerts** — Retrieve snapshots & status for unauthorized entries.
* **Door Control** — Allow security to manually open/close the door via the frontend.

---

### 5️⃣ Raspberry Pi Side Logic (Python)

**Main Script:** `face_attendance.py`

#### Steps:

1. Load pre-trained face encodings from `encodings.pkl`.
2. Open camera stream (auto-start on Pi boot).
3. For every detected face:

   * Compare with known encodings using distance threshold.
   * If recognized:

     * Fetch student details from database.
     * Determine attendance status:

       * `Present` → before 8:50 AM
       * `Late` → between 8:50 AM and 9:15 AM
       * `Half Day` → between 12:30 PM and 1:30 PM
     * Record attendance in MySQL.
     * Open the door via servo motor (4s).
     * Send WhatsApp message if `Late` or `Half Day`.
   * If unrecognized:

     * Save snapshot in `/unauthorized_logs/`.
     * Write `ALERT` flag in `/alert_flag.txt`.
     * Backend uses this to update security dashboard.

#### Continuous Mode:

* Script runs as a `systemd` service on boot.
* Operates headless (no GUI).
* Logs to `/home/pi/EduFace/eduface_log.txt`.

---

### 6️⃣ Frontend (React + Material UI)

The web frontend provides **role-based dashboards** and **real-time control**.

#### Roles:

1. **Admin Dashboard**

   * Perform full CRUD on students.
   * View and export attendance reports.
   * Apply filters (by date, department, status, or student name).
   * See summary charts (present/absent/late distribution).
   * Manage faculty/security user accounts.

2. **Faculty Dashboard**

   * View live or historical attendance of their assigned classes.
   * Filter by date or student.
   * Export attendance as CSV/PDF.
   * Mark manual overrides (for missed scans).
   * Receive notifications for absentees or late arrivals.

3. **Security Dashboard**

   * Monitor **unauthorized entry logs** (auto-refreshed).
   * View snapshots of unknown faces with timestamps.
   * Button to **manually open/close** door via API.
   * Mark incidents as “resolved” or “reported.”
   * Displays live camera feed (optional future feature).

4. **Landing / Auth Pages**

   * Landing page introduces EduFace system.
   * Signup and Signin pages with email/password + role-based redirection.
   * JWT tokens stored in localStorage.
   * Axios interceptors automatically attach token headers.

---

### 7️⃣ Frontend–Backend Interaction Flow

#### Authentication

* User logs in → backend verifies → sends JWT + role.
* JWT stored locally; used for all protected routes.
* On refresh, token auto-validates.
* Based on role:

  * `admin` → `/admin/dashboard`
  * `faculty` → `/faculty/dashboard`
  * `security` → `/security/dashboard`

#### Attendance Fetching

Frontend calls:

```
GET /api/attendance?date=YYYY-MM-DD&status=late
```

Backend queries MySQL and returns JSON.

#### Unauthorized Alerts

Backend monitors `/home/pi/EduFace/alert_flag.txt`.
When `ALERT` detected:

* It updates the database with event details.
* Security dashboard auto-refreshes (or via WebSocket).
* Snapshot preview and action buttons appear.

#### Door Control (Security Page)

Frontend sends:

```
POST /api/door/open
```

Backend triggers GPIO function on the Pi.
Security can open the door remotely (e.g., for manual override).

---

### 8️⃣ Attendance Marking Logic

| Time                 | Status   | WhatsApp Notification            |
| -------------------- | -------- | -------------------------------- |
| ≤ 8:50 AM            | Present  | None                             |
| 8:50–9:15 AM         | Late     | “Late Entry”                     |
| 12:30–13:30          | Half Day | “Half Day”                       |
| > 9:15 AM (no entry) | Absent   | Marked automatically by cron job |

Backend runs a **daily cron (or Flask APScheduler)** to mark absentees for students not recorded by 9:15 AM.

---

### 9️⃣ Database Structure (MySQL)

**Tables:**

#### `students`

| id | name | usn | dataset_folder | parent_number |
| -- | ---- | --- | -------------- | ------------- |

#### `attendance`

| id | student_id | date | time | status |

#### `users`

| id | name | email | password | role | created_at |

#### `unauthorized_logs`

| id | timestamp | image_path | resolved (bool) |

---

### 🔟 System Automation

#### Auto-start at boot:

`face_attendance.py` runs via systemd service.

#### Logs:

All system outputs redirected to `/home/pi/EduFace/eduface_log.txt`.

#### Alert flag:

`alert_flag.txt` used as a trigger for backend to update security dashboard.

---

### 🧩 Overall Flow Summary

1. **Camera detects face → checks database →**
2. **If recognized:**

   * Mark attendance → open door → notify parents (if late/half-day)
3. **If unrecognized:**

   * Save image → set alert flag → security dashboard updated
4. **Frontend dashboards:**

   * Admin manages data
   * Faculty views attendance
   * Security monitors alerts and door control

---

### 🛡️ Future Enhancements (optional)

* Face mask detection
* Live attendance chart via WebSocket
* Email notifications
* Mobile-responsive security panel
* Integration with fingerprint or RFID as backup

---

## ✅ Summary for Copilot

Copilot should:

* Treat this as a **multi-module system** (Python backend + React frontend).
* Generate role-based frontend components that consume REST APIs.
* Generate backend routes for authentication, attendance, and alerts.
* Respect the data flow: Camera → Backend → Database → Frontend.
* Maintain modularity between AI/IoT logic (Pi side) and Web UI (React side).
* Use Material UI consistently for professional UX.
* Support JWT authentication and role-based routing.

---

*Created automatically by assistant on user's request.*
