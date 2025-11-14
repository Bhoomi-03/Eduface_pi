"""
Safe motor test for Raspberry Pi (EduFace project)

IMPORTANT SAFETY NOTES (read before running):
- DO NOT connect a DC motor directly to a Raspberry Pi GPIO pin. Doing so can
  permanently damage your Pi.
- Use one of the following driver options:
    * A relay module rated for your motor voltage/current (GPIO drives relay input)
    * An H-bridge or motor driver board (L298N, TB6612FNG, etc.)
    * An N-channel logic-level MOSFET or NPN transistor + flyback diode when
      running the motor in one direction only.
- Motor power must come from a separate power supply (battery or DC adapter)
  that matches the motor voltage. Tie the supply ground to the Pi ground.
- Always place a flyback diode across the motor terminals (e.g., 1N400x)
  to protect the driver from voltage spikes.

Wiring examples (single-direction using MOSFET):
  Pi (GPIO 17) ----> Gate (with 100-220 ohm series resistor)
  Pi GND ----------+----------------- GND (motor supply)
                    |
  Motor + ----+---- +V (external supply)
             |
  Motor - ----+---- Drain (MOSFET)
                Source ----> GND
  Flyback diode: cathode to +V, anode to motor-

Wiring examples using a relay module:
  Pi (GPIO 17) ----> Relay IN
  Relay VCC -------> 5V (or as module requires)
  Relay GND -------> Pi GND
  Motor + ---------> External +V
  Motor - ---------> Relay COM / NO depending on wiring

This script toggles the control pin ON and OFF every few seconds. If you have
a MOSFET or driver that supports PWM, you can enable PWM mode for speed control.

Run: sudo python3 motor_test_safe.py

"""

import RPi.GPIO as GPIO
import time
import argparse

# Default control pin (BCM numbering)
CONTROL_PIN = 17

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)


def main(on_time, off_time, use_pwm, pwm_freq, duty_cycle):
    GPIO.setup(CONTROL_PIN, GPIO.OUT)

    if use_pwm:
        pwm = GPIO.PWM(CONTROL_PIN, pwm_freq)
        pwm.start(0)
        try:
            print("[INFO] PWM mode enabled. Applying duty cycle.")
            while True:
                print(f"Motor ON (PWM {duty_cycle}% for {on_time}s)")
                pwm.ChangeDutyCycle(duty_cycle)
                time.sleep(on_time)

                print(f"Motor OFF for {off_time}s")
                pwm.ChangeDutyCycle(0)
                time.sleep(off_time)

        except KeyboardInterrupt:
            pass
        finally:
            pwm.ChangeDutyCycle(0)
            pwm.stop()

    else:
        try:
            while True:
                print(f"Motor ON for {on_time}s")
                GPIO.output(CONTROL_PIN, GPIO.HIGH)
                time.sleep(on_time)

                print(f"Motor OFF for {off_time}s")
                GPIO.output(CONTROL_PIN, GPIO.LOW)
                time.sleep(off_time)

        except KeyboardInterrupt:
            pass

    GPIO.output(CONTROL_PIN, GPIO.LOW)
    GPIO.cleanup()
    print("[INFO] Test ended, GPIO cleaned up")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Safe motor test for Raspberry Pi')
    parser.add_argument('--on', type=float, default=5.0, help='motor ON time in seconds')
    parser.add_argument('--off', type=float, default=3.0, help='motor OFF time in seconds')
    parser.add_argument('--pwm', action='store_true', help='use PWM mode (requires MOSFET/driver)')
    parser.add_argument('--freq', type=int, default=1000, help='PWM frequency in Hz')
    parser.add_argument('--duty', type=float, default=80.0, help='PWM duty cycle (0-100)')
    args = parser.parse_args()

    print("[INFO] Starting motor_test_safe.py")
    print("[WARNING] Ensure wiring is correct and motor is powered by external supply.")
    print("[WARNING] Do NOT connect motor directly to GPIO pins.")

    main(args.on, args.off, args.pwm, args.freq, args.duty)
