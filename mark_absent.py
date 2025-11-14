import os
import mysql.connector
from datetime import date
from whatsapp import send_whatsapp

# Use environment variables for DB connection (safe defaults provided)
db = mysql.connector.connect(
    host=os.environ.get('DB_HOST', 'localhost'),
    user=os.environ.get('DB_USER', 'root'),
    password=os.environ.get('DB_PASS', 'bhoomika2003'),
    database=os.environ.get('DB_NAME', 'eduface')
)
cursor = db.cursor(dictionary=True)

today = date.today()

# Get students with NO attendance today
cursor.execute("""
SELECT s.id, s.name, s.usn, s.parent_number
FROM students s
LEFT JOIN attendance a ON s.id = a.student_id AND a.date=%s
WHERE a.id IS NULL
""", (today,))

absent_students = cursor.fetchall()

for stu in absent_students:
    cursor.execute("""
        INSERT INTO attendance (student_id, date, status)
        VALUES (%s, %s, %s)
    """, (stu["id"], today, "absent"))
    db.commit()

    send_whatsapp(
        f"❗ ABSENT NOTICE\n{stu['name']} ({stu['usn']}) has not attended today.",
        stu['parent_number']
    )

print(f"✅ Marked {len(absent_students)} students as ABSENT & notified parents")
