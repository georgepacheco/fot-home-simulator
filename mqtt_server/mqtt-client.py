import time
import paho.mqtt.client as mqtt
import sys
import logging
import shutil
import send_data_server
import os
import json
from datetime import datetime
import pytz

# MQTT broker settings
broker_address = sys.argv[1]
server_ip = sys.argv[2]
broker_port = 1883
topic = '#'
output_file = 'data.json'
permanent_output_file = 'data_all.json'
file_path = "send-data.json"
time_send = 30


# # Callback function for handling received messages
# def on_message(client, userdata, message):
#     with open(output_file, 'a') as file:
#         logging.info(message.payload.decode() + '\n')
#         file.write(message.payload.decode() + '\n')

# Callback function for handling received messages
def on_message(client, userdata, message):
    try:
        # Decodifica a mensagem e converte para um dicionário
        msg_dict = json.loads(message.payload.decode())

        # Atualiza o campo 'datetime_pub' para a data e hora atuais
        # msg_dict["datetime_pub"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        tz = pytz.timezone("America/Sao_Paulo")
        msg_dict["datetime_pub"] = datetime.now(tz).strftime("%Y-%m-%d %H:%M:%S")

        # Converte novamente para JSON
        updated_message = json.dumps(msg_dict)

        # Escreve no arquivo temporario
        with open(output_file, 'a') as file:
            logging.info(updated_message + '\n')
            file.write(updated_message + '\n')
            
        # Escreve no arquivo permanente
        with open(permanent_output_file, 'a') as perm_file:
            perm_file.write(updated_message + '\n')

    except json.JSONDecodeError as e:
        logging.error(f"Erro ao decodificar JSON: {e}")

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

