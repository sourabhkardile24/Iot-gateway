# IoT Gateway Authentication

This document describes the authentication system implemented for the IoT Gateway application.

## Overview

The authentication system provides secure login functionality that connects to a backend API hosted locally on `http://localhost:5244`. It includes token-based authentication with JWT tokens and refresh token support.

## Backend API

### Login Endpoint
- **URL**: `http://localhost:5244/api/Auth/login`
- **Method**: POST
- **Content-Type**: `application/json`

### Request Format
```json
{
  "email": "sourabh@gmail.com",
  "password": "Pa$$w0rd"
}
```

### Response Format
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "t2qsb9bCM74bOiWq2Rm/SgW+twEt76c4oI8gb+PjoIs=",
  "username": "IUCAdmin",
  "roles": ["User"],
  "expiration": "2025-09-21T08:59:22.3469285Z",
  "message": "Login successful"
}
```

## Implementation Details

### Components Created

1. **AuthService** (`services/authService.ts`)
   - Handles API calls to the backend
   - Manages login, logout, and token refresh
   - Token expiration validation

2. **AuthContext** (`contexts/AuthContext.tsx`)
   - React context for global authentication state
   - Manages user session and token storage
   - Uses AsyncStorage for persistent storage

3. **LoginScreen** (`app/login.tsx`)
   - User interface for login form
   - Email and password input fields
   - Error handling and loading states
   - Responsive design with theming support

4. **Authentication Types** (`types/auth.ts`)
   - TypeScript interfaces for type safety
   - Defines data structures for auth-related objects

### Routing Protection

The app routing has been modified to:
- Show login screen when user is not authenticated
- Redirect to main dashboard after successful login
- Protect all drawer routes behind authentication
- Show loading screen during authentication check

### Features

- **Secure Storage**: Tokens are stored securely using AsyncStorage
- **Token Refresh**: Automatic token refresh when expired
- **User Session**: Persistent login across app restarts
- **Logout Functionality**: Clear session and redirect to login
- **Error Handling**: Comprehensive error messages for failed logins
- **Loading States**: Visual feedback during authentication processes
- **Theme Support**: Login screen adapts to light/dark themes

### Testing

Use the test credentials provided:
- **Email**: `sourabh@gmail.com`
- **Password**: `Pa$$w0rd`

### Security Considerations

1. **Token Storage**: Tokens are stored in AsyncStorage (consider upgrading to Keychain/Keystore for production)
2. **HTTPS**: Backend should use HTTPS in production
3. **Token Expiration**: Tokens have expiration dates and are validated
4. **Refresh Tokens**: Implemented for seamless token renewal

### Usage

1. Start the backend server on `http://localhost:5244`
2. Launch the Expo app
3. The app will automatically show the login screen if not authenticated
4. Enter credentials and tap "Sign In"
5. Upon successful authentication, you'll be redirected to the main dashboard
6. Use the logout button in the drawer menu to sign out

### Troubleshooting

1. **Network Errors**: Ensure backend is running on the correct port
2. **Authentication Failures**: Verify credentials are correct
3. **Token Issues**: Check token expiration and refresh logic
4. **Storage Issues**: Clear AsyncStorage if needed during development

### Future Enhancements

- Biometric authentication
- Password reset functionality
- Multi-factor authentication
- Advanced security features