import pickle
import os
import mysql.connector

PICKLE_PATH = "/home/pi/EduFace/encodings.pkl"

if not os.path.exists(PICKLE_PATH):
    print(f"ERROR: {PICKLE_PATH} not found")
    exit(2)

with open(PICKLE_PATH, "rb") as f:
    known_encodings, known_ids = pickle.load(f)

print(f"Loaded encodings: {len(known_encodings)}")
print(f"Loaded ids: {len(known_ids)}")

# Basic type checks
if len(known_encodings) != len(known_ids):
    print("WARNING: encodings and ids lengths differ")

# show first 10 ids
print("Sample IDs:", known_ids[:10])

# check duplicates
dups = set([x for x in known_ids if known_ids.count(x) > 1])
if dups:
    print(f"WARNING: duplicate ids found: {dups}")
else:
    print("No duplicate ids")

# Connect to DB and verify ids exist
try:
    db = mysql.connector.connect(
        host=os.environ.get('DB_HOST', 'localhost'),
        user=os.environ.get('DB_USER', 'root'),
        password=os.environ.get('DB_PASS', 'bhoomika2003'),
        database=os.environ.get('DB_NAME', 'eduface')
    )
    cur = db.cursor()
    cur.execute("SELECT id FROM students")
    rows = [r[0] for r in cur.fetchall()]
    missing = [i for i in known_ids if i not in rows]
    if missing:
        print(f"WARNING: the following ids are not present in students table: {missing[:20]}{'...' if len(missing)>20 else ''}")
    else:
        print("All ids present in students table")
except Exception as e:
    print("Could not connect to DB to verify ids:", e)

# Show small stats about encodings vectors
import numpy as np
if len(known_encodings) > 0:
    arr = np.array(known_encodings)
    print("Encodings array shape:", arr.shape)
    print("First encoding sample (first 5 values):", arr[0][:5])

print("Done")
