// mqtt-publisher.js
// A utility script for publishing IoT data to the MQTT broker

const mqtt = require('mqtt');

// MQTT broker connection details
const BROKER_URL = 'ws://broker.hivemq.com:8000/mqtt'; // Using WebSocket port
const IOT_TOPIC = 'iot-gateway/data';
const CLIENT_ID = `mqtt-publisher-${Math.random().toString(16).substring(2, 8)}`;

// Generate a sample IoT data payload
const generateSampleData = () => {
  const now = new Date().toISOString();
  
  return {
    sensors: [
      {
        id: 'temp_001',
        name: 'Ambient Temperature',
        type: 'temperature',
        value: 20 + Math.random() * 10, // 20-30°C
        unit: '°C',
        status: 'online',
        lastUpdated: now,
        min: 18,
        max: 35
      },
      {
        id: 'hum_001',
        name: 'Humidity Sensor',
        type: 'humidity',
        value: 40 + Math.random() * 30, // 40-70%
        unit: '%',
        status: 'online',
        lastUpdated: now,
        min: 30,
        max: 80
      },
      {
        id: 'press_001',
        name: 'System Pressure',
        type: 'pressure',
        value: 1 + Math.random() * 0.8, // 1-1.8 bar
        unit: 'bar',
        status: 'online',
        lastUpdated: now,
        min: 0.8,
        max: 2.0
      },
      {
        id: 'flow_001',
        name: 'Water Flow Rate',
        type: 'flow',
        value: 10 + Math.random() * 15, // 10-25 L/min
        unit: 'L/min',
        status: 'online',
        lastUpdated: now,
        min: 5,
        max: 30
      },
      {
        id: 'volt_001',
        name: 'Supply Voltage',
        type: 'voltage',
        value: 220 + Math.random() * 20, // 220-240V
        unit: 'V',
        status: 'online',
        lastUpdated: now,
        min: 200,
        max: 250
      }
    ],
    digitalInputs: [
      {
        id: 'di_001',
        name: 'Door Sensor',
        value: Math.random() > 0.5,
        status: Math.random() > 0.5 ? 'active' : 'inactive',
        lastChanged: now
      },
      {
        id: 'di_002',
        name: 'Motion Detector',
        value: Math.random() > 0.7,
        status: Math.random() > 0.7 ? 'active' : 'inactive',
        lastChanged: now
      },
      {
        id: 'di_003',
        name: 'Emergency Stop',
        value: Math.random() > 0.9,
        status: Math.random() > 0.9 ? 'active' : 'inactive',
        lastChanged: now
      }
    ],
    analogInputs: [
      {
        id: 'ai_001',
        name: 'Analog Sensor 1',
        value: 4 + Math.random() * 16, // 4-20mA
        unit: 'mA',
        range: { min: 4, max: 20 },
        lastUpdated: now
      },
      {
        id: 'ai_002',
        name: 'Position Feedback',
        value: Math.random() * 100, // 0-100%
        unit: '%',
        range: { min: 0, max: 100 },
        lastUpdated: now
      }
    ],
    actuators: [
      {
        id: 'act_001',
        name: 'Main Pump',
        type: 'pump',
        state: Math.random() > 0.5,
        status: 'online',
        lastChanged: now
      },
      {
        id: 'act_002',
        name: 'Cooling Fan',
        type: 'motor',
        state: Math.random() > 0.3,
        status: 'online',
        lastChanged: now
      },
      {
        id: 'act_003',
        name: 'Valve Control',
        type: 'valve',
        state: Math.random() > 0.7,
        status: 'online',
        lastChanged: now
      },
      {
        id: 'act_004',
        name: 'Emergency Light',
        type: 'switch',
        state: Math.random() > 0.9,
        status: 'online',
        lastChanged: now
      }
    ],
    systemStatus: {
      gatewayConnected: Math.random() > 0.1, // 90% chance of being connected
      sensorsConnected: Math.floor(Math.random() * 2) + 4, // 4-5
      totalSensors: 5,
      activeAlarms: Math.floor(Math.random() * 3), // 0-2
      actuatorsOnline: Math.floor(Math.random() * 2) + 3, // 3-4
      totalActuators: 4,
      lastUpdated: now
    }
  };
};

console.log('IoT Data MQTT Publisher');
console.log('=====================');
console.log(`Connecting to broker: ${BROKER_URL}`);
console.log(`Client ID: ${CLIENT_ID}`);
console.log(`Topic: ${IOT_TOPIC}`);
console.log('');

// Create client instance
const client = mqtt.connect(BROKER_URL, {
  clientId: CLIENT_ID,
  clean: true,
  connectTimeout: 5000,
  reconnectPeriod: 1000
});

// Set up event handlers
client.on('connect', () => {
  console.log('Connected to MQTT broker');
  
  // Publish first message immediately
  publishData();
  
  // Set up interval to publish data every 5 seconds
  const interval = setInterval(publishData, 5000);
  
  // Clean up on SIGINT (Ctrl+C)
  process.on('SIGINT', () => {
    clearInterval(interval);
    client.end(true, () => {
      console.log('\nDisconnected from MQTT broker');
      process.exit(0);
    });
  });
});

// Function to publish data
function publishData() {
  const data = generateSampleData();
  console.log(`\n[${new Date().toLocaleTimeString()}] Publishing data to ${IOT_TOPIC}...`);
  
  client.publish(IOT_TOPIC, JSON.stringify(data), { qos: 1 }, (err) => {
    if (err) {
      console.error('Publish error:', err);
      return;
    }
    console.log('Data published successfully');
  });
}

// Handle errors
client.on('error', (err) => {
  console.error('MQTT error:', err);
});

// Handle reconnection attempts
client.on('reconnect', () => {
  console.log('Attempting to reconnect to MQTT broker...');
});
