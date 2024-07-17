#!/bin/bash

# Limpar pasta dist, se já existir
echo "Limpando pasta dist..."
rm -rf dist

echo "Pasta dist limpa com sucesso."

echo "Gerando build do projeto..."

# Gerar build do projeto NestJS
yarn build

# Verificar se o build foi gerado com sucesso
if [ $? -eq 0 ]; then
    echo "Build gerado com sucesso."

    # Copiar a pasta para a pasta dist
    cp -r nginx.conf dist
    cp -r Dockerfile dist
    cp -r docker-compose.yml dist

    echo "Pasta e seus arquivos copiados para a pasta dist."

    # Solicitar confirmação do usuário
    read -p "Deseja copiar a pasta dist para o servidor remoto? (yes/no): " confirmacao

    if [ "$confirmacao" = "yes" ]; then
        # Copiar a pasta dist usando SCP com chave SSH
        scp -r -i ~/.ssh/id_ed25519 dist/* URL_SERVIDOR_AMAZON:DIRETORIO_SERVIDOR

        echo "Pasta dist copiada para o servidor remoto usando SCP."
    else
        echo "Operação cancelada pelo usuário."
    fi
else
    echo "Erro ao gerar o build."
    exit 1
fi
