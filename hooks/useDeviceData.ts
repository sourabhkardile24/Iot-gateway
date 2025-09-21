import { useAuth } from '@/contexts/AuthContext';
import { deviceDataService, DeviceDataResponse } from '@/services/deviceDataService';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface DeviceStatus {
  gatewayConnected: boolean;
  powerStatus: 'ON' | 'OFF';
  sensorsConnected: number;
  totalSensors: number;
  activeAlarms: number;
  actuatorsOnline: number;
  totalActuators: number;
  lastUpdated: Date;
  deviceId: string;
  rawData: {
    bitfield: string;
    message: string;
  };
}

export interface DeviceDigitalInput {
  id: string;
  name: string;
  value: boolean;
  status: 'active' | 'inactive';
  lastChanged: Date;
}

export interface DeviceData {
  digitalInputs: DeviceDigitalInput[];
  systemStatus: DeviceStatus;
  timestamp: string;
  receivedAt: string;
}

export const useDeviceData = () => {
  const { isAuthenticated, token } = useAuth();
  const [deviceData, setDeviceData] = useState<DeviceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);
  
  // Use refs to track polling interval and avoid stale closures
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isMountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setError('Not authenticated');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response: DeviceDataResponse = await deviceDataService.fetchDeviceData();
      const transformedData = deviceDataService.transformToIoTData(response);
      
      if (isMountedRef.current) {
        setDeviceData(transformedData);
        setLastFetchTime(new Date());
        console.log('Device data fetched successfully:', transformedData);
      }
    } catch (err: any) {
      console.error('Error fetching device data:', err);
      if (isMountedRef.current) {
        setError(err.message || 'Failed to fetch device data');
        
        // If authentication error, don't retry
        if (err.message?.includes('Authentication failed')) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
        }
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [isAuthenticated, token]);

  const startPolling = useCallback(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Fetch data immediately
    fetchData();
    
    // Set up polling every 5 seconds
    intervalRef.current = setInterval(() => {
      if (isMountedRef.current && isAuthenticated) {
        fetchData();
      }
    }, 5000);
    
    console.log('Device data polling started (every 5 seconds)');
  }, [fetchData, isAuthenticated]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log('Device data polling stopped');
    }
  }, []);

  // Start polling when authenticated, stop when not
  useEffect(() => {
    if (isAuthenticated && token) {
      startPolling();
    } else {
      stopPolling();
      setDeviceData(null);
      setError(null);
    }

    // Cleanup on unmount
    return () => {
      isMountedRef.current = false;
      stopPolling();
    };
  }, [isAuthenticated, token, startPolling, stopPolling]);

  // Manual refresh function
  const refreshData = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    deviceData,
    isLoading,
    error,
    lastFetchTime,
    refreshData,
    startPolling,
    stopPolling,
    isPolling: intervalRef.current !== null,
  };
};