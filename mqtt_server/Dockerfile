FROM ubuntu:20.04
WORKDIR /mqtt-server

#COPY ./mosquitto-no-auth.conf ./

#define o timeZone
RUN ln -snf /usr/share/zoneinfo/$(curl https://ipapi.co/timezone) /etc/localtime

#instala dependencias da aplicacao
RUN apt-get update && apt-get install -y \
    tzdata \
    curl \
    ifupdown \
    iproute2 \
    iptables \
    iputils-ping \
    net-tools \
    openvswitch-switch \
    openvswitch-testcontroller \
    tcpdump \
    x11-xserver-utils \
    systemd \
    xterm \
    mosquitto-clients \
    dnsutils \
    netcat \
    mosquitto \
    openssh-server \
    python3-pip
#RUN npm install -g @solid/community-server

ENTRYPOINT "/bin/bash"
