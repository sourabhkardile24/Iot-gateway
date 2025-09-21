import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { testBackendConnection } from '../services/authTest';

export default function AuthDebugScreen() {
  const [isTestingAuth, setIsTestingAuth] = useState(false);
  const [isTestingBackend, setIsTestingBackend] = useState(false);
  const [testResults, setTestResults] = useState<string>('');

  const handleTestAuth = async () => {
    setIsTestingAuth(true);
    setTestResults('Testing authentication...\n');
    
    try {
      const response = await testBackendConnection();
      setTestResults(prev => prev + `✅ Authentication test successful!\n` +
        `Username: ${response.username}\n` +
        `Roles: ${response.roles.join(', ')}\n` +
        `Token length: ${response.token.length}\n` +
        `Expires: ${new Date(response.expiration).toLocaleString()}\n\n`);
    } catch (error) {
      setTestResults(prev => prev + `❌ Authentication test failed:\n${error}\n\n`);
    } finally {
      setIsTestingAuth(false);
    }
  };

  const handleTestBackend = async () => {
    setIsTestingBackend(true);
    setTestResults('Testing backend connection...\n');
    
    try {
      const response = await fetch('http://localhost:5244/api/Auth/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'sourabh@gmail.com',
          password: 'Pa$$w0rd'
        }),
      });

      const responseText = await response.text();
      
      setTestResults(prev => prev + `Backend response:\n` +
        `Status: ${response.status}\n` +
        `Headers: ${JSON.stringify([...response.headers.entries()], null, 2)}\n` +
        `Body: ${responseText}\n\n`);
        
      if (response.ok) {
        const data = JSON.parse(responseText);
        Alert.alert('Success', `Backend is working! Username: ${data.username}`);
      } else {
        Alert.alert('Backend Error', `Status: ${response.status}\nResponse: ${responseText}`);
      }
    } catch (error) {
      setTestResults(prev => prev + `❌ Backend test failed:\n${error}\n\n`);
      Alert.alert('Backend Error', `Error: ${error}`);
    } finally {
      setIsTestingBackend(false);
    }
  };

  const clearResults = () => {
    setTestResults('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Authentication Debug Tool</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#4CAF50' }]}
          onPress={handleTestAuth}
          disabled={isTestingAuth}
        >
          <Text style={styles.buttonText}>
            {isTestingAuth ? 'Testing Auth...' : 'Test Authentication'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#2196F3' }]}
          onPress={handleTestBackend}
          disabled={isTestingBackend}
        >
          <Text style={styles.buttonText}>
            {isTestingBackend ? 'Testing Backend...' : 'Test Backend Direct'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#FF9800' }]}
          onPress={clearResults}
        >
          <Text style={styles.buttonText}>Clear Results</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.resultsContainer}>
        <Text style={styles.resultsText}>{testResults}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 10,
  },
  resultsText: {
    color: '#00ff00',
    fontFamily: 'monospace',
    fontSize: 12,
  },
});