import { ActuatorControl } from '@/components/iot/ActuatorControl';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useMockIoTData } from '@/hooks/useMockIoTData';
import { useThemeColor } from '@/hooks/useThemeColor';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ControlsScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  
  const { actuators } = useMockIoTData();
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <View style={[styles.header, { borderBottomColor: textColor + '20' }]}>
        <Pressable 
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={styles.menuButton}
        >
          <IconSymbol name="line.3.horizontal" size={24} color={textColor} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: textColor }]}>
          Controls
        </Text>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Actuator Controls</Text>
          <View style={styles.cardGrid}>
            {actuators.map(actuator => (
              <View key={actuator.id} style={styles.cardGridItem}>
                <ActuatorControl actuator={actuator} onToggle={() => {}} />
              </View>
            ))}
          </View>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  menuButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 12,
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
});
