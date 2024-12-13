import subprocess


if __name__ == '__main__':
    print('ola')
    
    # Executa o script Node.js para gerar os dados
    result = subprocess.run(
            ["node", "/FotSolid/Sensor2Gateway/dist/server.js", 'seedData.json',''], 
            check=True,
            capture_output=True,
            text=True)
    
    print (result)
    
    