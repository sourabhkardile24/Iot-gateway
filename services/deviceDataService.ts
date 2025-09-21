import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ParsedDeviceData {
  timestamp: string;
  deviceId: string;
  powerStatus: 'ON' | 'OFF';
  onlineStatus: 'ONLINE' | 'OFFLINE';
  inputStatus: {
    inputStatus1: number;
    inputStatus2: number;
    inputStatus3: number;
    inputStatus4: number;
  };
  rawBitfield: string;
  rawMessage: string;
}

export interface DeviceDataResponse {
  success: boolean;
  message: string;
  data: {
    deviceId: string;
    topic: string;
    messageType: string;
    receivedAt: string;
    isProcessed: boolean;
    parsedData: ParsedDeviceData;
  };
}

class DeviceDataService {
  private readonly baseUrl = 'http://localhost:5244/api';
  private readonly deviceId = 'IUC/001';
  
  /**
   * Fetch device data with authentication
   */
  async fetchDeviceData(): Promise<DeviceDataResponse> {
    try {
      // Get auth token from AsyncStorage
      const token = await AsyncStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(
        `${this.baseUrl}/DeviceData/${encodeURIComponent(this.deviceId)}`,
        {
          method: 'GET',
          headers: {
            'accept': 'text/plain',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed - invalid token');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: DeviceDataResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch device data');
      }

      return data;
    } catch (error) {
      console.error('DeviceDataService: Error fetching device data:', error);
      throw error;
    }
  }

  /**
   * Transform API response to IoT data format for UI components
   */
  transformToIoTData(deviceData: DeviceDataResponse) {
    const { parsedData } = deviceData.data;
    
    return {
      // Transform digital inputs with proper labels
      digitalInputs: [
        {
          id: 'di_001',
          name: 'Door Sensor',
          value: parsedData.inputStatus.inputStatus1 === 1,
          status: (parsedData.inputStatus.inputStatus1 === 1 ? 'active' : 'inactive') as 'active' | 'inactive',
          lastChanged: new Date(parsedData.timestamp),
        },
        {
          id: 'di_002', 
          name: 'Motion Detector',
          value: parsedData.inputStatus.inputStatus2 === 1,
          status: (parsedData.inputStatus.inputStatus2 === 1 ? 'active' : 'inactive') as 'active' | 'inactive',
          lastChanged: new Date(parsedData.timestamp),
        },
        {
          id: 'di_003',
          name: 'Input 3',
          value: parsedData.inputStatus.inputStatus3 === 1,
          status: (parsedData.inputStatus.inputStatus3 === 1 ? 'active' : 'inactive') as 'active' | 'inactive',
          lastChanged: new Date(parsedData.timestamp),
        },
        {
          id: 'di_004',
          name: 'Input 4', 
          value: parsedData.inputStatus.inputStatus4 === 1,
          status: (parsedData.inputStatus.inputStatus4 === 1 ? 'active' : 'inactive') as 'active' | 'inactive',
          lastChanged: new Date(parsedData.timestamp),
        },
      ],
      
      // Transform system status to include power status
      systemStatus: {
        gatewayConnected: parsedData.onlineStatus === 'ONLINE',
        powerStatus: parsedData.powerStatus,
        sensorsConnected: parsedData.onlineStatus === 'ONLINE' ? 4 : 0,
        totalSensors: 4,
        activeAlarms: 0, // No alarm data in current API response
        actuatorsOnline: 0, // No actuator data in current API response
        totalActuators: 0,
        lastUpdated: new Date(parsedData.timestamp),
        deviceId: parsedData.deviceId,
        rawData: {
          bitfield: parsedData.rawBitfield,
          message: parsedData.rawMessage,
        },
      },
      
      // Keep original timestamp for display
      timestamp: parsedData.timestamp,
      receivedAt: deviceData.data.receivedAt,
    };
  }
}

export const deviceDataService = new DeviceDataService();