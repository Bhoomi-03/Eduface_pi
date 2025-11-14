import requests

API_KEY = "Ch3DWLczEB1kOTAVQFeKarwuJ0id7sgI9bUjNnZxloM2tm6pfPwCe7iISXkgy6acuG3T8LvHb2ZQzmpF"   # <-- we will replace this after saving

def send_sms(message, phone):
    url = "https://www.fast2sms.com/dev/bulkV2"
    params = {
        "authorization": API_KEY,
        "message": message,
        "language": "english",
        "route": "q",
        "numbers": phone
    }
    try:
        requests.get(url, params=params)
        print(f"📨 SMS Sent to {phone}")
    except Exception as e:
        print(f"❌ SMS Failed: {e}")
