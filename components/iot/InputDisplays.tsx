import { useColorScheme } from '@/hooks/useColorScheme';
import { AnalogInput, DigitalInput } from '@/hooks/useMockIoTData';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type DigitalInputIconProps = {
  type: string;
  size?: number;
  color?: string;
};

// Icon component for digital inputs
const DigitalInputIcon = ({ type, size = 16, color = '#fff' }: DigitalInputIconProps) => {
  switch (type) {
    case 'switch':
      return <MaterialCommunityIcons name="light-switch" size={size} color={color} />;
    case 'button':
      return <MaterialCommunityIcons name="gesture-tap-button" size={size} color={color} />;
    case 'sensor':
      return <MaterialCommunityIcons name="motion-sensor" size={size} color={color} />;
    case 'door':
      return <MaterialCommunityIcons name="door-open" size={size} color={color} />;
    case 'window':
      return <MaterialCommunityIcons name="window-shutter-open" size={size} color={color} />;
    case 'motion':
      return <MaterialCommunityIcons name="motion-sensor" size={size} color={color} />;
    default:
      return <Ionicons name="toggle" size={size} color={color} />;
  }
};

export function DigitalInputCard({ input, deviceTimestamp }: { input: DigitalInput, deviceTimestamp: string | undefined }) {
  const colorScheme = useColorScheme() ?? 'light';
  
  // Determine status and colors based on input value
  const isActive = input.value;
  const statusText = input.value != null ? 'Active' : 'Inactive';
  
  // Icon background color based on status
  const iconBgColor = isActive ? '#22c55e' : '#ef1010ff'; // Green for active, gray for inactive
  
  // Gradient colors based on status
  const getGradientColors = () => {
    if (isActive) {
      return ['#ffffff', '#dcfce7', '#bbf7d0'] as any; // Green gradient for active
    } else {
      return ['#ffffff', '#f9fafb', '#f3f4f6'] as any; // Gray gradient for inactive
    }
  };
  
  const gradientColors = getGradientColors();
  
  // Status indicator style
  const statusIndicatorStyle = statusText == 'Active' ? styles.activeStatus : styles.inactiveStatus;
  
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
            <Text style={styles.inputName}>{input.name}</Text>
            <View style={statusIndicatorStyle}></View>
          </View>
          <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
            <DigitalInputIcon type={'default'} color="#fff" />
          </View>
        </View>
        
        <View style={styles.valueContainer}>
          <Text style={[
            styles.valueText, 
            isActive ? styles.activeValueText : styles.inactiveValueText
          ]}>
            {isActive ? 'HIGH' : 'LOW'}
          </Text>
          <Text style={styles.statusText}>{statusText}</Text>
        </View>
        
        <View style={styles.statusContainer}>
          <View style={styles.statusBarContainer}>
            <View 
              style={[
                styles.statusBar,
                { width: isActive ? '100%' : '0%' },
                isActive ? styles.activeStatusBar : styles.inactiveStatusBar
              ]}
            />
          </View>
        </View>
        
        <Text style={styles.updatedTime}>
          Last changed: {deviceTimestamp != null ? deviceTimestamp : 'N/A'}
        </Text>
      </LinearGradient>
    </View>
  );
}

export function AnalogInputCard({ input }: { input: AnalogInput }) {
  const colorScheme = useColorScheme() ?? 'light';
  
  // Colors based on theme
  const bgColor = colorScheme === 'light' ? '#f5f3ff' : '#4c1d95'; // purple/violet bg
  const textColor = colorScheme === 'light' ? '#6d28d9' : '#ddd6fe';
  const borderColor = colorScheme === 'light' ? '#ddd6fe' : '#6d28d9';
  
  // Calculate percentage for progress bar
  const min = input.range.min;
  const max = input.range.max;
  const percentage = ((input.value - min) / (max - min)) * 100;
  
  return (
    <View style={[styles.card, { backgroundColor: bgColor, borderColor: borderColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>{input.name}</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.valueContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={[styles.valueText, { color: textColor }]}>
              {input.value.toFixed(1)}
            </Text>
            <Text style={[styles.unitText, { color: textColor + '99' }]}>
              {input.unit}
            </Text>
          </View>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressLabels}>
            <Text style={[styles.rangeText, { color: textColor + '99' }]}>{min}{input.unit}</Text>
            <Text style={[styles.rangeText, { color: textColor + '99' }]}>{max}{input.unit}</Text>
          </View>
          <View style={[styles.progressTrack, { backgroundColor: borderColor + '33' }]}>
            <LinearGradient
              colors={['#8b5cf6', '#d946ef']} // purple to fuchsia
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.progressBar,
                { width: `${Math.max(0, Math.min(100, percentage))}%` }
              ]}
            />
          </View>
        </View>
        
        <Text style={[styles.lastUpdatedText, { color: textColor + '99' }]}>
          Last updated: {input.lastUpdated != null ? input.lastUpdated.toLocaleString() : 'N/A'}
        </Text>
      </View>
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
    width: '100%',
    alignSelf: 'stretch',
  },
  gradientContainer: {
    padding: 12,
    width: '100%',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: '60%',
  },
  inputName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  activeStatus: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e', // Green for active
  },
  inactiveStatus: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6b7280', // Gray for inactive
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
    marginBottom: 12,
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
  },
  valueText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    flexShrink: 1,
  },
  activeValueText: {
    color: '#22c55e', // Green for active
  },
  inactiveValueText: {
    color: '#6b7280', // Gray for inactive
  },
  statusText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    width: '100%',
  },
  statusBarContainer: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  statusBar: {
    height: '100%',
    borderRadius: 2,
  },
  activeStatusBar: {
    backgroundColor: '#22c55e', // Green for active
  },
  inactiveStatusBar: {
    backgroundColor: '#6b7280', // Gray for inactive
  },
  updatedTime: {
    fontSize: 10,
    color: '#888',
  },
  // Keep original styles for backward compatibility
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  content: {
    padding: 12,
    paddingTop: 4,
  },
  unitText: {
    fontSize: 12,
    marginLeft: 4,
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  progressContainer: {
    marginTop: 4,
    marginBottom: 8,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  rangeText: {
    fontSize: 12,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  lastUpdatedText: {
    fontSize: 12,
    marginTop: 4,
  },
});
