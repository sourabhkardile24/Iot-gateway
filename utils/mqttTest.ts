import { MQTTService, SAMPLE_PAYLOAD, useMQTT } from '../services/mqttService';

// Define the test topic
const TEST_TOPIC = 'iot-gateway/test/sensor-data';

// Function to demonstrate MQTT usage in a React component
export const MQTTExample = () => {
  const { 
    connect, 
    disconnect, 
    publish, 
    subscribe, 
    isConnected, 
    messages, 
    error 
  } = useMQTT();

  const handleConnect = () => {
    connect();
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const handlePublish = () => {
    publish(TEST_TOPIC, SAMPLE_PAYLOAD);
  };

  const handleSubscribe = () => {
    subscribe(TEST_TOPIC);
  };

  return {
    connect: handleConnect,
    disconnect: handleDisconnect,
    publish: handlePublish,
    subscribe: handleSubscribe,
    isConnected,
    messages,
    error
  };
};

// Function to test MQTT service directly
export async function testMQTTService() {
  const mqttService = new MQTTService();
  
  console.log('Starting MQTT test...');
  
  try {
    // Connect to broker
    console.log('Connecting to MQTT broker...');
    await mqttService.connect();
    
    // Subscribe to test topic
    console.log(`Subscribing to topic: ${TEST_TOPIC}`);
    await mqttService.subscribe(TEST_TOPIC);
    
    // Set up message handler
    mqttService.onMessage((topic, message) => {
      console.log(`Received message on ${topic}:`);
      console.log(message);
      
      try {
        const jsonData = JSON.parse(message);
        console.log('Parsed JSON data:', jsonData);
      } catch (e) {
        console.log('Message is not JSON format');
      }
    });
    
    // Publish a sample message
    console.log('Publishing sample message...');
    await mqttService.publish(TEST_TOPIC, SAMPLE_PAYLOAD);
    
    console.log('MQTT test completed successfully.');
    console.log('To publish your own message, use:');
    console.log(`mqtt publish -t "${TEST_TOPIC}" -h broker.hivemq.com -m "YOUR_MESSAGE_HERE"`);
    
    // Keep the connection open for a while to receive messages
    console.log('Waiting for messages (will disconnect in 30 seconds)...');
    await new Promise(resolve => setTimeout(resolve, 30000));
    
    // Disconnect
    mqttService.disconnect();
    console.log('Disconnected from MQTT broker');
    
  } catch (error) {
    console.error('MQTT test failed:', error);
  }
}

// Uncomment the line below to run the test directly if this file is executed
// testMQTTService();
