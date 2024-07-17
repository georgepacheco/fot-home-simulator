# Estágio de produção
FROM nginx:alpine

# Copiar arquivos de construção para o diretório do Nginx
COPY ./build /usr/share/nginx/html

# Configuração do Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Comando de inicialização do Nginx
CMD ["nginx", "-g", "daemon off;"] 