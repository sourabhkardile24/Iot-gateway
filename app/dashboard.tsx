import { ActuatorControl } from '@/components/iot/ActuatorControl';
import { AnalogInputCard, DigitalInputCard } from '@/components/iot/InputDisplays';
import { ParameterCard } from '@/components/iot/ParameterCard';
import { StatusCard } from '@/components/iot/StatusCard';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useMockIoTData } from '@/hooks/useMockIoTData';
import { useThemeColor } from '@/hooks/useThemeColor';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function IoTDashboardScreen() {
  const [activeTab, setActiveTab] = useState('overview');
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  
  const { sensors, digitalInputs, analogInputs, actuators, historicalData, toggleActuator } = useMockIoTData();
  
  const connectionStatus = 'connected'; // Mock connection status
  const totalAlarms = sensors.filter(s => s.value < s.min || s.value > s.max).length;
  
  const renderTabButton = (id: string, label: string) => (
    <Pressable
      style={({pressed}) => [
        styles.tabButton,
        { 
          backgroundColor: activeTab === id 
            ? colorScheme === 'light' ? '#e0f2fe' : '#1e40af' 
            : 'transparent',
          opacity: pressed ? 0.8 : 1
        }
      ]}
      onPress={() => setActiveTab(id)}
    >
      <Text 
        style={[
          styles.tabText,
          { 
            color: activeTab === id 
              ? colorScheme === 'light' ? '#1e40af' : '#bfdbfe'
              : colorScheme === 'light' ? '#64748b' : '#94a3b8',
            fontWeight: activeTab === id ? '600' : 'normal'
          }
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
  
  const renderOverview = () => (
    <View style={styles.contentContainer}>
      {/* Status Cards */}
      <Text style={[styles.sectionTitle, { color: textColor }]}>System Status</Text>
      <View style={styles.statusGrid}>
        <StatusCard 
          title="Gateway Status" 
          value={connectionStatus} 
          type="connection" 
          icon="wifi"
          style={{ flex: 1 }} 
        />
        <StatusCard 
          title="Active Sensors" 
          value={`${sensors.filter(s => s.status === 'online').length}/${sensors.length}`} 
          type="sensors" 
          icon="activity"
          style={{ flex: 1 }} 
        />
        <StatusCard 
          title="Active Alarms" 
          value={totalAlarms} 
          type="alarms" 
          icon="alert"
          style={{ flex: 1 }} 
        />
        <StatusCard 
          title="Actuators Online" 
          value={`${actuators.filter(a => a.status === 'online').length}/${actuators.length}`} 
          type="actuators" 
          icon="activity"
          style={{ flex: 1 }} 
        />
      </View>

      {/* Recent Parameters */}
      <Text style={[styles.sectionTitle, { color: textColor }]}>Sensor Parameters</Text>
      <View style={styles.cardGrid}>
        {sensors.map(sensor => (
          <View key={sensor.id} style={styles.cardGridItem}>
            <ParameterCard sensor={sensor} />
          </View>
        ))}
      </View>

      {/* Controls */}
      <Text style={[styles.sectionTitle, { color: textColor }]}>Quick Controls</Text>
      <View style={styles.cardGrid}>
        {actuators.slice(0, 4).map(actuator => (
          <View key={actuator.id} style={styles.cardGridItem}>
            <ActuatorControl actuator={actuator} onToggle={toggleActuator} />
          </View>
        ))}
      </View>
    </View>
  );

  const renderParameters = () => (
    <View style={styles.contentContainer}>
      <Text style={[styles.sectionTitle, { color: textColor }]}>Sensor Parameters</Text>
      <View style={styles.cardGrid}>
        {sensors.map(sensor => (
          <View key={sensor.id} style={styles.cardGridItem}>
            <ParameterCard sensor={sensor} />
          </View>
        ))}
      </View>
      
      <Text style={[styles.sectionTitle, { color: textColor }]}>Digital Inputs</Text>
      <View style={styles.cardGrid}>
        {digitalInputs.map(input => (
          <View key={input.id} style={styles.cardGridItem}>
            <DigitalInputCard input={input} />
          </View>
        ))}
      </View>
      
      <Text style={[styles.sectionTitle, { color: textColor }]}>Analog Inputs</Text>
      <View style={styles.cardGrid}>
        {analogInputs.map(input => (
          <View key={input.id} style={styles.cardGridItem}>
            <AnalogInputCard input={input} />
          </View>
        ))}
      </View>
    </View>
  );

  const renderControls = () => (
    <View style={styles.contentContainer}>
      <Text style={[styles.sectionTitle, { color: textColor }]}>Actuator Controls</Text>
      <View style={styles.cardGrid}>
        {actuators.map(actuator => (
          <View key={actuator.id} style={styles.cardGridItem}>
            <ActuatorControl actuator={actuator} onToggle={toggleActuator} />
          </View>
        ))}
      </View>
    </View>
  );

  const renderAnalytics = () => (
    <View style={[styles.contentContainer, styles.centerContent]}>
      <Text style={[styles.comingSoonText, { color: textColor }]}>
        Analytics charts will be implemented soon
      </Text>
    </View>
  );

  const renderHistory = () => (
    <View style={[styles.contentContainer, styles.centerContent]}>
      <Text style={[styles.comingSoonText, { color: textColor }]}>
        History table will be implemented soon
      </Text>
    </View>
  );

  const renderSettings = () => (
    <View style={styles.contentContainer}>
      <Text style={[styles.sectionTitle, { color: textColor }]}>Gateway Configuration</Text>
      <View style={styles.settingsContainer}>
        <View style={styles.settingsGrid}>
          <View style={styles.settingsItem}>
            <Text style={[styles.settingLabel, { color: textColor }]}>Gateway IP</Text>
            <Text style={[styles.settingValue, { color: textColor + '99' }]}>192.168.1.100</Text>
          </View>
          <View style={styles.settingsItem}>
            <Text style={[styles.settingLabel, { color: textColor }]}>Port</Text>
            <Text style={[styles.settingValue, { color: textColor + '99' }]}>8080</Text>
          </View>
          <View style={styles.settingsItem}>
            <Text style={[styles.settingLabel, { color: textColor }]}>Protocol</Text>
            <Text style={[styles.settingValue, { color: textColor + '99' }]}>MQTT</Text>
          </View>
          <View style={styles.settingsItem}>
            <Text style={[styles.settingLabel, { color: textColor }]}>Update Interval</Text>
            <Text style={[styles.settingValue, { color: textColor + '99' }]}>5 seconds</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'parameters':
        return renderParameters();
      case 'controls':
        return renderControls();
      case 'analytics':
        return renderAnalytics();
      case 'history':
        return renderHistory();
      case 'settings':
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <View style={[styles.header, { borderBottomColor: textColor + '20' }]}>
        <Text style={[styles.headerTitle, { color: textColor }]}>
          IoT Gateway Dashboard
        </Text>
      </View>
      
      <View style={styles.tabBar}>
        {renderTabButton('overview', 'Overview')}
        {renderTabButton('parameters', 'Parameters')}
        {renderTabButton('controls', 'Controls')}
        {renderTabButton('analytics', 'Analytics')}
        {renderTabButton('history', 'History')}
        {renderTabButton('settings', 'Settings')}
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  tabBar: {
    flexDirection: 'row',
    padding: 8,
    overflowX: 'scroll',
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  tabText: {
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  contentContainer: {
    padding: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  comingSoonText: {
    fontSize: 18,
    fontWeight: '500',
    opacity: 0.7,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 12,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  cardGridItem: {
    width: '48%', // Approximately half width with gap
    flexGrow: 1,
    flexShrink: 0,
  },
  settingsContainer: {
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 12,
    padding: 16,
  },
  settingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  settingsItem: {
    width: '45%', // Approximately half width with gap
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingValue: {
    fontSize: 14,
  },
});
