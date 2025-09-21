// Test utility to verify backend connection and login functionality
import { authService } from './authService';

export const testBackendConnection = async () => {
  console.log('Testing backend connection...');
  
  try {
    // Test with the provided credentials
    const testCredentials = {
      email: 'sourabh@gmail.com',
      password: 'Pa$$w0rd'
    };

    console.log('Attempting login with test credentials...');
    const response = await authService.login(testCredentials);
    
    console.log('Login successful!');
    console.log('Response:', {
      success: response.success,
      username: response.username,
      roles: response.roles,
      message: response.message,
      tokenLength: response.token.length,
      expirationDate: new Date(response.expiration).toLocaleString()
    });

    return response;
  } catch (error) {
    console.error('Login test failed:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        console.error('Network error - Make sure backend is running on http://localhost:5244');
      } else if (error.message.includes('401')) {
        console.error('Authentication failed - Check credentials');
      } else if (error.message.includes('404')) {
        console.error('Login endpoint not found - Check API URL');
      }
    }
    
    throw error;
  }
};

export const testTokenValidation = (token: string, expiration: string) => {
  console.log('Testing token validation...');
  
  const isExpired = authService.isTokenExpired(expiration);
  const expirationDate = new Date(expiration);
  const now = new Date();
  const timeUntilExpiration = expirationDate.getTime() - now.getTime();
  
  console.log('Token validation results:', {
    isExpired,
    expirationDate: expirationDate.toLocaleString(),
    currentTime: now.toLocaleString(),
    timeUntilExpirationMs: timeUntilExpiration,
    timeUntilExpirationHours: Math.round(timeUntilExpiration / (1000 * 60 * 60) * 100) / 100
  });
  
  return !isExpired;
};