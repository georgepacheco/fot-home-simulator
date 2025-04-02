// Programa: Ethernet Shield Wiznet W5100 - Define endereço IP
// Autor: Arduino e Cia

#include <SPI.h>
#include <Ethernet.h>

// A linha abaixo permite que voce defina o endereço 
// fisico (MAC ADDRESS) da placa de rede
byte mac[] = { 0xAB, 0xCD, 0x12, 0x34, 0xFF, 0xCA };

// Os valores abaixo definem o endereço IP, gateway e máscara. 
// Configure de acordo com a sua rede.
IPAddress ip(192,168,0,100);         //Define o endereço IP
IPAddress gateway(192,168,0,1);    //Define o gateway
IPAddress subnet(255, 255, 255, 0); //Define a máscara de rede

void setup() 
{
  Ethernet.begin(mac, ip, gateway, subnet); //Inicializa o Ethernet Shield
}

void loop() {}
