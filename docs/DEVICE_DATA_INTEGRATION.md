# Device Data Integration

This documentation explains how the IoT Gateway app integrates with the device data API to fetch and display real-time device information.

## Overview

The app now fetches device data from `http://localhost:5244/api/DeviceData/IUC%2F001` every 5 seconds and displays:

- **Power Status**: ON/OFF status in the gateway status section
- **Digital Inputs**: 4 input channels with proper labels:
  - Input 1: Door Sensor
  - Input 2: Motion Detector  
  - Input 3: Input 3
  - Input 4: Input 4
- **Timestamps**: Last updated time from the device data

## API Response Format

The API returns data in this format:

```json
{
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
}
```

## Implementation Files

### Services
- **`services/deviceDataService.ts`**: Handles API calls and data transformation
  - Fetches data from the device API
  - Transforms API response to UI-compatible format
  - Uses authentication token from AsyncStorage

### Hooks
- **`hooks/useDeviceData.ts`**: React hook for device data management
  - Automatically polls API every 5 seconds when authenticated
  - Manages loading states and error handling
  - Provides manual refresh functionality

### UI Components
- **`app/(drawer)/overview.tsx`**: Main screen displaying device data
  - Shows power status in status cards
  - Displays digital inputs with proper labels
  - Shows timestamps and handles refresh
- **`components/iot/InputDisplays.tsx`**: Enhanced to show full timestamp

## Features

### Automatic Polling
- Starts polling when user is authenticated
- Fetches data every 5 seconds
- Stops polling when user logs out
- Handles network errors gracefully

### Status Display
- **Gateway Status**: Connection status based on `onlineStatus`
- **Power Status**: Device power state (ON/OFF)
- **Digital Inputs**: Real-time input states with labels
- **Timestamps**: Device timestamp and API received time

### Authentication
- Uses bearer token from AsyncStorage
- Automatically handles authentication errors
- Stops polling on auth failures

## Usage

The device data integration works automatically when:

1. User is authenticated and logged in
2. Device API is running on `localhost:5244`
3. Valid auth token is stored in AsyncStorage

### Manual Testing

Use the test utility in `utils/testDeviceAPI.js`:

```javascript
// Test with sample data
testWithSampleData();

// Test actual API (requires auth token)
testDeviceDataAPI();
```

### Error Handling

The app handles these scenarios:
- **Network errors**: Displays error message, continues polling
- **Authentication errors**: Stops polling, shows auth error
- **API errors**: Shows error message with retry capability
- **No data**: Falls back to mock data for UI consistency

## Configuration

### API Endpoint
Current endpoint: `http://localhost:5244/api/DeviceData/IUC%2F001`

To change the device ID or endpoint, modify `services/deviceDataService.ts`:

```typescript
private readonly baseUrl = 'http://localhost:5244/api';
private readonly deviceId = 'IUC/001';
```

### Polling Interval
Current interval: 5 seconds

To change the polling frequency, modify `hooks/useDeviceData.ts`:

```typescript
// Change 5000 to desired milliseconds
intervalRef.current = setInterval(() => {
  // ...
}, 5000);
```

### Digital Input Labels
Modify labels in `services/deviceDataService.ts`:

```typescript
digitalInputs: [
  {
    id: 'di_001',
    name: 'Door Sensor',        // <- Change this
    // ...
  },
  {
    id: 'di_002', 
    name: 'Motion Detector',    // <- Change this
    // ...
  },
  // ...
]
```

## Dependencies

- **AsyncStorage**: For auth token storage
- **React hooks**: useState, useEffect, useCallback, useRef
- **Authentication context**: useAuth() from AuthContext

## Status Indicators

The UI shows different status indicators:

- **GREEN**: Active/Online/Connected
- **RED**: Inactive/Offline/Disconnected  
- **BLUE**: Neutral status (sensors, general info)
- **PURPLE**: Actuators and control elements

## Troubleshooting

### No Data Displayed
1. Check if device API is running on localhost:5244
2. Verify authentication token is valid
3. Check browser/app network connectivity
4. Look for error messages in the UI

### Authentication Issues
1. Ensure user is logged in properly
2. Check if auth token exists in AsyncStorage
3. Verify token hasn't expired
4. Try logging out and back in

### Polling Not Working
1. Check authentication status
2. Verify hook is properly initialized
3. Look for JavaScript errors in console
4. Check if component is properly mounted