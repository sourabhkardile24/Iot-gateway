/**
 * Test script for Device Data API
 * This script demonstrates how to call the device data API
 * Run this in a browser console or Node.js environment to test
 */

const testDeviceDataAPI = async () => {
  console.log('Testing Device Data API...');
  
  try {
    // Replace with actual auth token from localStorage
    const authToken = 'your_auth_token_here';
    
    const response = await fetch(
      'http://localhost:5244/api/DeviceData/IUC%2F001',
      {
        method: 'GET',
        headers: {
          'accept': 'text/plain',
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));
    
    // Test data transformation
    const transformedData = transformToIoTData(data);
    console.log('Transformed Data:', JSON.stringify(transformedData, null, 2));
    
    return data;
  } catch (error) {
    console.error('API Test Failed:', error);
    throw error;
  }
};

// Transform function (matching the service implementation)
const transformToIoTData = (deviceData) => {
  const { parsedData } = deviceData.data;
  
  return {
    digitalInputs: [
      {
        id: 'di_001',
        name: 'Door Sensor',
        value: parsedData.inputStatus.inputStatus1 === 1,
        status: parsedData.inputStatus.inputStatus1 === 1 ? 'active' : 'inactive',
        lastChanged: new Date(parsedData.timestamp),
      },
      {
        id: 'di_002', 
        name: 'Motion Detector',
        value: parsedData.inputStatus.inputStatus2 === 1,
        status: parsedData.inputStatus.inputStatus2 === 1 ? 'active' : 'inactive',
        lastChanged: new Date(parsedData.timestamp),
      },
      {
        id: 'di_003',
        name: 'Input 3',
        value: parsedData.inputStatus.inputStatus3 === 1,
        status: parsedData.inputStatus.inputStatus3 === 1 ? 'active' : 'inactive',
        lastChanged: new Date(parsedData.timestamp),
      },
      {
        id: 'di_004',
        name: 'Input 4', 
        value: parsedData.inputStatus.inputStatus4 === 1,
        status: parsedData.inputStatus.inputStatus4 === 1 ? 'active' : 'inactive',
        lastChanged: new Date(parsedData.timestamp),
      },
    ],
    
    systemStatus: {
      gatewayConnected: parsedData.onlineStatus === 'ONLINE',
      powerStatus: parsedData.powerStatus,
      sensorsConnected: parsedData.onlineStatus === 'ONLINE' ? 4 : 0,
      totalSensors: 4,
      activeAlarms: 0,
      actuatorsOnline: 0,
      totalActuators: 0,
      lastUpdated: new Date(parsedData.timestamp),
      deviceId: parsedData.deviceId,
      rawData: {
        bitfield: parsedData.rawBitfield,
        message: parsedData.rawMessage,
      },
    },
    
    timestamp: parsedData.timestamp,
    receivedAt: deviceData.data.receivedAt,
  };
};

// Test with sample data (matching the provided example)
const testWithSampleData = () => {
  console.log('Testing with sample data...');
  
  const sampleResponse = {
    "success": true,
    "message": "Retrieved data for device: IUC/001",
    "data": {
      "deviceId": "IUC/001",
      "topic": "IUC/data",
      "messageType": "Device Data",
      "receivedAt": "2025-09-21T10:02:39.403327Z",
      "isProcessed": false,
      "parsedData": {
        "timestamp": "20-09-2025 / 11:30:42 IST",
        "deviceId": "IUC/001",
        "powerStatus": "ON",
        "onlineStatus": "ONLINE",
        "inputStatus": {
          "inputStatus1": 0,
          "inputStatus2": 1,
          "inputStatus3": 0,
          "inputStatus4": 1
        },
        "rawBitfield": "0x5a5a",
        "rawMessage": "20-09-2025 / 11:30:42 IST, IUC/001, 1, 1, 0x5a5a"
      }
    }
  };
  
  const transformed = transformToIoTData(sampleResponse);
  console.log('Sample Data Transformation Result:');
  console.log('Digital Inputs:', transformed.digitalInputs);
  console.log('System Status:', transformed.systemStatus);
  console.log('Timestamp:', transformed.timestamp);
  
  return transformed;
};

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testDeviceDataAPI, transformToIoTData, testWithSampleData };
}

// Auto-run test with sample data if in browser
if (typeof window !== 'undefined') {
  console.log('Device Data API Test Module Loaded');
  console.log('Run testWithSampleData() to test with sample data');
  console.log('Run testDeviceDataAPI() to test actual API (requires auth token)');
}