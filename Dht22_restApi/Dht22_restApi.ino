#include <WiFi.h>
#include <WebServer.h>
#include "DHT.h"

// WiFi credentials
const char* ssid = "UPC0610838";
const char* password = "BZPEYMIP2018.1eo";

const int ledPin  = 2;

// DHT22 settings
#define DHTPIN 4  // GPIO where DHT22 is connected
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

// Create a web server on port 8080
WebServer server(8080);

// Handle GET request for temperature & humidity
void handleSensorData() {
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  // Check if the sensor reading is valid
  if (isnan(temperature) || isnan(humidity)) {
    server.send(500, "application/json", "{\"error\": \"Failed to read sensor\"}");
    return;
  }

  // Create JSON response
  String jsonResponse = "{\"temperature\": " + String(temperature) + ", \"humidity\": " + String(humidity) + "}";
  // Add CORS Headers
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
  // Send response
  server.send(200, "application/json", jsonResponse);
}

void example() {

  String temperature = "21.5";
  String humidity = "47.3";
  String jsonResponse = "{\"temperature\": " + temperature + ", \"humidity\": " + humidity + "}";
  server.send(200, "application/json", jsonResponse);
}

void turnLed() {

  String state = "";
  if(digitalRead(ledPin)){
    digitalWrite(ledPin, LOW);
    state = "low";
  }
  else{
    digitalWrite(ledPin, HIGH);
    state = "high";
  }
  String jsonResponse = "{\"state\": \"" + state + "\"}";
  // Add CORS Headers
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
  server.send(200, "application/json", jsonResponse);
}

void setup() {
  Serial.begin(115200);
  dht.begin();

  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW);

  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi!");
  Serial.print("ESP32 IP Address: ");
  Serial.println(WiFi.localIP());

  // Define REST API endpoint
  server.on("/temperature", HTTP_GET, handleSensorData);
  server.on("/example", HTTP_GET, example);
  server.on("/turnled", HTTP_GET, turnLed);



  // Start the server
  server.begin();
}

void loop() {
  server.handleClient();
}