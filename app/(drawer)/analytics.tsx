import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function AnalyticsScreen() {
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
          Analytics
        </Text>
      </View>
      
      <View style={[styles.centerContent]}>
        <Text style={[styles.comingSoonText, { color: textColor }]}>
          Analytics charts will be implemented soon
        </Text>
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
  },
  menuButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
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
});
