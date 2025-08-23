import { useState, useEffect, useCallback } from 'react';

export interface SensorData {
  id: string;
  name: string;
  type: 'temperature' | 'humidity' | 'pressure' | 'flow' | 'level' | 'voltage' | 'current';
  value: number;
  unit: string;
  status: 'online' | 'offline' | 'warning';
  lastUpdated: Date;
  min: number;
  max: number;
}

export interface DigitalInput {
  id: string;
  name: string;
  value: boolean;
  status: 'active' | 'inactive';
  lastChanged: Date;
}

export interface AnalogInput {
  id: string;
  name: string;
  value: number;
  unit: string;
  range: { min: number; max: number };
  lastUpdated: Date;
}

export interface ActuatorControl {
  id: string;
  name: string;
  type: 'switch' | 'valve' | 'motor' | 'pump';
  state: boolean;
  status: 'online' | 'offline';
  lastChanged: Date;
}

export interface HistoricalDataPoint {
  timestamp: Date;
  sensorId: string;
  value: number;
}

// Mock data generators
const generateSensorData = (): SensorData[] => [
  {
    id: 'temp_001',
    name: 'Ambient Temperature',
    type: 'temperature',
    value: 22.5 + Math.random() * 5,
    unit: '°C',
    status: 'online',
    lastUpdated: new Date(),
    min: 18,
    max: 35
  },
  {
    id: 'hum_001',
    name: 'Humidity Sensor',
    type: 'humidity',
    value: 45 + Math.random() * 20,
    unit: '%',
    status: 'online',
    lastUpdated: new Date(),
    min: 30,
    max: 80
  },
  {
    id: 'press_001',
    name: 'System Pressure',
    type: 'pressure',
    value: 1.2 + Math.random() * 0.5,
    unit: 'bar',
    status: 'online',
    lastUpdated: new Date(),
    min: 0.8,
    max: 2.0
  },
  {
    id: 'flow_001',
    name: 'Water Flow Rate',
    type: 'flow',
    value: 15 + Math.random() * 10,
    unit: 'L/min',
    status: 'online',
    lastUpdated: new Date(),
    min: 5,
    max: 30
  },
  {
    id: 'volt_001',
    name: 'Supply Voltage',
    type: 'voltage',
    value: 220 + Math.random() * 20,
    unit: 'V',
    status: 'online',
    lastUpdated: new Date(),
    min: 200,
    max: 250
  }
];

const generateDigitalInputs = (): DigitalInput[] => [
  {
    id: 'di_001',
    name: 'Door Sensor',
    value: Math.random() > 0.7,
    status: Math.random() > 0.7 ? 'active' : 'inactive',
    lastChanged: new Date(Date.now() - Math.random() * 3600000)
  },
  {
    id: 'di_002',
    name: 'Motion Detector',
    value: Math.random() > 0.8,
    status: Math.random() > 0.8 ? 'active' : 'inactive',
    lastChanged: new Date(Date.now() - Math.random() * 3600000)
  },
  {
    id: 'di_003',
    name: 'Emergency Stop',
    value: Math.random() > 0.95,
    status: Math.random() > 0.95 ? 'active' : 'inactive',
    lastChanged: new Date(Date.now() - Math.random() * 3600000)
  }
];

const generateAnalogInputs = (): AnalogInput[] => [
  {
    id: 'ai_001',
    name: 'Analog Sensor 1',
    value: 4 + Math.random() * 16,
    unit: 'mA',
    range: { min: 4, max: 20 },
    lastUpdated: new Date()
  },
  {
    id: 'ai_002',
    name: 'Position Feedback',
    value: Math.random() * 100,
    unit: '%',
    range: { min: 0, max: 100 },
    lastUpdated: new Date()
  }
];

const generateActuatorControls = (): ActuatorControl[] => [
  {
    id: 'act_001',
    name: 'Main Pump',
    type: 'pump',
    state: false,
    status: 'online',
    lastChanged: new Date(Date.now() - Math.random() * 3600000)
  },
  {
    id: 'act_002',
    name: 'Cooling Fan',
    type: 'motor',
    state: true,
    status: 'online',
    lastChanged: new Date(Date.now() - Math.random() * 3600000)
  },
  {
    id: 'act_003',
    name: 'Valve Control',
    type: 'valve',
    state: false,
    status: 'online',
    lastChanged: new Date(Date.now() - Math.random() * 3600000)
  },
  {
    id: 'act_004',
    name: 'Emergency Light',
    type: 'switch',
    state: false,
    status: 'online',
    lastChanged: new Date(Date.now() - Math.random() * 3600000)
  }
];

export function useMockIoTData() {
  const [sensors, setSensors] = useState<SensorData[]>(generateSensorData());
  const [digitalInputs, setDigitalInputs] = useState<DigitalInput[]>(generateDigitalInputs());
  const [analogInputs, setAnalogInputs] = useState<AnalogInput[]>(generateAnalogInputs());
  const [actuators, setActuators] = useState<ActuatorControl[]>(generateActuatorControls());
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);

  // Generate historical data
  useEffect(() => {
    const generateHistoricalData = () => {
      const data: HistoricalDataPoint[] = [];
      const now = new Date();
      
      sensors.forEach(sensor => {
        for (let i = 0; i < 100; i++) {
          const timestamp = new Date(now.getTime() - i * 60000); // Every minute for last 100 minutes
          let baseValue = sensor.value;
          
          // Add some realistic variation based on sensor type
          if (sensor.type === 'temperature') {
            baseValue = 22 + Math.sin(i * 0.1) * 3 + Math.random() * 2;
          } else if (sensor.type === 'humidity') {
            baseValue = 50 + Math.sin(i * 0.05) * 15 + Math.random() * 5;
          } else if (sensor.type === 'pressure') {
            baseValue = 1.4 + Math.sin(i * 0.08) * 0.3 + Math.random() * 0.1;
          } else if (sensor.type === 'flow') {
            baseValue = 18 + Math.sin(i * 0.12) * 8 + Math.random() * 3;
          } else if (sensor.type === 'voltage') {
            baseValue = 230 + Math.sin(i * 0.03) * 10 + Math.random() * 5;
          }
          
          data.push({
            timestamp,
            sensorId: sensor.id,
            value: baseValue
          });
        }
      });
      
      setHistoricalData(data.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()));
    };
    
    generateHistoricalData();
  }, [sensors]);

  // Update sensor data every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setSensors(prev => prev.map(sensor => ({
        ...sensor,
        value: sensor.value + (Math.random() - 0.5) * 2,
        lastUpdated: new Date()
      })));
      
      setAnalogInputs(prev => prev.map(input => ({
        ...input,
        value: Math.max(input.range.min, Math.min(input.range.max, 
          input.value + (Math.random() - 0.5) * 2)),
        lastUpdated: new Date()
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const toggleActuator = useCallback((id: string) => {
    setActuators(prev => prev.map(actuator => 
      actuator.id === id 
        ? { ...actuator, state: !actuator.state, lastChanged: new Date() }
        : actuator
    ));
  }, []);

  return {
    sensors,
    digitalInputs,
    analogInputs,
    actuators,
    historicalData,
    toggleActuator
  };
}