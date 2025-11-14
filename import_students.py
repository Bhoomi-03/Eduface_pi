import csv
import os
import mysql.connector

# Read DB credentials from environment with safe defaults
db = mysql.connector.connect(
    host=os.environ.get('DB_HOST', 'localhost'),
    user=os.environ.get('DB_USER', 'root'),
    password=os.environ.get('DB_PASS', 'bhoomika2003'),
    database=os.environ.get('DB_NAME', 'eduface')
)

cursor = db.cursor()

csv_path = "/home/pi/EduFace/Students_details.csv"
  # <-- change if CSV name is different

with open(csv_path, 'r') as file:
    reader = csv.DictReader(file)
    for row in reader:
        cursor.execute("""
            INSERT INTO students (name, usn, parent_number, section, department, sem, dataset_folder)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            row['NAME'],
            row['USN'],
            row['PARENT_NUMBER'],
            row['SECTION'],
            row['DEPARTMENT'],
            row['SEM'],
            row['DATASET_PATH']
        ))

db.commit()
cursor.close()
db.close()

print("✅ Successfully Imported Student Records")
