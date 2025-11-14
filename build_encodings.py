import os
import pickle
import face_recognition
import mysql.connector
from tqdm import tqdm

# Config
OUTPUT_PATH = "/home/pi/EduFace/encodings.pkl"
MIN_IMAGES_PER_STUDENT = 1

# Connect to DB
db = mysql.connector.connect(
    host=os.environ.get('DB_HOST', 'localhost'),
    user=os.environ.get('DB_USER', 'root'),
    password=os.environ.get('DB_PASS', 'bhoomika2003'),
    database=os.environ.get('DB_NAME', 'eduface')
)
cur = db.cursor(dictionary=True)
cur.execute("SELECT id, name, usn, dataset_folder FROM students")
students = cur.fetchall()

known_encodings = []
known_ids = []

for s in tqdm(students, desc="Students"):
    sid = s['id']
    folder = s.get('dataset_folder')
    if not folder or not os.path.exists(folder):
        print(f"[WARN] Student {sid} ({s['name']}) has missing dataset_folder: {folder}")
        continue

    files = [os.path.join(folder, f) for f in os.listdir(folder) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    if not files:
        print(f"[WARN] No images found for {sid} in {folder}")
        continue

    count = 0
    for img_path in files:
        try:
            img = face_recognition.load_image_file(img_path)
            encs = face_recognition.face_encodings(img)
            if not encs:
                # try model='hog' fallback
                encs = face_recognition.face_encodings(img, model='hog')
            if encs:
                # store first face encoding for this image
                known_encodings.append(encs[0])
                known_ids.append(sid)
                count += 1
        except Exception as e:
            print(f"[ERROR] processing {img_path}: {e}")

    if count < MIN_IMAGES_PER_STUDENT:
        print(f"[WARN] Only {count} valid encodings for student {sid} ({s['name']})")

print(f"Total encodings: {len(known_encodings)} for {len(set(known_ids))} students")

# Save
with open(OUTPUT_PATH, 'wb') as f:
    pickle.dump((known_encodings, known_ids), f)

print(f"Saved encodings to {OUTPUT_PATH}")
