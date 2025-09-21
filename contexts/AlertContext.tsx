import { Audio } from 'expo-av';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

export interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'error' | 'info';
  timestamp: Date;
  dismissed: boolean;
}

interface AlertContextType {
  alerts: Alert[];
  addAlert: (title: string, message: string, type?: Alert['type']) => void;
  dismissAlert: (id: string) => void;
  clearAllAlerts: () => void;
  playAlertSound: () => Promise<void>;
  stopContinuousSound: () => Promise<void>;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function useAlert() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}

interface AlertProviderProps {
  children: React.ReactNode;
}

export function AlertProvider({ children }: AlertProviderProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const isContinuousPlayingRef = useRef(false);
  const continuousIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load the alert sound on component mount
  useEffect(() => {
    loadAlertSound();
    return () => {
      // Clean up sound and intervals when component unmounts
      if (continuousIntervalRef.current) {
        clearInterval(continuousIntervalRef.current);
      }
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const loadAlertSound = async () => {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        require('../assets/sounds/alert-buzzer.wav'),
        { shouldPlay: false }
      );
      setSound(newSound);
      soundRef.current = newSound;
    } catch (error) {
      console.error('Error loading alert sound:', error);
    }
  };

  const playAlertSound = useCallback(async () => {
    try {
      if (soundRef.current) {
        // Stop and replay from beginning
        await soundRef.current.stopAsync();
        await soundRef.current.setPositionAsync(0);
        await soundRef.current.playAsync();
      }
    } catch (error) {
      console.error('Error playing alert sound:', error);
    }
  }, []);

  const startContinuousSound = useCallback(async () => {
    if (isContinuousPlayingRef.current) return; // Already playing
    
    isContinuousPlayingRef.current = true;
    
    const playLoop = async () => {
      if (soundRef.current && isContinuousPlayingRef.current) {
        try {
          await soundRef.current.stopAsync();
          await soundRef.current.setPositionAsync(0);
          await soundRef.current.playAsync();
        } catch (error) {
          console.error('Error playing continuous alert sound:', error);
        }
      }
    };

    // Play immediately
    await playLoop();
    
    // Set up interval to replay every 2 seconds
    continuousIntervalRef.current = setInterval(playLoop, 2000);
  }, []);

  const stopContinuousSound = useCallback(async () => {
    isContinuousPlayingRef.current = false;
    
    if (continuousIntervalRef.current) {
      clearInterval(continuousIntervalRef.current);
      continuousIntervalRef.current = null;
    }
    
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
      }
    } catch (error) {
      console.error('Error stopping continuous alert sound:', error);
    }
  }, []);

  const addAlert = useCallback((title: string, message: string, type: Alert['type'] = 'warning') => {
    const newAlert: Alert = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title,
      message,
      type,
      timestamp: new Date(),
      dismissed: false,
    };

    setAlerts(prev => [newAlert, ...prev]);

    // Start continuous alert sound for warnings and errors
    if (type === 'warning' || type === 'error') {
      startContinuousSound();
    }
  }, [startContinuousSound]);

  const dismissAlert = useCallback((id: string) => {
    setAlerts(prev => {
      const updatedAlerts = prev.map(alert => 
        alert.id === id ? { ...alert, dismissed: true } : alert
      );
      
      // Check if there are any remaining active critical alerts
      const remainingCriticalAlerts = updatedAlerts.filter(
        alert => !alert.dismissed && (alert.type === 'warning' || alert.type === 'error')
      );
      
      // Stop continuous sound if no more critical alerts
      if (remainingCriticalAlerts.length === 0) {
        stopContinuousSound();
      }
      
      return updatedAlerts;
    });
  }, [stopContinuousSound]);

  const clearAllAlerts = useCallback(() => {
    setAlerts([]);
    stopContinuousSound();
  }, [stopContinuousSound]);

  const value: AlertContextType = {
    alerts,
    addAlert,
    dismissAlert,
    clearAllAlerts,
    playAlertSound,
    stopContinuousSound,
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
    </AlertContext.Provider>
  );
}