import RPi.GPIO as GPIO
import time

SERVO_PIN = 18

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup(SERVO_PIN, GPIO.OUT)

pwm = GPIO.PWM(SERVO_PIN, 50)  # 50 Hz PWM
pwm.start(0)

def set_angle(angle):
    duty = 2.5 + (angle / 18)
    GPIO.output(SERVO_PIN, True)
    pwm.ChangeDutyCycle(duty)
    time.sleep(1)
    GPIO.output(SERVO_PIN, False)
    pwm.ChangeDutyCycle(0)

try:
    print("Moving servo to 0°")
    set_angle(0)
    time.sleep(1)
    print("Moving servo to 90°")
    set_angle(90)
    time.sleep(1)
    print("Moving servo to 180°")
    set_angle(180)
    time.sleep(1)
finally:
    pwm.stop()
    GPIO.cleanup()
