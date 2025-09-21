import { useCallback, useEffect, useState } from 'react';

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

export interface SystemStatus {
  gatewayConnected: boolean;
  sensorsConnected: number;
  totalSensors: number;
  activeAlarms: number;
  actuatorsOnline: number;
  totalActuators: number;
  lastUpdated: Date;
}

// Mock data generators with static values
const generateSensorData = (): SensorData[] => [
  {
    id: 'temp_001',
    name: 'Ambient Temperature',
    type: 'temperature',
    value: 0,
    unit: '°C',
    status: 'online',
    lastUpdated: null as any,
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
    lastUpdated: null as any,
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
    lastUpdated: null as any,
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
    lastUpdated: null as any,
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
    lastUpdated: null as any,
    min: 0,
    max: 0
  }
];

const generateDigitalInputs = (): DigitalInput[] => [
  {
    id: 'di_001',
    name: 'Door Sensor',
    value: false,
    status: 'inactive',
    lastChanged: null as any
  },
  {
    id: 'di_002',
    name: 'Motion Detector',
    value: false,
    status: 'inactive',
    lastChanged: null as any
  },
  {
    id: 'di_003',
    name: 'Emergency Stop',
    value: false,
    status: 'inactive',
    lastChanged: null as any
  }
];

const generateAnalogInputs = (): AnalogInput[] => [
  {
    id: 'ai_001',
    name: 'Analog Sensor 1',
    value: 0,
    unit: 'mA',
    range: { min: 0, max: 0 },
    lastUpdated: null as any
  },
  {
    id: 'ai_002',
    name: 'Position Feedback',
    value: 0,
    unit: '%',
    range: { min: 0, max: 0 },
    lastUpdated: null as any
  }
];

const generateActuatorControls = (): ActuatorControl[] => [
  {
    id: 'act_001',
    name: 'Main Pump',
    type: 'pump',
    state: false,
    status: 'online',
    lastChanged: null as any
  },
  {
    id: 'act_002',
    name: 'Cooling Fan',
    type: 'motor',
    state: false,
    status: 'online',
    lastChanged: null as any
  },
  {
    id: 'act_003',
    name: 'Valve Control',
    type: 'valve',
    state: false,
    status: 'online',
    lastChanged: null as any
  },
  {
    id: 'act_004',
    name: 'Emergency Light',
    type: 'switch',
    state: false,
    status: 'online',
    lastChanged: null as any
  }
];

export function useMockIoTData() {
  const [sensors, setSensors] = useState<SensorData[]>(generateSensorData());
  const [digitalInputs, setDigitalInputs] = useState<DigitalInput[]>(generateDigitalInputs());
  const [analogInputs, setAnalogInputs] = useState<AnalogInput[]>(generateAnalogInputs());
  const [actuators, setActuators] = useState<ActuatorControl[]>(generateActuatorControls());
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    gatewayConnected: false,
    sensorsConnected: 0,
    totalSensors: 0,
    activeAlarms: 0,
    actuatorsOnline: 0,
    totalActuators: 0,
    lastUpdated: null as any
  });

  // Generate empty historical data
  useEffect(() => {
    const generateEmptyHistoricalData = () => {
      const data: HistoricalDataPoint[] = [];
      // We're not generating any historical data points, just returning an empty array
      setHistoricalData(data);
    };
    
    generateEmptyHistoricalData();
  }, []);

  // No auto-updating logic to keep data static
  // Removed the interval that updated values every 5 seconds

  const toggleActuator = useCallback((id: string) => {
    setActuators(prev => prev.map(actuator => 
      actuator.id === id 
        ? { ...actuator, state: !actuator.state, lastChanged: null as any }
        : actuator
    ));
  }, []);

  const toggleDigitalInput = useCallback((id: string) => {
    setDigitalInputs(prev => prev.map(input => 
      input.id === id 
        ? { ...input, value: !input.value, status: !input.value ? 'active' : 'inactive', lastChanged: null as any }
        : input
    ));
  }, []);

  return {
    sensors,
    digitalInputs,
    analogInputs,
    actuators,
    historicalData,
    systemStatus,
    toggleActuator,
    toggleDigitalInput
  };
}
