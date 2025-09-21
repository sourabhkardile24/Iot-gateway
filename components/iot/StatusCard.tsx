import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

type StatusIconProps = {
  iconName: string;
  size?: number;
  color?: string;
};

// Proper icon component using Expo Vector Icons
const StatusIcon = ({ iconName, size = 24, color = '#fff' }: StatusIconProps) => {
  
  switch (iconName) {
    case 'wifi':
      return <Ionicons name="wifi-outline" size={size} color={color} />;
    case 'wifiOff':
      return <Ionicons name="cloud-offline-outline" size={size} color={color} />;
    case 'activity':
      return <Ionicons name="pulse-outline" size={size} color={color} />;
    case 'alert':
      return <Ionicons name="warning-outline" size={size} color={color} />;
    case 'powerOn':
      return <Ionicons name="power" size={size} color={color} />;
    case 'powerOff':
      return <Ionicons name="power-outline" size={size} color={color} />;
    default:
      return <Ionicons name="stats-chart-outline" size={size} color={color} />;
  }
};

interface StatusCardProps {
  title: string;
  value: string | number;
  type: 'connection' | 'sensors' | 'alarms' | 'actuators' | 'power';
  icon: string;
  style?: ViewStyle;
}

export function StatusCard({ title, value, type, icon, style }: StatusCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  
  // Define colors based on card type
  let iconColor = '#3b82f6'; // Default blue
  let accentColor = '#3b82f6';
  let textColor = '#ffffffff';
  let subtitleColor = '#ffffffcb';
  let iconName = icon; // Default to provided icon
  
  switch (type) {
    case 'connection':
      // Check if disconnected
      if (value === 'Disconnected') {
        iconColor = '#ffffffff'; // Red for disconnected
        accentColor = '#ef4444';
        iconName = 'wifiOff'; // Use offline icon
      } else {
        iconColor = '#ffffffff'; // Green for connected status
        accentColor = '#10b981';
      }
      break;
    case 'power':
      // Check if power is OFF
      if (value === 'OFF') {
        iconColor = '#9ca3af'; // Gray icon for OFF
        accentColor = '#374151'; // Dark gray for OFF status
        textColor = '#d1d5db'; // Light gray text
        subtitleColor = '#9ca3af'; // Gray subtitle
        iconName = 'powerOff'; // Use power-off icon
      } else {
        iconColor = '#ffffffff'; // White icon for ON
        accentColor = '#22c55e'; // Bright green for ON status
        iconName = 'powerOn'; // Use power-on icon
      }
      break;
    case 'sensors':
      iconColor = '#ffffffff'; // Blue for sensors
      accentColor = '#3b82f6';
      break;
    case 'alarms':
      // If there are alarms, use red, otherwise green
      if (Number(value) > 0) {
        iconColor = '#ffffffff'; // Red for active alarms
        accentColor = '#ef4444';
      } else {
        iconColor = '#fdfdfdff'; // Green for no alarms
        accentColor = '#10b981';
      }
      break;
    case 'actuators':
      iconColor = '#ffffffff'; // Purple for actuators
      accentColor = '#8b5cf6';
      break;
  }
  
  // Create gradient colors based on the accent color - vibrant and smooth gradient
  const gradientColors = [
    accentColor+ 'F2', // Full accent color for stronger start
    accentColor + 'FF'  // 60% opacity for fade effect
  ];
  
  // Function to potentially truncate text for smaller screens
  const getTruncatedValue = (val: string | number) => {
    // If value is a fraction like "3/5", make sure it's displayed properly
    if (typeof val === 'string' && val.includes('/')) {
      return val;
    }
    // For numbers or longer strings, keep them as is
    return val;
  };

  return (
    <View style={[styles.card, style]}>
      <LinearGradient
        colors={gradientColors as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientContainer}
      >
        <View style={styles.content}>
          <View style={[styles.iconContainer, { backgroundColor: accentColor + '15' }]}>
            <StatusIcon iconName={iconName} size={40} color={iconColor} />
          </View>
          
          <View style={styles.textContainer}>
            <Text 
              style={[styles.subtitle, { color: subtitleColor }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
            <Text 
              style={[styles.value, { color: textColor }]}
              adjustsFontSizeToFit={true}
              numberOfLines={1}
            >
              {getTruncatedValue(value)}
            </Text>
          </View>
          
          <View style={[styles.indicator, { backgroundColor: accentColor }]} />
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
    minHeight: 80, // Minimum height instead of fixed
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
    width: '100%', // Make card full width of container
  },
  gradientContainer: {
    flex: 1,
    width: '100%',
  },
  content: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'nowrap', // Prevent wrapping on smaller screens
    minHeight: 80, // Ensure minimum height
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0, // Prevent icon from shrinking
  },
  textContainer: {
    flex: 1,
    minWidth: 0, // Allow text container to shrink below min-content width
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 2,
    fontWeight: '400',
    flexShrink: 1, // Allow title to shrink if needed
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 1, // Allow value to shrink if needed
  },
  indicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
  },
});
