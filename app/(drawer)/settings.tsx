import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  
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
          Settings
        </Text>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Gateway Configuration</Text>
          <View style={[styles.settingsContainer, { backgroundColor: colorScheme === 'dark' ? '#1e293b' : 'rgba(0,0,0,0.03)' }]}>
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
  settingsContainer: {
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
