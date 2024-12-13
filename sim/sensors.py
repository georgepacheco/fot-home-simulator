import random

# This shows two examples of simulated sensors which can be used to test
# the TATU protocol on SOFT-IoT or with a standalone MQTT broker
#
# There are samples of real sensors implementations in the src/sensorsExamples
# folder. You can adapt those examples to your needs.


# The name of sensors functions should be exactly the same as in config.json


def humiditySensor():
    return random.randint(10, 90)

def temperatureSensor():
    return random.randint(20, 45)

def environmentTemperatureSensor():
	return random.randint (20, 45)

def soilmoistureSensor():
    return random.randint(0,1023)

def heartRateSensor ():
	return random.randint (50, 200)

def bloodPressureSensor ():
	return random.randint (0, 200)

def diastolicBloodPressureSensor ():
	return random.randint (0, 200)

def systolicBloodPressureSensor ():
	return random.randint (0, 200)

def sweatingSensor ():
	return bool(random.randint(0, 1))

def shiveringSensor ():
	return bool(random.randint(0, 1))

def bodyTemperatureSensor ():
	return random.randint (33, 41)

def ecgmonitor ():
	return random.randint (50, 200)

def glucometerSensor ():
	return random.randint (100, 500)

def oxymeterSensor ():
	return random.randint (0, 100)
	
def smokeSensor():
    return random.randint(300, 3000)

def ledActuator(s = None):
	if s==None:
		return bool(random.randint(0, 1))
	else:
		if s:
			print("1")
		else:
			print("0")
		return s
