
// https://www.blogdarobotica.com/2020/09/29/utilizando-o-sensor-de-luminosidade-ldr-no-arduino/
// https://www-learningaboutelectronics-com.translate.goog/Articles/MQ-7-carbon-monoxide-sensor-circuit-with-arduino.php?_x_tr_sch=http&_x_tr_sl=en&_x_tr_tl=pt&_x_tr_hl=pt&_x_tr_pto=tc
// https://www.instructables.com/Guide-to-Using-MAX30102-Heart-Rate-and-Oxygen-Sens/
// https://www.blogdarobotica.com/2022/06/30/projeto-medir-a-umidade-e-temperatura-com-o-sensor-dht11/
// https://blogmasterwalkershop.com.br/arduino/como-usar-com-arduino-sensor-microondas-rcwl-0516-detector-de-movimento
// https://www.blogdarobotica.com/2023/08/21/como-utilizar-o-sensor-de-batimento-cardiaco-monitor-de-pulso-com-arduino/
// https://www.instructables.com/How-to-Build-a-DIY-WiFi-Smart-Oximeter-Using-MAX30/


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

const int timeCollect = 15000;
const int timePublish = 15000;
// const float latitude = -12.999903872390929;
// const float longitude = -38.50728049190718;

unsigned long lastCollectTime = 0;

bool estadoAnterior = LOW;
unsigned long lastCheckTime = 0;           // Tempo da última verificação
const unsigned long checkInterval = 3000;  // Tempo entre verificações


// BPM
// #define irThreshold 50000  // Valor IR mínimo para detectar o dedo


void setup() {
  Serial.begin(9600);
    
  if (!particleSensor.begin(Wire, I2C_SPEED_STANDARD)) {
    Serial.println(F("Sensor MAX30102 não encontrado. Verifique conexões!"));
    while (1);
  }

  particleSensor.setup(
      60,   // LED brightness
      4,    // Sample average
      2,    // Mode: Red + IR
      100,  // Sample rate
      411,  // Pulse width
      4096  // ADC range
    );

  // Inicializa a Ethernet
  Ethernet.begin(mac, ip, gateway, gateway, subnet);

  // inicializa DHT11
  dht.begin();

  pinMode(RCWL, INPUT);  //DEFINE O PINO COMO ENTRADA

  // Aguarda a conexão com a rede
  delay(1000);
  // Serial.print("IP do Arduino: ");
  // Serial.println(Ethernet.localIP());

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

  // Processa as mensagens MQTT recebidas - Mantem o MQTT ativo
  client.loop();

  // Monitoramento BPM
  sendBPM();


  // delay(timeCollect);  // Intervalo de envio em ms
}

// 📌 Função para conectar ao MQTT
void connectToMQTT() {
  client.setBufferSize(512);
  while (!client.connected()) {
    Serial.print(F("Conectando ao MQTT... "));
    if (client.connect("MeuClienteArduino")) {  // Nome personalizado
      Serial.println(F("Conectado!"));
    } else {
      Serial.print("Falha, código: ");
      Serial.println(client.state());
      delay(5000);
    }
  }
}

void sendBPM() {
  int32_t spo2;
  int8_t validSPO2;
  int32_t heartRate;
  int8_t validHeartRate;
  uint16_t irBuffer[50];
  uint16_t redBuffer[50];

  while (particleSensor.getIR() < 50000) {
    Serial.print(".");
    delay(200);
  }

  Serial.println(F("\nDedo detectado. Iniciando medição de 20 segundos..."));

  // Coleta 50 amostras (com IR acima do threshold)
  for (int i = 0; i < 50; i++) {
    // Verifica se o dedo ainda está presente
    while (particleSensor.available() == false)
      particleSensor.check();

    uint32_t ir = particleSensor.getIR();
    uint32_t red = particleSensor.getRed();

    // Se o dedo foi removido, cancela a leitura
    if (ir < 50000) {
      Serial.println(F("Dedo removido antes do fim. Medição cancelada."));
      return;
    }

    irBuffer[i] = ir;
    redBuffer[i] = red;
    particleSensor.nextSample();

    delay(20); // ~100 Hz
  }
  // Após coleta de 100 amostras (≈20s), calcula SpO2 e BPM
  maxim_heart_rate_and_oxygen_saturation(
    irBuffer, 50,
    redBuffer,
    &spo2, &validSPO2,
    &heartRate, &validHeartRate
  );
  Serial.print("BPM: "), Serial.println(heartRate);
  Serial.print("SpO2: "), Serial.println(spo2);

  Serial.println("\n--- RESULTADO ---");
  if (validHeartRate)
    Serial.print("BPM: "), Serial.println(heartRate);
  else
    Serial.println("BPM inválido");

  if (validSPO2)
    Serial.print("SpO2: "), Serial.println(spo2);
  else
    Serial.println("SpO2 inválido");

}

void sendPresenca() {

  if (millis() - lastCheckTime >= checkInterval) {
    lastCheckTime = millis();  // Atualiza o tempo da última verificação

    bool estadoAtual = digitalRead(RCWL);  // Lê o estado atual do sensor
    char jsonDataPresenca[512];
    char deviceId[5] = "sc05";

    if (estadoAtual != estadoAnterior) {  // Se houve mudança de estado
      if (estadoAtual == HIGH) {
        Serial.println("🔵 Movimento detectado!");        
      } else {
        Serial.println("⚪ Movimento cessou.");
      }
      char stateStr[2];
      dtostrf(estadoAtual, 1, 0, stateStr);

      char topic[20];
      snprintf(topic, 20, "dev/%s", deviceId);
      Serial.println(topic);
      buildFlowData(jsonDataPresenca, "presenceSensor", deviceId, "48439", stateStr);
      
      // Publicando no tópico MQTT
      bool success = client.publish(topic, jsonDataPresenca);

      estadoAnterior = estadoAtual;  // Atualiza o estado anterior
    }
  }
}

void sendTemperature() {
  float temp = dht.readTemperature();  // Celsius
  Serial.println(temp);
  if (isnan(temp)) {
    Serial.println("Erro ao ler do sensor DHT!");
    return;
  }

  char tempStr[8];
  dtostrf(temp, 5, 2, tempStr);

  char jsonDataTemp[512];
  char deviceId[5] = "sc01";
  // Serial.println(deviceId);

  char topic[20];
  snprintf(topic, 20, "dev/%s", deviceId);
  Serial.println(topic);

  // Gerar JSON
  buildFlowData(jsonDataTemp, "environmentTemperatureSensor", deviceId, "48439", tempStr);

  Serial.print("Enviando JSON: ");
  Serial.println(jsonDataTemp);

  // Serial.print("Tamanho do JSON: ");
  // Serial.println(strlen(jsonDataTemp));

  // Publicando no tópico MQTT
  bool success = client.publish(topic, jsonDataTemp);

  // if (success) {
  //   Serial.println("Publicação Temperatura no MQTT bem-sucedida!");
  // } else {
  //   Serial.println("Erro ao publicar Temperatura no MQTT.");
  // }
}

void buildFlowData(char* jsonBuffer, char* sensorType, char* deviceId, char* userId, char* value) {

  snprintf(jsonBuffer, 512,
           "{\"code\":\"post\",\"method\":\"flow\","
           "\"header\":{\"sensor\":\"%s\",\"device\":\"%s\","
           "\"time\":{\"collect\":%d,\"publish\":%d},"
           "\"location\":{\"lat\":-12.999903,\"long\":-38.507286},"
           "\"user_id\":\"%s\"},"
           "\"data\":[\"%s\",\"%s\"],"
           "\"datetime_pub\":\"\"}",
           sensorType, deviceId, timeCollect, timePublish, userId, value, value);
}
