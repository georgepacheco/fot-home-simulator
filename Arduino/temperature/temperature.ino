// https://www.blogdarobotica.com/2020/09/29/utilizando-o-sensor-de-luminosidade-ldr-no-arduino/
// https://www-learningaboutelectronics-com.translate.goog/Articles/MQ-7-carbon-monoxide-sensor-circuit-with-arduino.php?_x_tr_sch=http&_x_tr_sl=en&_x_tr_tl=pt&_x_tr_hl=pt&_x_tr_pto=tc
// https://www.instructables.com/Guide-to-Using-MAX30102-Heart-Rate-and-Oxygen-Sens/

#include <SPI.h>
#include <Ethernet.h>
#include <PubSubClient.h>
#include <math.h>
#include <ArduinoJson.h>

#include <MAX30105.h>
#include <heartRate.h>
#include <spo2_algorithm.h>

#define NTC_PIN A0  // Pino do sensor NTC - Temperatura
#define LDR_PIN A1  // Pino do sensor LDR - Luminosidade
#define MQ7_PIN A2  // Pino do sensor MQ7 - Gas
#define BPM_PIN A3  // Pino do sensor MX30102 - BPM
#define SPO2_PIN A4  // Pino do sensor MX30102 - SPO2

// int ThermistorPin = 0;

// 📌 Configuração do Shield Ethernet W5100 (IP Fixo)
byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };  // Endereço MAC fictício
IPAddress ip(192, 168, 0, 100);                       // 🔥 Altere conforme sua rede
IPAddress gateway(192, 168, 0, 1);
IPAddress subnet(255, 255, 255, 0);
EthernetClient ethClient;

// Configuração do MQTT
const char* mqttServer = "192.168.0.111";  // Altere para o IP do seu broker MQTT
const int mqttPort = 1883;
PubSubClient client(ethClient);

const int timeCollect = 30000;
const int timePublish = 30000;
// const float latitude = -12.999903872390929;
// const float longitude = -38.50728049190718;


void setup() {
  // Serial.begin(9600);
  Serial.begin(115200);

  // Inicializa a Ethernet
  Ethernet.begin(mac, ip, gateway, gateway, subnet);

  // Aguarda a conexão com a rede
  delay(1000);
  Serial.print("IP do Arduino: ");
  Serial.println(Ethernet.localIP());

  // Configura o servidor MQTT
  client.setServer(mqttServer, mqttPort);

  // Tenta conectar ao broker MQTT
  connectToMQTT();
}

void loop() {
  // Verifica se está conectado ao MQTT, caso contrário, tenta reconectar
  if (!client.connected()) {
    connectToMQTT();
  }

  // Processa as mensagens MQTT recebidas
  client.loop();

  sendTemperature();

  sendLuminosidade();

  sendGas();

  delay(timeCollect);  // Intervalo de envio em ms
}

// 📌 Função para conectar ao MQTT
void connectToMQTT() {
  client.setBufferSize(512);
  while (!client.connected()) {
    Serial.print("Conectando ao MQTT... ");
    if (client.connect("MeuClienteArduino")) {  // Nome personalizado
      Serial.println("Conectado!");
    } else {
      Serial.print("Falha, código: ");
      Serial.println(client.state());
      delay(5000);
    }
  }
}

void sendGas() {
  int mq7value = analogRead(MQ7_PIN);  // Lê o valor do LDR
  char value[6];
  itoa(mq7value, value, 10);

  char jsonDataGas[512];
  char deviceId[5] = "sc03";
  Serial.println(deviceId);

  char topic[20];
  snprintf(topic, 20, "dev/%s", deviceId);
  Serial.println(topic);

  // Gerar JSON
  buildFlowData(jsonDataGas, "gasSensor", deviceId, "48439", value);

  Serial.print("Enviando JSON: ");
  Serial.println(jsonDataGas);

  Serial.print("Tamanho do JSON: ");
  Serial.println(strlen(jsonDataGas));

  // Publicando no tópico MQTT
  bool success = client.publish(topic, jsonDataGas);

  if (success) {
    Serial.println("Publicação Luminosidade no MQTT bem-sucedida!");
  } else {
    Serial.println("Erro ao publicar Luminosidade no MQTT.");
  }
}

// Função para medir luminosidade e enviar JSON via MQTT
void sendLuminosidade() {

  int ldrValue = analogRead(LDR_PIN);  // Lê o valor do LDR
  char value[4];
  itoa(ldrValue, value, 10);

  char jsonDataLum[512];
  char deviceId[5] = "sc02";
  Serial.println(deviceId);

  char topic[20];
  snprintf(topic, 20, "dev/%s", deviceId);
  Serial.println(topic);

  // Gerar JSON
  buildFlowData(jsonDataLum, "luminositySensor", deviceId, "48439", value);

  Serial.print("Enviando JSON: ");
  Serial.println(jsonDataLum);

  Serial.print("Tamanho do JSON: ");
  Serial.println(strlen(jsonDataLum));

  // Publicando no tópico MQTT
  bool success = client.publish(topic, jsonDataLum);

  if (success) {
    Serial.println("Publicação Luminosidade no MQTT bem-sucedida!");
  } else {
    Serial.println("Erro ao publicar Luminosidade no MQTT.");
  }
}

// Função para medir temperatura e enviar JSON via MQTT
void sendTemperature() {

  float R1 = 10000;
  float logR2, R2, T, Tc, Tf;
  float c1 = 1.009249522e-03, c2 = 2.378405444e-04, c3 = 2.019202697e-07;
  int Vo = analogRead(NTC_PIN);

  R2 = R1 * (1023.0 / (float)Vo - 1.0);
  logR2 = log(R2);
  T = (1.0 / (c1 + c2 * logR2 + c3 * logR2 * logR2 * logR2));
  Tc = T - 273.15;
  char tempStr[8];
  dtostrf(Tc, 5, 2, tempStr);

  char jsonDataTemp[512];  // Buffer suficientemente grande para armazenar o JSON
  char deviceId[5] = "sc01";
  Serial.println(deviceId);

  char topic[20];
  snprintf(topic, 20, "dev/%s", deviceId);
  Serial.println(topic);

  // Gerar JSON
  buildFlowData(jsonDataTemp, "environmentTemperatureSensor", deviceId, "48439", tempStr);

  // char* jsonData = buildFlowData("environmentTemperatureSensor", "sc01", "12345", tempStr);
  Serial.print("Enviando JSON: ");
  Serial.println(jsonDataTemp);

  Serial.print("Tamanho do JSON: ");
  Serial.println(strlen(jsonDataTemp));

  // Publicando no tópico MQTT
  bool success = client.publish(topic, jsonDataTemp);

  if (success) {
    Serial.println("Publicação MQTT bem-sucedida!");
  } else {
    Serial.println("Erro ao publicar no MQTT.");
  }
}

void buildFlowData(char* jsonBuffer, char* sensorType, char* deviceId, char* userId, char* value) {

  snprintf(jsonBuffer, 512,
           "{\"code\":\"post\",\"method\":\"flow\","
           "\"header\":{\"sensor\":\"%s\",\"device\":\"%s\","
           "\"time\":{\"collect\":%d,\"publish\":%d},"
           "\"location\":{\"lat\":-12.9999038034,\"long\":-38.5072864562},"
           "\"user_id\":\"%s\"},"
           "\"data\":[\"%s\",\"%s\"],"
           "\"datetime_pub\":\"\"}",
           sensorType, deviceId, timeCollect, timePublish, userId, value, value);
}
