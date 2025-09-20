import { useColorScheme } from '@/hooks/useColorScheme';
import { ActuatorControl as ActuatorControlType } from '@/hooks/useMockIoTData';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type ActuatorIconProps = {
  type: string;
  size?: number;
  color?: string;
};

// Simple icons using emojis/text for now
const ActuatorIcon = ({ type, size = 16, color = '#fff' }: ActuatorIconProps) => {
  let symbol = '🔄';
  
  switch (type) {
    case 'pump':
      symbol = '🔄';
      break;
    case 'valve':
      symbol = '🚰';
      break;
    case 'motor':
      symbol = '⚙️';
      break;
    case 'switch':
      symbol = '💡';
      break;
  }
  
  return (
    <View style={{ width: size * 1.5, height: size * 1.5, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: size, color }}>{symbol}</Text>
    </View>
  );
};

interface ActuatorControlProps {
  actuator: ActuatorControlType;
  onToggle: (id: string) => void;
}

export function ActuatorControl({ actuator, onToggle }: ActuatorControlProps) {
  const colorScheme = useColorScheme() ?? 'light';
  
  // Colors based on state and theme
  const bgColor = actuator.state 
    ? colorScheme === 'light' ? '#dcfce7' : '#064e3b' 
    : colorScheme === 'light' ? '#f3f4f6' : '#1f2937';
  
  const primaryColor = actuator.state
    ? colorScheme === 'light' ? '#10b981' : '#10b981'
    : colorScheme === 'light' ? '#6b7280' : '#9ca3af';
    
  const secondaryColor = actuator.state
    ? colorScheme === 'light' ? '#14b8a6' : '#14b8a6'
    : colorScheme === 'light' ? '#4b5563' : '#6b7280';
    
  const borderColor = actuator.state
    ? colorScheme === 'light' ? '#86efac' : '#059669'
    : colorScheme === 'light' ? '#d1d5db' : '#374151';
    
  const textColor = actuator.state
    ? colorScheme === 'light' ? '#047857' : '#d1fae5'
    : colorScheme === 'light' ? '#4b5563' : '#d1d5db';
  
  const statusColor = actuator.status === 'online'
    ? colorScheme === 'light' ? '#22c55e' : '#22c55e'
    : colorScheme === 'light' ? '#ef4444' : '#ef4444';
    
  const handleToggle = () => {
    if (actuator.status === 'online') {
      onToggle(actuator.id);
    }
  };
  
  return (
    <Pressable 
      style={({pressed}) => [
        styles.container,
        {
          backgroundColor: bgColor,
          borderColor: borderColor,
          opacity: pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        }
      ]}
      onPress={handleToggle}
      disabled={actuator.status !== 'online'}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: textColor }]}>
            {actuator.name}
          </Text>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
        </View>
        
        <Text style={[styles.statusText, { color: textColor }]}>
          {actuator.status}
        </Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={[primaryColor, secondaryColor]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconGradient}
          >
            <ActuatorIcon type={actuator.type} size={24} color="#fff" />
          </LinearGradient>
        </View>
        
        <View style={styles.stateContainer}>
          <Text style={[styles.stateText, { color: textColor }]}>
            {actuator.state ? 'ON' : 'OFF'}
          </Text>
          <Text style={[styles.lastChangedText, { color: textColor + '99' }]}>
            Last changed: {actuator.lastChanged != null ? actuator.lastChanged.toLocaleTimeString() : 'N/A'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 16,
  },
  iconGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stateContainer: {
    flex: 1,
  },
  stateText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  lastChangedText: {
    fontSize: 12,
    marginTop: 4,
  },
});
