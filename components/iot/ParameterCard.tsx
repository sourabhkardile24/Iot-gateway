import { useColorScheme } from '@/hooks/useColorScheme';
import { SensorData } from '@/hooks/useMockIoTData';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type SensorIconProps = {
  type: string;
  size?: number;
  color?: string;
};

// Using proper vector icons instead of emojis
const SensorIcon = ({ type, size = 16, color = '#fff' }: SensorIconProps) => {
  switch (type) {
    case 'temperature':
      return <MaterialCommunityIcons name="thermometer" size={size} color={color} />;
    case 'humidity':
      return <MaterialCommunityIcons name="water-percent" size={size} color={color} />;
    case 'pressure':
      return <MaterialCommunityIcons name="gauge" size={size} color={color} />;
    case 'flow':
      return <MaterialCommunityIcons name="water-pump" size={size} color={color} />;
    case 'voltage':
      return <MaterialCommunityIcons name="flash" size={size} color={color} />;
    case 'current':
      return <MaterialCommunityIcons name="current-ac" size={size} color={color} />;
    default:
      return <Ionicons name="stats-chart" size={size} color={color} />;
  }
};

interface ParameterCardProps {
  sensor: SensorData;
}

export function ParameterCard({ sensor }: ParameterCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const textColor = useThemeColor({}, 'text');
  const isOutOfRange = sensor.value < sensor.min || sensor.value > sensor.max;
  const percentage = ((sensor.value - sensor.min) / (sensor.max - sensor.min)) * 100;
  
  // Get colors based on sensor type
  let bgColor = '#ffffff';  // White background for all cards as shown in image
  let iconBgColor = '#3b82f6';  // Default blue
  let statusBadgeColor = "online";
  
  // Set icon background colors based on sensor type
  switch(sensor.type) {
    case 'temperature':
      iconBgColor = isOutOfRange ? '#ef4444' : '#f97316'; // Red for alert (as in image)
      break;
    case 'humidity':
      iconBgColor = '#06b6d4'; // Blue as in image
      break;
    case 'pressure':
      iconBgColor = '#8b5cf6'; // Purple as in image
      break;
    case 'flow':
      iconBgColor = '#10b981'; // Green as in image
      break;
    case 'voltage':
      iconBgColor = '#eab308'; // Yellow as in image
      break;
  }
  
  // Status indicator style
  let onlineStatusStyle = styles.onlineStatus;
  if (sensor.status !== 'online') {
    onlineStatusStyle = styles.offlineStatus;
  }
  
  // Format the value display
  const valueDisplay = sensor.value < 0 ? sensor.value.toFixed(1) : sensor.value.toFixed(1);
  
  // Create gradient colors based on the sensor type - darker and more pronounced
  const getGradientColors = () => {
    let baseColor = iconBgColor;
    
    if (isOutOfRange) {
      return ['#fff5f5', '#fee2e2', '#fecaca'] as any; // Darker red gradient for alerts
    }
    
    switch(sensor.type) {
      case 'temperature':
        return ['#ffffff', '#ffedd5', '#fed7aa'] as any; // Darker orange gradient
      case 'humidity':
        return ['#ffffff', '#e0f2fe', '#bae6fd'] as any; // Darker blue gradient
      case 'pressure':
        return ['#ffffff', '#ede9fe', '#ddd6fe'] as any; // Darker purple gradient
      case 'flow':
        return ['#ffffff', '#dcfce7', '#bbf7d0'] as any; // Darker green gradient
      case 'voltage':
        return ['#ffffff', '#fef9c3', '#fde68a'] as any; // Darker yellow gradient
      default:
        return ['#ffffff', '#f3f4f6', '#e5e7eb'] as any; // Darker gray gradient
    }
  };
  
  const gradientColors = getGradientColors();
  
  return (
    <View style={styles.card}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}
      >
        <View style={styles.cardHeader}>
          <View style={styles.nameContainer}>
            <Text style={styles.sensorName}>{sensor.name}</Text>
            <View style={onlineStatusStyle}></View>
          </View>
          <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
            <SensorIcon type={sensor.type} color="#fff" />
          </View>
        </View>
        
        <View style={styles.valueContainer}>
          <Text style={[
            styles.valueText, 
            isOutOfRange ? styles.alertValueText : {}
          ]}>
            {valueDisplay}
          </Text>
          <Text style={styles.unitText}>{sensor.unit}</Text>
        </View>
        
        <View style={styles.rangeContainer}>
          <Text style={styles.rangeText}>{sensor.min}{sensor.unit}</Text>
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar,
                { width: `${Math.max(0, Math.min(100, percentage))}%` },
                isOutOfRange ? styles.alertProgressBar : {}
              ]}
            />
          </View>
          <Text style={styles.rangeText}>{sensor.max}{sensor.unit}</Text>
        </View>
        
        <Text style={styles.updatedTime}>
          Updated: {sensor.lastUpdated != null ? sensor.lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'N/A'}
        </Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 10,
    overflow: 'hidden',
    width: '100%', // Make card full width of container
    alignSelf: 'stretch',
  },
  gradientContainer: {
    padding: 16,
    width: '100%',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap', // Allow wrapping on very small screens
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1, // Take available space
    minWidth: '60%', // Ensure name has enough space
  },
  sensorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  onlineStatus: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e', // Green for online
  },
  offlineStatus: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444', // Red for offline/warning
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
    flexWrap: 'nowrap', // Keep value and unit together
  },
  valueText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    flexShrink: 1, // Allow text to shrink if needed
  },
  alertValueText: {
    color: '#ef4444', // Red text for out-of-range values
  },
  unitText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  rangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    width: '100%', // Ensure full width
  },
  rangeText: {
    fontSize: 12,
    color: '#666',
  },
  progressBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3b82f6', // Default blue
    borderRadius: 3,
  },
  alertProgressBar: {
    backgroundColor: '#ef4444', // Red for alerts
  },
  updatedTime: {
    fontSize: 10,
    color: '#888',
  },
});
