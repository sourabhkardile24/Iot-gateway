import { useAuth } from '@/contexts/AuthContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { router, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const backgroundColor = useThemeColor({}, 'background');

  useEffect(() => {
    if (!isLoading) {
      const currentSegment = segments[0];
      const inAuthGroup = currentSegment === '(drawer)';
      const isLoginPage = currentSegment === 'login';
      const isDebugAuthPage = currentSegment === 'debug-auth';
      const isRootPage = !currentSegment || segments.length === 1;

      console.log('AuthGuard: Current segments:', segments);
      console.log('AuthGuard: Auth state -', { 
        isAuthenticated, 
        inAuthGroup, 
        isLoginPage, 
        isRootPage,
        isDebugAuthPage,
        currentSegment
      });

      if (!isAuthenticated) {
        // User is not authenticated
        if (inAuthGroup) {
          console.log('AuthGuard: Redirecting unauthenticated user from protected route to login');
          router.replace('/login');
        } else if (isRootPage && !isLoginPage && !isDebugAuthPage) {
          console.log('AuthGuard: Redirecting from root to login');
          router.replace('/login');
        }
      } else {
        // User is authenticated
        if (isLoginPage) {
          console.log('AuthGuard: Redirecting authenticated user to main app');
          router.replace('/(drawer)');
        } else if (isRootPage && !isLoginPage && !isDebugAuthPage) {
          console.log('AuthGuard: Redirecting authenticated user from root to main app');
          router.replace('/(drawer)');
        }
      }
    }
  }, [isAuthenticated, isLoading, segments]);

  // Show loading screen while checking authentication
  if (isLoading) {
    console.log('AuthGuard: Showing loading screen');
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

  return <>{children}</>;
}