import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeColor } from '@/hooks/useThemeColor';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Validation states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });
  
  const { login, isAuthenticated } = useAuth();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  // Check if user is already authenticated and redirect
  useEffect(() => {
    if (isAuthenticated) {
      console.log('LoginScreen: User is authenticated, redirecting to drawer');
      setTimeout(() => {
        router.replace('/(drawer)');
      }, 100); // Small delay to ensure state is fully updated
    }
  }, [isAuthenticated]);

  // Validation functions
  const validateEmail = (email: string): string => {
    if (!email.trim()) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePassword = (password: string): string => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return '';
  };

  // Handle email change with validation
  const handleEmailChange = (text: string) => {
    setEmail(text);
    setLoginError(''); // Clear login error when user starts typing
    if (touched.email) {
      setEmailError(validateEmail(text));
    }
  };

  // Handle password change with validation
  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setLoginError(''); // Clear login error when user starts typing
    if (touched.password) {
      setPasswordError(validatePassword(text));
    }
  };

  // Handle input blur (when user leaves field)
  const handleEmailBlur = () => {
    setTouched(prev => ({ ...prev, email: true }));
    setEmailError(validateEmail(email));
  };

  const handlePasswordBlur = () => {
    setTouched(prev => ({ ...prev, password: true }));
    setPasswordError(validatePassword(password));
  };

  // Check if form is valid
  const isFormValid = () => {
    const emailValid = validateEmail(email) === '';
    const passwordValid = validatePassword(password) === '';
    return emailValid && passwordValid;
  };

  const handleLogin = async () => {
    // Clear any previous login errors
    setLoginError('');
    
    // Mark all fields as touched to show validation errors
    setTouched({ email: true, password: true });
    
    const emailValidationError = validateEmail(email);
    const passwordValidationError = validatePassword(password);
    
    setEmailError(emailValidationError);
    setPasswordError(passwordValidationError);

    if (emailValidationError || passwordValidationError) {
      Alert.alert('Validation Error', 'Please correct the errors before continuing');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Attempting login with:', { email: email.trim(), password: '***' });
      await login({ email: email.trim(), password });
      console.log('Login successful, should redirect now');
      
      // Force redirect after successful login with a small delay
      setTimeout(() => {
        router.replace('/(drawer)');
      }, 500);
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle specific API error types
      if (error && typeof error === 'object' && 'type' in error) {
        switch (error.type) {
          case 'INVALID_PASSWORD':
            setPasswordError('Invalid password. Please check your password and try again.');
            setLoginError('');
            break;
          case 'INVALID_EMAIL':
            setEmailError('Email not found. Please check your email address.');
            setLoginError('');
            break;
          case 'INVALID_CREDENTIALS':
            setLoginError('Invalid email or password. Please check your credentials and try again.');
            break;
          case 'SERVER_ERROR':
            setLoginError('Server error. Please try again later.');
            break;
          case 'NETWORK_ERROR':
            setLoginError('Network error. Please check your connection and try again.');
            break;
          default:
            setLoginError(error.message || 'Login failed. Please try again.');
        }
      } else {
        // Fallback for unexpected errors
        const errorMessage = error instanceof Error ? error.message : 'Login failed';
        setLoginError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Forgot Password',
      'Please contact your administrator to reset your password.',
      [{ text: 'OK' }]
    );
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <LinearGradient
            colors={['#4facfe', '#00f2fe']}
            style={styles.logoContainer}
          >
            <IconSymbol name="bolt.fill" size={40} color="white" />
          </LinearGradient>
          <Text style={[styles.title, { color: textColor }]}>IoT Gateway</Text>
          <Text style={[styles.subtitle, { color: textColor + '80' }]}>
            Sign in to access your dashboard
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: textColor }]}>Email</Text>
            <View style={[
              styles.inputWrapper, 
              { 
                borderColor: emailError && touched.email ? '#ff4444' : textColor + '20',
                borderWidth: emailError && touched.email ? 2 : 1
              }
            ]}>
              <IconSymbol name="envelope.fill" size={20} color={textColor + '60'} />
              <TextInput
                style={[styles.input, { color: textColor }]}
                placeholder="Enter your email"
                placeholderTextColor={textColor + '60'}
                value={email}
                onChangeText={handleEmailChange}
                onBlur={handleEmailBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>
            {emailError && touched.email && (
              <Text style={styles.errorText}>{emailError}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: textColor }]}>Password</Text>
            <View style={[
              styles.inputWrapper, 
              { 
                borderColor: passwordError && touched.password ? '#ff4444' : textColor + '20',
                borderWidth: passwordError && touched.password ? 2 : 1
              }
            ]}>
              <IconSymbol name="lock.fill" size={20} color={textColor + '60'} />
              <TextInput
                style={[styles.input, { color: textColor }]}
                placeholder="Enter your password"
                placeholderTextColor={textColor + '60'}
                value={password}
                onChangeText={handlePasswordChange}
                onBlur={handlePasswordBlur}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
                disabled={isLoading}
              >
                <IconSymbol 
                  name={showPassword ? 'eye.slash.fill' : 'eye.fill'} 
                  size={20} 
                  color={textColor + '60'} 
                />
              </TouchableOpacity>
            </View>
            {passwordError && touched.password && (
              <Text style={styles.errorText}>{passwordError}</Text>
            )}
          </View>

          {loginError && (
            <View style={styles.loginErrorContainer}>
              <IconSymbol name="exclamationmark.triangle.fill" size={16} color="#ff4444" />
              <Text style={styles.loginErrorText}>{loginError}</Text>
            </View>
          )}

          <TouchableOpacity
            onPress={handleForgotPassword}
            style={styles.forgotPasswordButton}
            disabled={isLoading}
          >
            <Text style={[styles.forgotPasswordText, { color: tintColor }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.loginButton,
              { 
                backgroundColor: isFormValid() ? tintColor : textColor + '40',
                opacity: isLoading ? 0.7 : 1
              }
            ]}
            onPress={handleLogin}
            disabled={isLoading || !isFormValid()}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footerContainer}>
          <Text style={[styles.footerText, { color: textColor + '60' }]}>
            Secure IoT Gateway Dashboard
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/debug-auth' as any)}
            style={styles.debugButton}
          >
            <Text style={[styles.debugButtonText, { color: tintColor }]}>
              Debug Authentication
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  eyeIcon: {
    padding: 4,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  footerContainer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
  },
  debugButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  debugButtonText: {
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  loginErrorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#ff4444',
  },
  loginErrorText: {
    color: '#d32f2f',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
    fontWeight: '500',
  },
});