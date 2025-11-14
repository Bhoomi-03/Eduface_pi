import RPi.GPIO as GPIO
import time

RELAY_PIN = 17  # <--- Change this only if you used another GPIO pin

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup(RELAY_PIN, GPIO.OUT)

print("Motor Test Started")

try:
    while True:
        print("Motor ON")
        GPIO.output(RELAY_PIN, GPIO.HIGH)
        time.sleep(5)   # Motor runs for 5 seconds

        print("Motor OFF")
        GPIO.output(RELAY_PIN, GPIO.LOW)
        time.sleep(3)   # Motor stays OFF for 3 seconds

except KeyboardInterrupt:
    pass

GPIO.output(RELAY_PIN, GPIO.LOW)
GPIO.cleanup()
print("Test Ended, GPIO Cleaned")
