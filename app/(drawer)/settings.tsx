import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const { user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  
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

          {/* Account Section */}
          <Text style={[styles.sectionTitle, { color: textColor }]}>Account</Text>
          <View style={[styles.settingsContainer, { backgroundColor: colorScheme === 'dark' ? '#1e293b' : 'rgba(0,0,0,0.03)' }]}>
            {user && (
              <View style={styles.accountInfo}>
                <View style={styles.settingsItem}>
                  <Text style={[styles.settingLabel, { color: textColor }]}>Username</Text>
                  <Text style={[styles.settingValue, { color: textColor + '99' }]}>{user.username}</Text>
                </View>
                <View style={styles.settingsItem}>
                  <Text style={[styles.settingLabel, { color: textColor }]}>Email</Text>
                  <Text style={[styles.settingValue, { color: textColor + '99' }]}>{user.email}</Text>
                </View>
                <View style={styles.settingsItem}>
                  <Text style={[styles.settingLabel, { color: textColor }]}>Roles</Text>
                  <Text style={[styles.settingValue, { color: textColor + '99' }]}>{user.roles.join(', ')}</Text>
                </View>
              </View>
            )}
            
            <View style={[styles.logoutButtonContainer, { borderTopColor: textColor + '20' }]}>
              <Pressable
                onPress={handleLogout}
                disabled={isLoading}
                style={({pressed}) => [
                  styles.logoutButtonSettings,
                  { 
                    backgroundColor: '#ef4444',
                    opacity: pressed ? 0.8 : (isLoading ? 0.6 : 1)
                  }
                ]}
              >
                <IconSymbol 
                  name="power" 
                  size={18} 
                  color="white" 
                />
                <Text style={styles.logoutButtonText}>
                  {isLoading ? 'Logging out...' : 'Logout'}
                </Text>
              </Pressable>
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
  accountInfo: {
    marginBottom: 16,
  },
  logoutButtonContainer: {
    paddingTop: 16,
    marginTop: 16,
    borderTopWidth: 1,
  },
  logoutButtonSettings: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  logoutButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
