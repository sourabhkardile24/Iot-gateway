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
      value: 0,
      unit: '°C',
      status: 'online',
      lastUpdated: null,
      min: 0,
      max: 0
    },
    {
      id: 'hum_001',
      name: 'Humidity Sensor',
      type: 'humidity',
      value: 0,
      unit: '%',
      status: 'online',
      lastUpdated: null,
      min: 0,
      max: 0
    },
    {
      id: 'press_001',
      name: 'System Pressure',
      type: 'pressure',
      value: 0,
      unit: 'bar',
      status: 'online',
      lastUpdated: null,
      min: 0,
      max: 0
    },
    {
      id: 'flow_001',
      name: 'Water Flow Rate',
      type: 'flow',
      value: 0,
      unit: 'L/min',
      status: 'online',
      lastUpdated: null,
      min: 0,
      max: 0
    },
    {
      id: 'volt_001',
      name: 'Supply Voltage',
      type: 'voltage',
      value: 0,
      unit: 'V',
      status: 'online',
      lastUpdated: null,
      min: 0,
      max: 0
    }
  ],
  digitalInputs: [
    {
      id: 'di_001',
      name: 'Door Sensor',
      value: false,
      status: 'inactive',
      lastChanged: null
    },
    {
      id: 'di_002',
      name: 'Motion Detector',
      value: false,
      status: 'inactive',
      lastChanged: null
    },
    {
      id: 'di_003',
      name: 'Emergency Stop',
      value: false,
      status: 'inactive',
      lastChanged: null
    }
  ],
  analogInputs: [
    {
      id: 'ai_001',
      name: 'Analog Sensor 1',
      value: 0,
      unit: 'mA',
      range: { min: 0, max: 0 },
      lastUpdated: null
    },
    {
      id: 'ai_002',
      name: 'Position Feedback',
      value: 0,
      unit: '%',
      range: { min: 0, max: 0 },
      lastUpdated: null
    }
  ],
  actuators: [
    {
      id: 'act_001',
      name: 'Main Pump',
      type: 'pump',
      state: false,
      status: 'online',
      lastChanged: null
    },
    {
      id: 'act_002',
      name: 'Cooling Fan',
      type: 'motor',
      state: false,
      status: 'online',
      lastChanged: null
    },
    {
      id: 'act_003',
      name: 'Valve Control',
      type: 'valve',
      state: false,
      status: 'online',
      lastChanged: null
    },
    {
      id: 'act_004',
      name: 'Emergency Light',
      type: 'switch',
      state: false,
      status: 'online',
      lastChanged: null
    }
  ],
  systemStatus: {
    gatewayConnected: false,
    sensorsConnected: 0,
    totalSensors: 0,
    activeAlarms: 0,
    actuatorsOnline: 0,
    totalActuators: 0,
    lastUpdated: null
  }
});
