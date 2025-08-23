import React, { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SAMPLE_PAYLOAD, useMQTT } from '../services/mqttService';

// MQTT Test Topic
const TEST_TOPIC = 'iot-gateway/test/sensor-data';

const MQTTTestScreen = () => {
  const { connect, disconnect, publish, subscribe, isConnected, messages, error } = useMQTT();
  const [customTopic, setCustomTopic] = useState(TEST_TOPIC);
  const [customMessage, setCustomMessage] = useState(SAMPLE_PAYLOAD);
  
  useEffect(() => {
    return () => {
      // Clean up by disconnecting when component unmounts
      disconnect();
    };
  }, [disconnect]);

  const handlePublishCustom = () => {
    if (customTopic.trim() && customMessage.trim()) {
      publish(customTopic, customMessage);
    }
  };

  const handleSubscribeCustom = () => {
    if (customTopic.trim()) {
      subscribe(customTopic);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MQTT Test Client</Text>
      
      <View style={styles.connectionStatus}>
        <Text style={styles.statusLabel}>Status: </Text>
        <Text style={isConnected ? styles.connectedText : styles.disconnectedText}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </Text>
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      <View style={styles.buttonContainer}>
        <Button
          title={isConnected ? "Disconnect" : "Connect"}
          onPress={isConnected ? disconnect : connect}
          color={isConnected ? "#ff6347" : "#4CAF50"}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Topic:</Text>
        <TextInput
          style={styles.textInput}
          value={customTopic}
          onChangeText={setCustomTopic}
          placeholder="Enter MQTT topic"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Message:</Text>
        <TextInput
          style={[styles.textInput, styles.messageInput]}
          value={customMessage}
          onChangeText={setCustomMessage}
          placeholder="Enter message to publish"
          multiline
        />
      </View>
      
      <View style={styles.buttonRow}>
        <Button
          title="Subscribe"
          onPress={handleSubscribeCustom}
          disabled={!isConnected}
          color="#2196F3"
        />
        <View style={styles.buttonSpacer} />
        <Button
          title="Publish"
          onPress={handlePublishCustom}
          disabled={!isConnected}
          color="#673AB7"
        />
      </View>
      
      <Text style={styles.messagesTitle}>Received Messages:</Text>
      <ScrollView style={styles.messagesContainer}>
        {messages.length === 0 ? (
          <Text style={styles.noMessages}>No messages received</Text>
        ) : (
          messages.map((msg, index) => (
            <View key={index} style={styles.messageItem}>
              <Text style={styles.messageTopic}>{msg.topic}</Text>
              <Text style={styles.messageTime}>
                {msg.timestamp.toLocaleTimeString()}
              </Text>
              <Text style={styles.messageContent}>{msg.message}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  connectedText: {
    fontSize: 16,
    color: 'green',
  },
  disconnectedText: {
    fontSize: 16,
    color: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  textInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  buttonSpacer: {
    width: 16,
  },
  messagesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  },
  noMessages: {
    padding: 16,
    fontStyle: 'italic',
    color: '#888',
  },
  messageItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  messageTopic: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  messageContent: {
    fontSize: 14,
  },
});

export default MQTTTestScreen;
