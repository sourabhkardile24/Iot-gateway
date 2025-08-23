import mqtt from 'mqtt';
import { useCallback, useEffect, useState } from 'react';
import { ActuatorControl, AnalogInput, DigitalInput, HistoricalDataPoint, SensorData, SystemStatus, useMockIoTData } from './useMockIoTData';

// MQTT broker details
const MQTT_BROKER = 'ws://broker.hivemq.com:8000/mqtt'; // Using WebSocket port
const IOT_TOPIC = 'iot-gateway/data'; // Main topic for IoT data
const CLIENT_ID = `iot-gateway-app-${Math.random().toString(16).substring(2, 8)}`;

// Interface for the data received from MQTT
interface MQTTIoTData {
  sensors?: SensorData[];
  digitalInputs?: DigitalInput[];
  analogInputs?: AnalogInput[];
  actuators?: ActuatorControl[];
  systemStatus?: SystemStatus;
}

export const useIoTData = () => {
  // Use mock data as the fallback/initial state
  const mockData = useMockIoTData();
  
  // State for the actual IoT data
  const [sensors, setSensors] = useState<SensorData[]>(mockData.sensors);
  const [digitalInputs, setDigitalInputs] = useState<DigitalInput[]>(mockData.digitalInputs);
  const [analogInputs, setAnalogInputs] = useState<AnalogInput[]>(mockData.analogInputs);
  const [actuators, setActuators] = useState<ActuatorControl[]>(mockData.actuators);
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>(mockData.historicalData);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>(mockData.systemStatus);
  
  // MQTT client state
  const [client, setClient] = useState<mqtt.MqttClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to toggle actuator state
  const toggleActuator = useCallback((id: string) => {
    setActuators(prev => {
      const updatedActuators = prev.map(actuator => 
        actuator.id === id 
          ? { ...actuator, state: !actuator.state, lastChanged: new Date() }
          : actuator
      );
      
      // If we have an MQTT connection, publish the updated actuator state
      if (client && isConnected) {
        const actuator = updatedActuators.find(a => a.id === id);
        if (actuator) {
          client.publish(`${IOT_TOPIC}/actuator/${id}`, JSON.stringify({
            id: actuator.id,
            state: actuator.state,
            timestamp: new Date().toISOString()
          }));
        }
      }
      
      return updatedActuators;
    });
  }, [client, isConnected]);

  // Connect to MQTT broker
  useEffect(() => {
    // Connect to MQTT broker
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
        
        // Subscribe to IoT data topics
        mqttClient.subscribe(`${IOT_TOPIC}/#`, (err) => {
          if (err) {
            console.error('Subscription error:', err);
            setError(`Failed to subscribe: ${err.message}`);
          } else {
            console.log(`Subscribed to topic: ${IOT_TOPIC}/#`);
          }
        });
      });

      mqttClient.on('message', (topic, message) => {
        try {
          const messageStr = message.toString();
          console.log(`Received message on ${topic}: ${messageStr}`);
          
          const data = JSON.parse(messageStr) as MQTTIoTData;
          
          // Update state based on the topic and received data
          if (topic === `${IOT_TOPIC}/sensors` && data.sensors) {
            // Convert string dates to Date objects
            const processedSensors = data.sensors.map(sensor => ({
              ...sensor,
              lastUpdated: new Date(sensor.lastUpdated)
            }));
            setSensors(processedSensors);
          } else if (topic === `${IOT_TOPIC}/digitalInputs` && data.digitalInputs) {
            const processedInputs = data.digitalInputs.map(input => ({
              ...input,
              lastChanged: new Date(input.lastChanged)
            }));
            setDigitalInputs(processedInputs);
          } else if (topic === `${IOT_TOPIC}/analogInputs` && data.analogInputs) {
            const processedInputs = data.analogInputs.map(input => ({
              ...input,
              lastUpdated: new Date(input.lastUpdated)
            }));
            setAnalogInputs(processedInputs);
          } else if (topic === `${IOT_TOPIC}/actuators` && data.actuators) {
            const processedActuators = data.actuators.map(actuator => ({
              ...actuator,
              lastChanged: new Date(actuator.lastChanged)
            }));
            setActuators(processedActuators);
          } else if (topic === `${IOT_TOPIC}/systemStatus` && data.systemStatus) {
            setSystemStatus({
              ...data.systemStatus,
              lastUpdated: new Date(data.systemStatus.lastUpdated)
            });
          } else if (topic === `${IOT_TOPIC}` && data) {
            // Full update
            if (data.sensors) {
              const processedSensors = data.sensors.map(sensor => ({
                ...sensor,
                lastUpdated: new Date(sensor.lastUpdated)
              }));
              setSensors(processedSensors);
            }
            if (data.digitalInputs) {
              const processedInputs = data.digitalInputs.map(input => ({
                ...input,
                lastChanged: new Date(input.lastChanged)
              }));
              setDigitalInputs(processedInputs);
            }
            if (data.analogInputs) {
              const processedInputs = data.analogInputs.map(input => ({
                ...input,
                lastUpdated: new Date(input.lastUpdated)
              }));
              setAnalogInputs(processedInputs);
            }
            if (data.actuators) {
              const processedActuators = data.actuators.map(actuator => ({
                ...actuator,
                lastChanged: new Date(actuator.lastChanged)
              }));
              setActuators(processedActuators);
            }
            if (data.systemStatus) {
              setSystemStatus({
                ...data.systemStatus,
                lastUpdated: new Date(data.systemStatus.lastUpdated)
              });
            }
          }
          
          // Update historical data
          if (data.sensors) {
            const now = new Date();
            const newHistoricalPoints: HistoricalDataPoint[] = data.sensors.map(sensor => ({
              timestamp: now,
              sensorId: sensor.id,
              value: sensor.value
            }));
            
            setHistoricalData(prev => {
              // Keep only the last 100 data points per sensor
              const filteredPrev = prev.filter(p => {
                const sensorCount = prev.filter(dp => dp.sensorId === p.sensorId).length;
                return sensorCount < 100;
              });
              
              return [...newHistoricalPoints, ...filteredPrev];
            });
          }
          
        } catch (e) {
          console.error('Error processing MQTT message:', e);
        }
      });

      mqttClient.on('error', (err) => {
        console.error('MQTT error:', err);
        setError(`MQTT error: ${err.message}`);
      });

      mqttClient.on('disconnect', () => {
        console.log('Disconnected from MQTT broker');
        setIsConnected(false);
      });

      setClient(mqttClient);

      // Clean up on component unmount
      return () => {
        if (mqttClient) {
          mqttClient.end();
        }
      };
    } catch (err: any) {
      console.error('MQTT connection error:', err);
      setError(`Connection error: ${err.message}`);
    }
  }, []);

  // Return the data and functions
  return {
    sensors,
    digitalInputs,
    analogInputs,
    actuators,
    historicalData,
    systemStatus,
    toggleActuator,
    isConnected,
    mqttError: error
  };
};

// Format for the payload to be published to MQTT broker
export const DUMMY_PAYLOAD = JSON.stringify({
  sensors: [
    {
      id: 'temp_001',
      name: 'Ambient Temperature',
      type: 'temperature',
      value: 23.5,
      unit: '°C',
      status: 'online',
      lastUpdated: new Date().toISOString(),
      min: 18,
      max: 35
    },
    {
      id: 'hum_001',
      name: 'Humidity Sensor',
      type: 'humidity',
      value: 52.4,
      unit: '%',
      status: 'online',
      lastUpdated: new Date().toISOString(),
      min: 30,
      max: 80
    },
    {
      id: 'press_001',
      name: 'System Pressure',
      type: 'pressure',
      value: 1.3,
      unit: 'bar',
      status: 'online',
      lastUpdated: new Date().toISOString(),
      min: 0.8,
      max: 2.0
    },
    {
      id: 'flow_001',
      name: 'Water Flow Rate',
      type: 'flow',
      value: 18.2,
      unit: 'L/min',
      status: 'online',
      lastUpdated: new Date().toISOString(),
      min: 5,
      max: 30
    },
    {
      id: 'volt_001',
      name: 'Supply Voltage',
      type: 'voltage',
      value: 228.5,
      unit: 'V',
      status: 'online',
      lastUpdated: new Date().toISOString(),
      min: 200,
      max: 250
    }
  ],
  digitalInputs: [
    {
      id: 'di_001',
      name: 'Door Sensor',
      value: true,
      status: 'active',
      lastChanged: new Date().toISOString()
    },
    {
      id: 'di_002',
      name: 'Motion Detector',
      value: false,
      status: 'inactive',
      lastChanged: new Date().toISOString()
    },
    {
      id: 'di_003',
      name: 'Emergency Stop',
      value: false,
      status: 'inactive',
      lastChanged: new Date().toISOString()
    }
  ],
  analogInputs: [
    {
      id: 'ai_001',
      name: 'Analog Sensor 1',
      value: 12.5,
      unit: 'mA',
      range: { min: 4, max: 20 },
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'ai_002',
      name: 'Position Feedback',
      value: 67.8,
      unit: '%',
      range: { min: 0, max: 100 },
      lastUpdated: new Date().toISOString()
    }
  ],
  actuators: [
    {
      id: 'act_001',
      name: 'Main Pump',
      type: 'pump',
      state: true,
      status: 'online',
      lastChanged: new Date().toISOString()
    },
    {
      id: 'act_002',
      name: 'Cooling Fan',
      type: 'motor',
      state: true,
      status: 'online',
      lastChanged: new Date().toISOString()
    },
    {
      id: 'act_003',
      name: 'Valve Control',
      type: 'valve',
      state: false,
      status: 'online',
      lastChanged: new Date().toISOString()
    },
    {
      id: 'act_004',
      name: 'Emergency Light',
      type: 'switch',
      state: false,
      status: 'online',
      lastChanged: new Date().toISOString()
    }
  ],
  systemStatus: {
    gatewayConnected: true,
    sensorsConnected: 5,
    totalSensors: 5,
    activeAlarms: 0,
    actuatorsOnline: 4,
    totalActuators: 4,
    lastUpdated: new Date().toISOString()
  }
});
