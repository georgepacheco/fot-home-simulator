import socket
import subprocess
import logging
import os
import separate_data
import json

# Usage
file_path = '../community-server/data.json'
user_data_file_path = '../solid-server/user.json'
port = 1234


def receive_file():
    users_id = []
    while True:
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
                s.bind(('0.0.0.0', port))
                s.listen()
                logging.info("Waiting for a connection...")
                conn, addr = s.accept()
                logging.info("Connection established with: %s", addr)
                try:
                    with open(file_path, 'wb') as file:
                        while True:
                            data = conn.recv(1024)
                            if not data:
                                file.close()
                                break
                            file.write(data)
                    users_id = separate_data.separate_data(file_path, user_data_file_path)
                    logging.info("%s",users_id)
                    for user in users_id:
                        save_to_solid(user)
                except Exception as err:
                    logging.info("%s", err)
        except Exception as err:
            logging.info("%s",err)

    # while True:
    #     try:
    #         with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    #             s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    #             s.bind(('0.0.0.0', port))
    #             s.listen()
    #             logging.info("Waiting for a connection...")
    #             conn, addr = s.accept()
    #             logging.info("Connection established with:", addr)
    #             try:
    #                 with open(file_path, 'wb') as file:
    #                     while True:
    #                         data = conn.recv(1024)
    #                         if not data:
    #                             file.close()
    #                             break
    #                         file.write(data)
    #                 save_to_solid()
    #             except Exception as err:
    #                 logging.info(err)
    #     except Exception as err:
    #         logging.info(err)


def exist_file(file):
    if os.path.exists(file):
        return True
    else:
        return False


def save_to_solid(user):
    logging.info("Save to solid. Starting ...")
    logging.info("User - %s", user)
    try:
        ts_file = "../solid-server/FotSolid/Sensor2Gateway/src/server.ts"

        src_dir = "../solid-server/FotSolid/Sensor2Gateway/src"
        out_dir = "../solid-server/FotSolid/Sensor2Gateway/dist"

        logging.info("ponto 1")

        # Compile TypeScript to JavaScript
        process = subprocess.Popen(['tsc', '--outDir', out_dir, ts_file], shell=True, stdout=subprocess.PIPE)

        logging.info("ponto 2")

        output, _ = process.communicate()

        logging.info("ponto 3")
        print(output)

        # Run JavaScript file
        js_file = ts_file.replace(".ts", ".js")
        js_file = js_file.replace(src_dir, out_dir)
        logging.info("ponto 4")
        logging.info("%s", js_file)    

        # data_file = "../community-server/" + user + ".json"
        
        # seed data test
        data_file = "../solid-server/seedDataTest.json"
        
        logging.info("Data_File - %s", data_file)    
        credential_file = "../community-server/" + user + "_cred.json"
        # result = subprocess.run(['node', js_file, data_file, credential_file], capture_output=True, text=True)
        
        # Copiar o ambiente existente
        env = os.environ.copy()

        # Adicionar a variável NODE_TLS_REJECT_UNAUTHORIZED
        env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0"

        # Executar o subprocess com o ambiente modificado
        result = subprocess.run(
            ['node', js_file, data_file, credential_file],
            capture_output=True,
            text=True,
            env=env  # Usar o ambiente modificado
        )

        stdout = result.stdout
        logging.info("[saída stdout] %s", stdout)

        stderr = result.stderr
        logging.info("[saída stderr] %s", stderr)

        # cwd='../solid-server/FotSolid/Sensor2Gateway')
        logging.info("ponto 5")
        logging.info("Result: %s" + str(result))

        

    except Exception as err:
        logging.info("%s", err)


if __name__ == '__main__':
    logging.basicConfig(filename='./python.log', 
                        level=logging.INFO,
                        format='%(asctime)s %(levelname)s %(message)s')
    logger = logging.getLogger(__name__)

    receive_file()
