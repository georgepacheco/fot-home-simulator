int ThermistorPin = 0;
const int interval = 30000;  // Intervalo de 30 segundos
const int duration = 300000; // 10 minutos = 600000 ms
const int maxReadings = 20;  // 10 minutos / 30 segundos = 20 leituras
int temperatureData[maxReadings]; // Array para armazenar as temperaturas
int index = 0;                    // Índice para armazenar valores
unsigned long startTime;

int Vo;
float R1 = 10000;
float logR2, R2, T;
float c1 = 1.009249522e-03, c2 = 2.378405444e-04, c3 = 2.019202697e-07;

void setup() {
  Serial.begin(9600);
  startTime = millis();
}

void loop() {

  Vo = analogRead(ThermistorPin);
  R2 = R1 * (1023.0 / (float)Vo - 1.0);
  logR2 = log(R2);
  T = (1.0 / (c1 + c2*logR2 + c3*logR2*logR2*logR2));
  T = T - 273.15;

  if ((millis() - startTime) / interval < maxReadings) {
    temperatureData[index] = T; // Salva na SRAM
    Serial.print("Salvando temperatura: ");
    Serial.println(T);
    index++;
    delay(interval);
  } 
  else {
    Serial.println("\n--- Exibindo os dados armazenados ---");
    for (int i = 0; i < maxReadings; i++) {
      Serial.print("Leitura ");
      Serial.print(i + 1);
      Serial.print(": ");
      Serial.println(temperatureData[i]);
    }

    Serial.println("\nLimpando dados da RAM...");
    index = 0; // Reseta o índice para armazenar novos dados
    startTime = millis(); // Reinicia o tempo
  }

  //
  //  Serial.print("Temperature: "); 
  //  Serial.print(T);
  //  Serial.println(" F"); 
  //'
  //  delay(1000);
}


