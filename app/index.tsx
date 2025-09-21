import { useAuth } from '@/contexts/AuthContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  const backgroundColor = useThemeColor({}, 'background');

  console.log('Index: isLoading =', isLoading, 'isAuthenticated =', isAuthenticated);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        console.log('Index: User authenticated, navigating to drawer');
        router.replace('/(drawer)');
      } else {
        console.log('Index: User not authenticated, navigating to login');
        router.replace('/login');
      }
    }
  }, [isLoading, isAuthenticated]);

  console.log('Index: Showing loading screen');
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
