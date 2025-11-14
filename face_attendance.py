import cv2
import face_recognition
import mysql.connector
from datetime import datetime, time
from whatsapp import send_whatsapp
import RPi.GPIO as GPIO
import time as t
import pickle
import os
import numpy as np

# ---- CAMERA CONFIG ----
CAMERA_DEVICE = 0
FRAME_WIDTH = 640
FRAME_HEIGHT = 480

# ---- SERVO CONFIG ----
SERVO_PIN = 18
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup(SERVO_PIN, GPIO.OUT)
pwm = GPIO.PWM(SERVO_PIN, 50)  # 50Hz PWM
pwm.start(0)

def open_door():
    """Open the door for 4 seconds using servo"""
    print("[DOOR] 🔓 Opening door...")
    pwm.ChangeDutyCycle(7.5)
    t.sleep(4)
    pwm.ChangeDutyCycle(2.5)
    print("[DOOR] ✅ Door closed")

# ---- DATABASE ----
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="bhoomika2003",
    database="eduface"
)
cursor = db.cursor(dictionary=True)

# ---- LOAD ENCODINGS ----
print("[INFO] 📦 Loading face encodings...")
with open("/home/pi/EduFace/encodings.pkl", "rb") as f:
    known_encodings, known_ids = pickle.load(f)
print(f"[INFO] ✅ Loaded {len(known_encodings)} encodings")

# ---- Load Student Info ----
cursor.execute("SELECT id, name, usn, parent_number FROM students")
student_info = {row["id"]: row for row in cursor.fetchall()}

# ---- Unauthorized Snapshot Directory ----
UNAUTH_DIR = "/home/pi/EduFace/unauthorized_logs"
os.makedirs(UNAUTH_DIR, exist_ok=True)
last_unknown_time = 0

# ---- Track students already marked today ----
marked_today = set()

# ---- Start Camera ----
cap = cv2.VideoCapture(CAMERA_DEVICE, cv2.CAP_V4L2)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, FRAME_WIDTH)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, FRAME_HEIGHT)
cap.set(cv2.CAP_PROP_FOURCC, cv2.VideoWriter_fourcc(*"MJPG"))

print("[INFO] ✅ Camera connected")
print("[INFO] System running. Show face to camera. Press 'q' to quit.")

# ---- Mark Attendance ----
def mark_attendance(student_id, status):
    now = datetime.now()
    today = now.date()
    cur_time = now.time()

    cursor.execute("SELECT id FROM attendance WHERE student_id=%s AND date=%s", (student_id, today))
    if cursor.fetchone():
        return

    cursor.execute(
        "INSERT INTO attendance (student_id, date, time, status) VALUES (%s, %s, %s, %s)",
        (student_id, today, cur_time, status)
    )
    db.commit()
    print(f"[ATTENDANCE] 📝 Marked {student_info[student_id]['name']} ({student_info[student_id]['usn']}) as {status}")

# ---- MAIN LOOP ----
while True:
    ret, frame = cap.read()
    if not ret:
        continue

    # Resize frame for faster recognition
    small_frame = cv2.resize(frame, (0, 0), fx=0.5, fy=0.5)
    rgb_small_frame = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)

    # Detect faces
    boxes = face_recognition.face_locations(rgb_small_frame)
    encs = face_recognition.face_encodings(rgb_small_frame, boxes)

    for (top, right, bottom, left), enc in zip(boxes, encs):
        # Scale back to original frame size
        top *= 2
        right *= 2
        bottom *= 2
        left *= 2

        # Compare with known faces
        distances = face_recognition.face_distance(known_encodings, enc)
        min_index = np.argmin(distances)
        min_distance = distances[min_index]

        # --- Threshold for Known/Unknown ---
        if min_distance < 0.45:  # Strict threshold
            student_id = known_ids[min_index]
            stu = student_info[student_id]
            color = (0, 255, 0)  # Green box
            label = f"{stu['name']} | {stu['usn']}"

            # ---- Mark Attendance ----
            if student_id not in marked_today:
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

                open_door()
                mark_attendance(student_id, status)
                marked_today.add(student_id)

        else:
            # --- UNKNOWN FACE ---
            color = (0, 0, 255)  # Red box
            label = "Unknown"

            current_time = t.time()
            if current_time - last_unknown_time > 20:  # Snapshot every 20s
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                save_path = f"{UNAUTH_DIR}/UNAUTH_{timestamp}.jpg"
                cv2.imwrite(save_path, frame)
                print(f"[SECURITY] 🚨 Unknown detected! Snapshot saved: {save_path}")
                last_unknown_time = current_time

        # ---- Draw bounding box ----
        cv2.rectangle(frame, (left, top), (right, bottom), color, 2)
        cv2.putText(frame, label, (left, top - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)

    cv2.imshow("EduFace Attendance System", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# ---- Cleanup ----
cap.release()
pwm.stop()
GPIO.cleanup()
cv2.destroyAllWindows()
print("[INFO] ✅ System closed cleanly")
