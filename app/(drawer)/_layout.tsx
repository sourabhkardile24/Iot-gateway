import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '@/hooks/useThemeColor';

// Define a type for the screen items
type ScreenItem = {
  name: string;
  path: string;
  label: string;
  icon: string;
};

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const screens: ScreenItem[] = [
    { name: 'overview', path: '/overview', label: 'Overview', icon: 'house.fill' },
    { name: 'parameters', path: '/parameters', label: 'Parameters', icon: 'gauge' },
    { name: 'controls', path: '/controls', label: 'Controls', icon: 'switch.2' },
    { name: 'analytics', path: '/analytics', label: 'Analytics', icon: 'chart.bar.fill' },
    { name: 'history', path: '/history', label: 'History', icon: 'clock.fill' },
    { name: 'settings', path: '/settings', label: 'Settings', icon: 'gearshape.fill' },
  ];

  return (
    <DrawerContentScrollView 
      {...props} 
      style={{ backgroundColor }}
      contentContainerStyle={styles.drawerScrollContent}
    >
      <View style={[styles.drawerHeader, { borderBottomColor: textColor + '20' }]}>
        <Text style={[styles.drawerTitle, { color: textColor }]}>IoT Gateway</Text>
      </View>
      
      <View style={styles.drawerContent}>
        {screens.map((screen) => {
          const isFocused = props.state.routeNames[props.state.index] === screen.name;
          
          return (
            <Pressable
              key={screen.name}
              onPress={() => props.navigation.navigate(screen.name)}
              style={({pressed}) => [
                styles.drawerItem,
                { 
                  backgroundColor: isFocused 
                    ? colorScheme === 'light' ? '#e0f2fe' : '#1e40af' 
                    : 'transparent',
                  opacity: pressed ? 0.8 : 1
                }
              ]}
            >
              <IconSymbol 
                name={screen.icon} 
                size={22} 
                color={isFocused ? tintColor : textColor + '80'} 
              />
              <Text 
                style={[
                  styles.drawerLabel,
                  { 
                    color: isFocused 
                      ? tintColor
                      : textColor + '80',
                    fontWeight: isFocused ? '600' : 'normal'
                  }
                ]}
              >
                {screen.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  const colorScheme = useColorScheme();

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
        overlayColor: colorScheme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.3)',
      }}
    >
      <Drawer.Screen name="index" options={{ headerShown: false }} />
      <Drawer.Screen name="overview" options={{ headerShown: false }} />
      <Drawer.Screen name="parameters" options={{ headerShown: false }} />
      <Drawer.Screen name="controls" options={{ headerShown: false }} />
      <Drawer.Screen name="analytics" options={{ headerShown: false }} />
      <Drawer.Screen name="history" options={{ headerShown: false }} />
      <Drawer.Screen name="settings" options={{ headerShown: false }} />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerScrollContent: {
    flex: 1,
  },
  drawerHeader: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  drawerTitle: {
    fontSize: 22,
    fontWeight: '600',
  },
  drawerContent: {
    paddingVertical: 8,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  drawerLabel: {
    marginLeft: 16,
    fontSize: 16,
  },
});
