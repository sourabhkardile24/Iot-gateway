import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const backgroundColor = useThemeColor({}, 'background');

  // This is just a loading screen - AuthGuard handles all navigation logic
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor 
    }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
