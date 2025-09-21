import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { AlertListModal, AlertModal } from '@/components/AlertModal';
import { AuthGuard } from '@/components/AuthGuard';
import { AlertProvider, useAlert } from '@/contexts/AlertContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';

// Component to handle alert modals within the alert context
function AlertModals() {
  const { alerts } = useAlert();
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showAlertList, setShowAlertList] = useState(false);

  // Get active (non-dismissed) alerts
  const activeAlerts = alerts.filter(alert => !alert.dismissed);

  // Show modal when new alerts are added
  useEffect(() => {
    if (activeAlerts.length > 0 && !showAlertModal) {
      setCurrentAlertIndex(0);
      setShowAlertModal(true);
    } else if (activeAlerts.length === 0 && showAlertModal) {
      setShowAlertModal(false);
    }
  }, [activeAlerts.length, showAlertModal]);

  const handleCloseAlert = () => {
    setShowAlertModal(false);
    
    // Check if there are more active alerts after a brief delay to allow for state updates
    setTimeout(() => {
      const remainingAlerts = alerts.filter(alert => !alert.dismissed);
      if (remainingAlerts.length > 0) {
        setCurrentAlertIndex(0);
        setShowAlertModal(true);
      }
    }, 100);
  };

  return (
    <>
      <AlertModal
        visible={showAlertModal}
        onClose={handleCloseAlert}
        alert={activeAlerts[currentAlertIndex]}
      />
      <AlertListModal
        visible={showAlertList}
        onClose={() => setShowAlertList(false)}
      />
    </>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <AuthProvider>
      <AlertProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <AuthGuard>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="debug-auth" options={{ title: 'Auth Debug' }} />
              <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" options={{ headerShown: false }} />
            </Stack>
          </AuthGuard>
          <AlertModals />
          <StatusBar style="auto" />
        </ThemeProvider>
      </AlertProvider>
    </AuthProvider>
  );
}
