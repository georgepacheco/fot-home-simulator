import time
import paho.mqtt.client as mqtt
import sys
import logging
import shutil
import send_data_server
import os

# MQTT broker settings
broker_address = sys.argv[1]
server_ip = sys.argv[2]
broker_port = 1883
topic = '#'
output_file = 'data.json'
file_path = "send-data.json"
time_send = 30


# Callback function for handling received messages
def on_message(client, userdata, message):
    with open(output_file, 'a') as file:
        logging.info(message.payload.decode() + '\n')
        file.write(message.payload.decode() + '\n')


def on_connect(client, userdata, flags, rc):
    # Subscribe to the topic
    client.subscribe(topic)


def run():
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message

    # Connect to the MQTT broker
    client.connect(broker_address, broker_port)

    # Start the MQTT network loop to handle incoming messages
    # client.loop_forever()
    while True:
        try:
            client.loop_start()
            while not exist_file(output_file):
                time.sleep(3)
            time.sleep(time_send)
            client.unsubscribe(topic)
            shutil.copy(output_file, file_path)
            send_data_server.send_file(server_ip, file_path)
            os.remove(output_file)
            os.remove(file_path)
            time.sleep(5)
            client.subscribe(topic)
        except Exception as err:
            logging.info(err)


def exist_file(file):
    if os.path.exists(file):
        return True
    else:
        return False


if __name__ == '__main__':
    logging.basicConfig(filename='./python.log', level=logging.INFO)
    logging.info("Server: " + server_ip)
    logging.info("Broker: " + broker_address)
    run()

