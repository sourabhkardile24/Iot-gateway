import { useColorScheme } from '@/hooks/useColorScheme';
import { AnalogInput, DigitalInput } from '@/hooks/useMockIoTData';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function DigitalInputCard({ input, deviceTimestamp }: { input: DigitalInput, deviceTimestamp: string | undefined }) {
  const colorScheme = useColorScheme() ?? 'light';
  
  // Colors based on input value and theme

  const statusText = input.value != null ? 'Active' : 'Inactive';
  const bgColor = input.value 
    ? colorScheme === 'light' ? '#ecfdf5' : '#064e3b' // green when true
    : colorScheme === 'light' ? '#fef2f2' : '#7f1d1d'; // red when false
    
  const textColor = input.value
    ? colorScheme === 'light' ? '#047857' : '#d1fae5'
    : colorScheme === 'light' ? '#b91c1c' : '#fee2e2';
    
  const borderColor = input.value
    ? colorScheme === 'light' ? '#a7f3d0' : '#059669'
    : colorScheme === 'light' ? '#fecaca' : '#b91c1c';

  const statusBgColor = statusText === 'Active'
    ? colorScheme === 'light' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.2)'
    : colorScheme === 'light' ? 'rgba(107, 114, 128, 0.1)' : 'rgba(107, 114, 128, 0.2)';

  const statusTextColor = statusText === 'Active'
    ? colorScheme === 'light' ? '#10b981' : '#34d399'
    : colorScheme === 'light' ? '#6b7280' : '#9ca3af';
  
  return (
    <View style={[styles.card, { backgroundColor: bgColor, borderColor: borderColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>{input.name}</Text>
        <View style={[styles.badge, { backgroundColor: statusBgColor }]}>
          <Text style={[styles.badgeText, { color: statusTextColor }]}>
            {statusText}
          </Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <View style={styles.valueContainer}>
          <Text style={[styles.valueText, { color: textColor }]}>
            {input.value ? 'HIGH' : 'LOW'}
          </Text>
          
          <View style={[
            styles.indicator, 
            { 
              backgroundColor: input.value != null
                ? colorScheme === 'light' ? '#10b981' : '#34d399' 
                : colorScheme === 'light' ? '#ef4444' : '#f87171'
            }
          ]} />
        </View>
        
        <Text style={[styles.lastUpdatedText, { color: textColor + '99' }]}>
          Last changed: {deviceTimestamp != null ? deviceTimestamp : 'N/A'}
        </Text>
      </View>
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
    borderWidth: 1,
    marginBottom: 10,
    overflow: 'hidden',
  },
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
  valueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  valueText: {
    fontSize: 20,
    fontWeight: '600',
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
