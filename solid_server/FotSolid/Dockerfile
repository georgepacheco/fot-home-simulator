# Estágio de produção
FROM georgepacheco/solid-server:7.1.1

# Instale o Nginx
RUN apt-get update && apt-get install -y nginx

# Adicione o usuário nginx
RUN useradd -r -d /var/cache/nginx/ -s /sbin/nologin -U nginx

# Remova o site padrão do Nginx e copie a configuração personalizada
RUN rm /etc/nginx/sites-enabled/default
# COPY nginx.conf /etc/nginx/nginx.conf

# # Crie os diretórios necessários para o Nginx
# RUN mkdir -p /run/nginx
# RUN mkdir -p /var/www/html

# Crie os diretórios necessários para o Nginx e ajuste permissões
RUN mkdir -p /run/nginx && chown -R nginx:nginx /run/nginx
RUN mkdir -p /var/www/html && chown -R nginx:nginx /var/www/html

# Copiar arquivos de construção para o diretório do Nginx
# COPY ./fot-solid-dash/build /usr/share/nginx/html/fot-solid-dash
# COPY ./health-application/build /usr/share/nginx/html/health-application

WORKDIR /community-server

# Comando de inicialização do Nginx
# CMD ["nginx", "-g", "daemon off;"]
# CMD ["sh", "-c", "nginx -g 'daemon off;'"]