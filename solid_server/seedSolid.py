import subprocess
import os
import logging


if __name__ == '__main__':

        logging.basicConfig(filename='./python.log', 
                        level=logging.INFO,
                        format='%(asctime)s %(levelname)s %(message)s')
        logger = logging.getLogger(__name__)

        logging.info("No seed Solid...")



        print ("Hello")
        try:
                env = os.environ.copy()
                env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0"

                result = subprocess.run(
                        ["node", "FotSolid/Sensor2Gateway/dist/server.js", 'seedData.json',''], 
                        check=True,
                        capture_output=True,
                        text=True,
                        env=env)
                logging.info("%s",result.stdout)
        except Exception as err:
                logging.info ("%s", err)
