import { ActuatorControl } from '@/components/iot/ActuatorControl';
import { DigitalInputCard } from '@/components/iot/InputDisplays';
import { ParameterCard } from '@/components/iot/ParameterCard';
import { StatusCard } from '@/components/iot/StatusCard';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useIoTData } from '@/hooks/useIoTData';
import { useDeviceData } from '@/hooks/useDeviceData';
import { useThemeColor } from '@/hooks/useThemeColor';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useState } from 'react';
import {
  Animated,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View
} from 'react-native';

export default function OverviewScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const { width } = useWindowDimensions();
  
  // State for animations and interactivity
  const [refreshing, setRefreshing] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('sensors');
  const fabAnim = useState(new Animated.Value(0))[0];
  const headerAnim = useState(new Animated.Value(0))[0];
  
  const { sensors, actuators, toggleActuator, systemStatus } = useIoTData();
  const { deviceData, isLoading: deviceLoading, error: deviceError, refreshData } = useDeviceData();
  
  // Use device data if available, fall back to mock data
  const digitalInputs = deviceData?.digitalInputs || [];
  const gatewayStatus = deviceData?.systemStatus || systemStatus;
  const deviceTimestamp = deviceData?.timestamp;
  
  // Calculate responsive column count
  const getColumnCount = useCallback(() => {
    if (width >= 1024) return 4; // Large tablets and desktops
    if (width >= 768) return 3; // Tablets
    if (width >= 500) return 2; // Large phones
    return 1; // Small phones
  }, [width]);
  
  const columnCount = getColumnCount();
  
  // For status cards, we'll use a 2x2 grid on very small screens
  const statusColumnCount = width < 500 ? 2 : Math.min(4, columnCount);
  
  // Get statuses from system status
  const connectionStatus = gatewayStatus.gatewayConnected ? 'Connected' : 'Disconnected';
  const powerStatus: string = 'powerStatus' in gatewayStatus ? (gatewayStatus as any).powerStatus : 'OFF';
  const sensorStatus = `${gatewayStatus.sensorsConnected}/${gatewayStatus.totalSensors}`;
  const actuatorStatus = `${gatewayStatus.actuatorsOnline}/${gatewayStatus.totalActuators}`;
  const alarmCount = gatewayStatus.activeAlarms;
  
  // Animation for FAB
  const toggleFab = () => {
    const toValue = fabOpen ? 0 : 1;
    Animated.spring(fabAnim, {
      toValue,
      friction: 6,
      useNativeDriver: true
    }).start();
    setFabOpen(!fabOpen);
  };
  
  // Animation values for FAB items
  const fabRotation = fabAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg']
  });
  
  // Handle refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    
    // Animate header during refresh
    Animated.sequence([
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(headerAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      })
    ]).start();
    
    // Refresh device data
    refreshData();
    
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, [refreshData]);
  
  // Header animation values
  const headerScale = headerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.03]
  });
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      {/* Animated Header */}
      <Animated.View 
        style={[
          styles.header, 
          { 
            borderBottomColor: textColor + '20',
            transform: [{ scale: headerScale }] 
          }
        ]}
      >
        <Pressable 
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={({pressed}) => [
            styles.menuButton,
            {opacity: pressed ? 0.7 : 1}
          ]}
        >
          <IconSymbol name="line.3.horizontal" size={24} color={textColor} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: textColor }]}>
          Overview
        </Text>
        
        {/* Section Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[
              styles.tab, 
              selectedSection === 'sensors' ? styles.activeTab : null,
              {borderBottomColor: selectedSection === 'sensors' ? textColor : 'transparent'}
            ]} 
            onPress={() => setSelectedSection('sensors')}
          >
            <Text style={[
              styles.tabText, 
              { color: selectedSection === 'sensors' ? textColor : textColor + '80' }
            ]}>Sensors</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.tab, 
              selectedSection === 'actuators' ? styles.activeTab : null,
              {borderBottomColor: selectedSection === 'actuators' ? textColor : 'transparent'}
            ]} 
            onPress={() => setSelectedSection('actuators')}
          >
            <Text style={[
              styles.tabText, 
              { color: selectedSection === 'actuators' ? textColor : textColor + '80' }
            ]}>Controls</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      
      {/* Main Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={textColor} 
            colors={['#10b981', '#3b82f6']}
          />
        }
      >
        <View style={styles.contentContainer}>
          
          {/* Status Cards Grid - Responsive layout for mobile */}
          {width < 500 ? (
            // Mobile layout (2x2 grid)
            <View style={styles.statusGridMobile}>
              <View style={styles.statusRowMobile}>
                <View style={styles.statusCardContainer}>
                  <StatusCard 
                    title="Gateway Status" 
                    value={connectionStatus} 
                    type="connection" 
                    icon="wifi"
                  />
                </View>
                <View style={styles.statusCardContainer}>
                  <StatusCard 
                    title="Power Status" 
                    value={powerStatus} 
                    type="connection" 
                    icon="activity"
                  />
                </View>
              </View>
              <View style={styles.statusRowMobile}>
                <View style={styles.statusCardContainer}>
                  <StatusCard 
                    title="Active Alarms" 
                    value={alarmCount} 
                    type="alarms" 
                    icon="alert"
                  />
                </View>
                <View style={styles.statusCardContainer}>
                  <StatusCard 
                    title="Digital Inputs" 
                    value={`${digitalInputs.filter(i => i.value).length}/${digitalInputs.length}`} 
                    type="sensors" 
                    icon="activity"
                  />
                </View>
              </View>
            </View>
          ) : (
            // Tablet/Desktop layout (row)
            <View style={styles.statusGrid}>
              <StatusCard 
                title="Gateway Status" 
                value={connectionStatus} 
                type="connection" 
                icon="wifi"
                style={{ flex: 1 }}
              />
              <StatusCard 
                title="Power Status" 
                value={powerStatus} 
                type="connection" 
                icon="activity"
                style={{ flex: 1 }}
              />
              <StatusCard 
                title="Active Alarms" 
                value={alarmCount} 
                type="alarms" 
                icon="alert"
                style={{ flex: 1 }}
              />
              <StatusCard 
                title="Digital Inputs" 
                value={`${digitalInputs.filter(i => i.value).length}/${digitalInputs.length}`}
                type="sensors" 
                icon="activity"
                style={{ flex: 1 }}
              />
            </View>
          )}

          {/* Conditional rendering based on selected section */}
          {selectedSection === 'sensors' ? (
            <>
              <Text style={[styles.sectionTitle, { color: textColor }]}>Sensor Parameters</Text>
              <View style={[styles.sensorParametersGrid, { gap: 12 }]}>
                {sensors.map((sensor) => (
                  <Animated.View 
                    key={sensor.id}
                    style={[
                      { width: `${100/Math.min(columnCount, 4) - 2}%` },
                      { opacity: 1, transform: [{ translateY: 0 }] } // Initial animation state
                    ]}
                  >
                    <ParameterCard sensor={sensor} />
                  </Animated.View>
                ))}
              </View>
            </>
          ) : (
            <>
              <Text style={[styles.sectionTitle, { color: textColor }]}>Quick Controls</Text>
              <View style={[styles.controlGrid, { gap: 10 }]}>
                {actuators.map((actuator) => (
                  <Animated.View 
                    key={actuator.id} 
                    style={[
                      styles.controlGridItem, 
                      { width: `${100/Math.min(columnCount, 2) - 2}%` },
                      { opacity: 1, transform: [{ translateY: 0 }] } // Initial animation state
                    ]}
                  >
                    <ActuatorControl 
                      actuator={actuator} 
                      onToggle={toggleActuator}
                    />
                  </Animated.View>
                ))}
              </View>
            </>
          )}
          <Text style={[styles.sectionTitle, { color: textColor }]}>Digital Inputs</Text>
          {deviceTimestamp && (
            <Text style={[styles.timestampText, { color: textColor + '80' }]}>
              Last Updated: {deviceTimestamp}
            </Text>
          )}
          {deviceError && (
            <Text style={[styles.errorText, { color: '#ef4444' }]}>
              Error: {deviceError}
            </Text>
          )}
          <View style={styles.cardGrid}>
            {digitalInputs.map(input => (
              <View key={input.id} style={styles.cardGridItem}>
                <DigitalInputCard input={input} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      
      {/* Floating Action Button */}
      <View style={styles.fabContainer}>
        {fabOpen && (
          <View style={styles.fabActions}>
            <TouchableOpacity 
              style={[styles.fabAction, { backgroundColor: '#3b82f6' }]}
              onPress={() => {
                toggleFab();
                // Navigate to dashboard
                navigation.dispatch(DrawerActions.closeDrawer());
                navigation.navigate('index' as never);
              }}
            >
              <LinearGradient
                colors={['#3b82f6', '#2563eb']}
                style={styles.fabActionInner}
              >
                <IconSymbol name="chart.bar" size={20} color="#fff" />
              </LinearGradient>
              <Text style={styles.fabActionText}>Dashboard</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.fabAction, { backgroundColor: '#10b981' }]}
              onPress={() => {
                toggleFab();
                // Navigate to controls
                navigation.dispatch(DrawerActions.closeDrawer());
                navigation.navigate('controls' as never);
              }}
            >
              <LinearGradient
                colors={['#10b981', '#059669']}
                style={styles.fabActionInner}
              >
                <IconSymbol name="switch.2" size={20} color="#fff" />
              </LinearGradient>
              <Text style={styles.fabActionText}>Controls</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <TouchableOpacity 
          style={styles.fab}
          onPress={toggleFab}
        >
          <LinearGradient
            colors={['#6366f1', '#4f46e5']} 
            style={styles.fabGradient}
          >
            <Animated.View style={{ transform: [{ rotate: fabRotation }] }}>
              <IconSymbol name="plus" size={24} color="#fff" />
            </Animated.View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    zIndex: 10,
  },
  menuButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 2,
    marginHorizontal: 4,
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80, // Extra padding for FAB
  },
  contentContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 12,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginBottom: 24,
  },
  statusGridMobile: {
    flexDirection: 'column',
    marginBottom: 24,
  },
  statusRowMobile: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statusCardContainer: {
    width: '100%',
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
  controlGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  controlGridItem: {
    marginBottom: 8,
  },
  sensorParametersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  // FAB Styles
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'flex-end',
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabActions: {
    marginBottom: 16,
  },
  fabAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    paddingRight: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  fabActionInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  fabActionText: {
    color: 'white',
    fontWeight: '500',
  },
  timestampText: {
    fontSize: 12,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '500',
  },
});
