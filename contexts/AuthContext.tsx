import { authService, LoginRequest, LoginResponse } from '@/services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface User {
  username: string;
  email: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user_data',
  EXPIRATION: 'token_expiration',
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  console.log('AuthProvider: Current state -', { 
    hasUser: !!user, 
    hasToken: !!token, 
    isAuthenticated, 
    isLoading,
    username: user?.username 
  });

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const [storedToken, storedUser, storedExpiration] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.USER),
        AsyncStorage.getItem(STORAGE_KEYS.EXPIRATION),
      ]);

      if (storedToken && storedUser && storedExpiration) {
        // Check if token is expired
        if (!authService.isTokenExpired(storedExpiration)) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } else {
          // Try to refresh token
          await refreshAuth();
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      await clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true);
      console.log('AuthContext: Starting login process');
      const response: LoginResponse = await authService.login(credentials);
      console.log('AuthContext: Login API response received', { success: response.success, username: response.username });
      
      const userData: User = {
        username: response.username,
        email: credentials.email,
        roles: response.roles,
      };

      // Store authentication data
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.token),
        AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken),
        AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData)),
        AsyncStorage.setItem(STORAGE_KEYS.EXPIRATION, response.expiration),
      ]);

      console.log('AuthContext: Setting token and user state');
      setToken(response.token);
      setUser(userData);
      console.log('AuthContext: Auth state updated, isAuthenticated should be true');
    } catch (error) {
      console.error('AuthContext: Login failed', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAuth = async (): Promise<void> => {
    try {
      const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await authService.refreshToken(refreshToken);
      
      const userData: User = {
        username: response.username,
        email: user?.email || '',
        roles: response.roles,
      };

      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.TOKEN, response.token),
        AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken),
        AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData)),
        AsyncStorage.setItem(STORAGE_KEYS.EXPIRATION, response.expiration),
      ]);

      setToken(response.token);
      setUser(userData);
    } catch (error) {
      console.error('Error refreshing auth:', error);
      await clearAuthData();
    }
  };

  const clearAuthData = async (): Promise<void> => {
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.TOKEN),
      AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
      AsyncStorage.removeItem(STORAGE_KEYS.USER),
      AsyncStorage.removeItem(STORAGE_KEYS.EXPIRATION),
    ]);

    setToken(null);
    setUser(null);
  };

  const contextValue: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}