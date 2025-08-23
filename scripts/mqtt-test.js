// mqtt-test.js
// This script demonstrates connecting to an MQTT broker, subscribing to a topic,
// and publishing a message to that topic.

const mqtt = require('mqtt');

// MQTT broker connection details - using HiveMQ's public broker
const BROKER_URL = 'mqtt://broker.hivemq.com:1883';
const TEST_TOPIC = 'iot-gateway/test/sensor-data';
const CLIENT_ID = `mqtt-test-${Math.random().toString(16).substring(2, 8)}`;

// Sample message payload
const samplePayload = JSON.stringify({
  deviceId: 'device-001',
  timestamp: new Date().toISOString(),
  readings: {
    temperature: 24.5,
    humidity: 45.2,
    pressure: 1013.25,
    batteryLevel: 87
  },
  status: 'online'
});

console.log('MQTT Test Client');
console.log('================');
console.log(`Connecting to broker: ${BROKER_URL}`);
console.log(`Client ID: ${CLIENT_ID}`);
console.log(`Topic: ${TEST_TOPIC}`);
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
  
  // Subscribe to test topic
  client.subscribe(TEST_TOPIC, (err) => {
    if (err) {
      console.error('Subscription error:', err);
      return;
    }
    console.log(`Subscribed to topic: ${TEST_TOPIC}`);
    
    // Publish sample message
    console.log('Publishing sample message...');
    client.publish(TEST_TOPIC, samplePayload, { qos: 1 }, (err) => {
      if (err) {
        console.error('Publish error:', err);
        return;
      }
      console.log('Message published successfully');
      console.log('--------------------------');
      console.log('Sample message sent:');
      console.log(samplePayload);
      console.log('--------------------------');
      console.log('Waiting for messages...');
      console.log('Press Ctrl+C to exit');
    });
  });
});

// Handle incoming messages
client.on('message', (topic, message) => {
  const messageStr = message.toString();
  console.log(`\nReceived message on ${topic}:`);
  
  try {
    // Try to parse as JSON and display formatted
    const json = JSON.parse(messageStr);
    console.log(JSON.stringify(json, null, 2));
  } catch (e) {
    // If not JSON, display as is
    console.log(messageStr);
  }
});

// Handle errors
client.on('error', (err) => {
  console.error('MQTT error:', err);
});

// Handle reconnection attempts
client.on('reconnect', () => {
  console.log('Attempting to reconnect to MQTT broker...');
});

// Handle disconnection
client.on('close', () => {
  console.log('Disconnected from MQTT broker');
});

// Clean up on exit
process.on('SIGINT', () => {
  console.log('\nDisconnecting from MQTT broker');
  client.end(true, () => {
    console.log('MQTT client closed');
    process.exit(0);
  });
});

// Command line help
console.log('\nTo publish additional messages from another terminal:');
console.log('---------------------------------------------------');
console.log('Using the MQTT CLI tool (if installed):');
console.log(`mqtt pub -t "${TEST_TOPIC}" -h broker.hivemq.com -m "Hello from MQTT CLI"`);
console.log('\nUsing mosquitto_pub (if installed):');
console.log(`mosquitto_pub -t "${TEST_TOPIC}" -h broker.hivemq.com -m "Hello from Mosquitto"`);
console.log('');
