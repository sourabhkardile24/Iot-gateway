import mqtt from 'mqtt';
import { useCallback, useEffect, useState } from 'react';

// MQTT broker connection details
// Using HiveMQ's public test broker for demonstration
const MQTT_BROKER = 'mqtt://broker.hivemq.com:1883';
const TEST_TOPIC = 'iot-gateway/test/sensor-data';
const CLIENT_ID = `iot-gateway-client-${Math.random().toString(16).substring(2, 8)}`;

// Sample data to publish
export const SAMPLE_PAYLOAD = JSON.stringify({
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

interface MQTTMessage {
  topic: string;
  message: string;
  timestamp: Date;
}

export const useMQTT = () => {
  const [client, setClient] = useState<mqtt.MqttClient | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [messages, setMessages] = useState<MQTTMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Connect to the MQTT broker
  const connect = useCallback(() => {
    try {
      console.log(`Connecting to MQTT broker at ${MQTT_BROKER}...`);
      const mqttClient = mqtt.connect(MQTT_BROKER, {
        clientId: CLIENT_ID,
        clean: true,
        connectTimeout: 5000,
        reconnectPeriod: 1000
      });

      mqttClient.on('connect', () => {
        console.log('Connected to MQTT broker');
        setIsConnected(true);
        setError(null);
        
        // Subscribe to the test topic
        mqttClient.subscribe(TEST_TOPIC, (err) => {
          if (err) {
            console.error('Subscription error:', err);
            setError(`Failed to subscribe: ${err.message}`);
          } else {
            console.log(`Subscribed to topic: ${TEST_TOPIC}`);
          }
        });
      });

      mqttClient.on('message', (topic, message) => {
        const messageStr = message.toString();
        console.log(`Received message on ${topic}: ${messageStr}`);
        
        setMessages((prev) => [
          ...prev,
          {
            topic,
            message: messageStr,
            timestamp: new Date()
          }
        ]);
      });

      mqttClient.on('error', (err) => {
        console.error('MQTT error:', err);
        setError(`MQTT error: ${err.message}`);
      });

      mqttClient.on('disconnect', () => {
        console.log('Disconnected from MQTT broker');
        setIsConnected(false);
      });

      mqttClient.on('reconnect', () => {
        console.log('Attempting to reconnect to MQTT broker');
      });

      setClient(mqttClient);
    } catch (err: any) {
      console.error('MQTT connection error:', err);
      setError(`Connection error: ${err.message}`);
    }
  }, []);

  // Disconnect from the MQTT broker
  const disconnect = useCallback(() => {
    if (client) {
      client.end();
      setClient(null);
      setIsConnected(false);
      console.log('Disconnected from MQTT broker');
    }
  }, [client]);

  // Publish a message to the specified topic
  const publish = useCallback((topic: string, message: string) => {
    if (!client || !isConnected) {
      setError('Cannot publish: not connected to MQTT broker');
      return false;
    }

    try {
      client.publish(topic, message, { qos: 1, retain: false }, (err) => {
        if (err) {
          console.error('Publish error:', err);
          setError(`Failed to publish: ${err.message}`);
          return false;
        }
        console.log(`Published to ${topic}: ${message}`);
        return true;
      });
    } catch (err: any) {
      console.error('Publish error:', err);
      setError(`Failed to publish: ${err.message}`);
      return false;
    }
  }, [client, isConnected]);

  // Subscribe to a topic
  const subscribe = useCallback((topic: string) => {
    if (!client || !isConnected) {
      setError('Cannot subscribe: not connected to MQTT broker');
      return false;
    }

    try {
      client.subscribe(topic, (err) => {
        if (err) {
          console.error('Subscription error:', err);
          setError(`Failed to subscribe: ${err.message}`);
          return false;
        }
        console.log(`Subscribed to topic: ${topic}`);
        return true;
      });
    } catch (err: any) {
      console.error('Subscribe error:', err);
      setError(`Failed to subscribe: ${err.message}`);
      return false;
    }
  }, [client, isConnected]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (client) {
        client.end();
      }
    };
  }, [client]);

  return {
    connect,
    disconnect,
    publish,
    subscribe,
    isConnected,
    messages,
    error,
  };
};

// Non-React version for direct usage
export class MQTTService {
  private client: mqtt.MqttClient | null = null;
  private isConnected: boolean = false;

  connect(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        console.log(`Connecting to MQTT broker at ${MQTT_BROKER}...`);
        this.client = mqtt.connect(MQTT_BROKER, {
          clientId: CLIENT_ID,
          clean: true,
          connectTimeout: 5000,
          reconnectPeriod: 1000
        });

        this.client.on('connect', () => {
          console.log('Connected to MQTT broker');
          this.isConnected = true;
          resolve(true);
        });

        this.client.on('error', (err) => {
          console.error('MQTT error:', err);
          reject(err);
        });

        this.client.on('disconnect', () => {
          console.log('Disconnected from MQTT broker');
          this.isConnected = false;
        });
      } catch (err) {
        console.error('MQTT connection error:', err);
        reject(err);
      }
    });
  }

  disconnect(): void {
    if (this.client) {
      this.client.end();
      this.client = null;
      this.isConnected = false;
      console.log('Disconnected from MQTT broker');
    }
  }

  subscribe(topic: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.client || !this.isConnected) {
        reject(new Error('Not connected to MQTT broker'));
        return;
      }

      this.client.subscribe(topic, (err) => {
        if (err) {
          console.error('Subscription error:', err);
          reject(err);
        } else {
          console.log(`Subscribed to topic: ${topic}`);
          resolve();
        }
      });
    });
  }

  publish(topic: string, message: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.client || !this.isConnected) {
        reject(new Error('Not connected to MQTT broker'));
        return;
      }

      this.client.publish(topic, message, { qos: 1, retain: false }, (err) => {
        if (err) {
          console.error('Publish error:', err);
          reject(err);
        } else {
          console.log(`Published to ${topic}: ${message}`);
          resolve();
        }
      });
    });
  }

  onMessage(callback: (topic: string, message: string) => void): void {
    if (!this.client) {
      throw new Error('Not connected to MQTT broker');
    }

    this.client.on('message', (topic, messageBuffer) => {
      const message = messageBuffer.toString();
      callback(topic, message);
    });
  }
}
