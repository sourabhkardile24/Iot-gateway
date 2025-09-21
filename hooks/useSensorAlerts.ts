import { useEffect, useRef } from 'react';
import { useAlert } from '../contexts/AlertContext';
import { DigitalInput } from './useMockIoTData';

/**
 * Custom hook to monitor door sensor status and trigger alerts when it goes high
 */
export function useDoorSensorAlert(digitalInputs: DigitalInput[]) {
  const { addAlert } = useAlert();
  const previousDoorSensorValues = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    // Find door sensors in the digital inputs
    const doorSensors = digitalInputs.filter(input => 
      input.name.toLowerCase().includes('door') || 
      input.id.toLowerCase().includes('door')
    );

    doorSensors.forEach(sensor => {
      const previousValue = previousDoorSensorValues.current[sensor.id];
      const currentValue = sensor.value;

      // Check if this is not the first time we're seeing this sensor
      if (previousValue !== undefined) {
        // Trigger alert if door sensor went from LOW (false) to HIGH (true)
        if (!previousValue && currentValue) {
          addAlert(
            'Door Sensor Alert!',
            `${sensor.name} has been triggered. Please check the door immediately.`,
            'warning'
          );
        }
      }

      // Update the previous value for next comparison
      previousDoorSensorValues.current[sensor.id] = currentValue;
    });
  }, [digitalInputs, addAlert]);
}

/**
 * Custom hook to monitor any digital input for alert conditions
 * This can be extended for other types of sensors that need monitoring
 */
export function useDigitalInputAlerts(digitalInputs: DigitalInput[]) {
  const { addAlert } = useAlert();
  const previousValues = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    digitalInputs.forEach(input => {
      const previousValue = previousValues.current[input.id];
      const currentValue = input.value;

      // Check if this is not the first time we're seeing this input
      if (previousValue !== undefined) {
        // Check for specific alert conditions based on input type/name
        if (!previousValue && currentValue) {
          let alertTitle = 'Sensor Alert';
          let alertMessage = `${input.name} has been activated.`;

          // Customize alerts based on sensor type
          if (input.name.toLowerCase().includes('door')) {
            alertTitle = 'Door Sensor Alert!';
            alertMessage = `${input.name} has been triggered. Please check the door immediately.`;
          } else if (input.name.toLowerCase().includes('motion')) {
            alertTitle = 'Motion Detected!';
            alertMessage = `Motion detected by ${input.name}.`;
          } else if (input.name.toLowerCase().includes('emergency')) {
            alertTitle = 'Emergency Alert!';
            alertMessage = `Emergency stop activated: ${input.name}`;
          }

          addAlert(alertTitle, alertMessage, 'warning');
        }
      }

      // Update the previous value for next comparison
      previousValues.current[input.id] = currentValue;
    });
  }, [digitalInputs, addAlert]);
}