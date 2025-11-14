import cv2
import face_recognition
import mysql.connector
from datetime import datetime, time
from whatsapp import send_whatsapp
import pigpio
import time as t
import pickle
import os
import numpy as np
import threading

# =========================
# CAMERA CONFIG
# =========================
CAMERA_DEVICE = 0
FRAME_WIDTH = 640
FRAME_HEIGHT = 480

# =========================
# SERVO CONFIG (using pigpio)
# =========================
SERVO_PIN = 18
pi = pigpio.pi()
if not pi.connected:
    print("[ERROR] pigpio daemon not running. Start it using:")
    print("  sudo systemctl start pigpiod")
    exit()

def open_door():
    """Non-blocking servo door control"""
    def move_servo():
        print("[DOOR] Opening door...")
        pi.set_servo_pulsewidth(SERVO_PIN, 1500)  # Open (90°)
        t.sleep(4)                                # Keep open
        pi.set_servo_pulsewidth(SERVO_PIN, 500)   # Close (0°)
        print("[DOOR] Door closed")
        pi.set_servo_pulsewidth(SERVO_PIN, 0)     # Stop signal

    threading.Thread(target=move_servo, daemon=True).start()

# =========================
# DATABASE CONNECTION
# =========================
db = mysql.connector.connect(
    host=os.environ.get('DB_HOST', 'localhost'),
    user=os.environ.get('DB_USER', 'root'),
    password=os.environ.get('DB_PASS', 'bhoomika2003'),
    database=os.environ.get('DB_NAME', 'eduface')
)
cursor = db.cursor(dictionary=True)

# =========================
# LOAD ENCODINGS
# =========================
print("[INFO] Loading face encodings...")
with open("/home/pi/EduFace/encodings.pkl", "rb") as f:
    known_encodings, known_ids = pickle.load(f)
print(f"[INFO] Loaded {len(known_encodings)} encodings")

# =========================
# LOAD STUDENT INFO
# =========================
cursor.execute("SELECT id, name, usn, parent_number FROM students")
student_info = {row["id"]: row for row in cursor.fetchall()}

# =========================
# UNAUTHORIZED SNAPSHOT DIR
# =========================
UNAUTH_DIR = "/home/pi/EduFace/unauthorized_logs"
os.makedirs(UNAUTH_DIR, exist_ok=True)
last_unknown = False

# =========================
# TRACK ATTENDANCE
# =========================
marked_today = set()
recognition_stable_count = {}

# =========================
# CAMERA INITIALIZATION
# =========================
cap = cv2.VideoCapture(CAMERA_DEVICE, cv2.CAP_V4L2)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, FRAME_WIDTH)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, FRAME_HEIGHT)
cap.set(cv2.CAP_PROP_FOURCC, cv2.VideoWriter_fourcc(*"MJPG"))

print("[INFO] ✅ Camera connected")
print("[INFO] System running — show face to camera (press 'q' to quit)")

# =========================
# ATTENDANCE FUNCTION
# =========================
def mark_attendance(student_id, status):
    now = datetime.now()
    today = now.date()
    cur_time = now.time()

    cursor.execute("SELECT id FROM attendance WHERE student_id=%s AND date=%s", (student_id, today))
    if cursor.fetchone():
        return  # already marked

    cursor.execute(
        "INSERT INTO attendance (student_id, date, time, status) VALUES (%s, %s, %s, %s)",
        (student_id, today, cur_time, status)
    )
    db.commit()
    print(f"[ATTENDANCE] Marked {student_info[student_id]['name']} ({student_info[student_id]['usn']}) as {status}")

# =========================
# MAIN LOOP
# =========================
while True:
    ret, frame = cap.read()
    if not ret:
        continue

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    boxes = face_recognition.face_locations(rgb)
    encs = face_recognition.face_encodings(rgb, boxes)

    if len(boxes) > 0:
        # Pick largest face (closest to camera)
        areas = [(b[2] - b[0]) * (b[1] - b[3]) for b in boxes]
        idx = areas.index(max(areas))
        top, right, bottom, left = boxes[idx]
        enc = encs[idx]

        distances = face_recognition.face_distance(known_encodings, enc)
        min_index = np.argmin(distances)

        if distances[min_index] < 0.58:
            student_id = known_ids[min_index]
            stu = student_info[student_id]

            cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
            cv2.putText(frame, f"{stu['name']} | {stu['usn']}", (left, top - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

            recognition_stable_count[student_id] = recognition_stable_count.get(student_id, 0) + 1

            if recognition_stable_count[student_id] >= 5 and student_id not in marked_today:
                now_time = datetime.now().time()

                if now_time <= time(8, 50):
                    status = "present"
                elif time(8, 50) < now_time < time(9, 15):
                    status = "late"
                    send_whatsapp(f"Late Entry: {stu['name']} ({stu['usn']}) reached late.", stu['parent_number'])
                elif time(12, 30) <= now_time <= time(13, 30):
                    status = "half_day"
                    send_whatsapp(f"Half Day: {stu['name']} ({stu['usn']}) attended half day.", stu['parent_number'])
                else:
                    status = "present"

                open_door()  # non-blocking call
                mark_attendance(student_id, status)

                marked_today.add(student_id)
                recognition_stable_count.clear()
                last_unknown = False

        else:
            recognition_stable_count.clear()
            if not last_unknown:
                print("[SECURITY] 🚨 Unknown person detected")
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                path = f"{UNAUTH_DIR}/UNAUTH_{timestamp}.jpg"
                cv2.imwrite(path, frame)
                with open("/home/pi/EduFace/alert_flag.txt", "w") as f:
                    f.write("ALERT")
            last_unknown = True

    else:
        recognition_stable_count.clear()

    cv2.imshow("EduFace Attendance System", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# =========================
# CLEANUP
# =========================
cap.release()
pi.set_servo_pulsewidth(SERVO_PIN, 0)
pi.stop()
cv2.destroyAllWindows()
print("[INFO] System closed cleanly ✅")
