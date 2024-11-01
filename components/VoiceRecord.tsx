import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 
import Voice, { SpeechResultsEvent, SpeechErrorEvent } from '@react-native-voice/voice';
import ImageApp from './Imageapp';
import { Colors } from '../constants/colors';

const SpeechToText = () => {
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchTriggered, setIsSearchTriggered] = useState(false);

  useEffect(() => {

    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = () => {
    setIsListening(true);
    setError('');
    setIsLoading(false);
    setIsSearchTriggered(false);
  };


  const onSpeechEnd = () => {
    setIsListening(false);
    setIsLoading(false);
    setIsSearchTriggered(true);
  };

  const onSpeechResults = (event: SpeechResultsEvent) => {
    if (event.value && event.value.length > 0) {
      setResult(event.value[0]);
    }
    setIsLoading(false);
  };

  const onSpeechError = (error: SpeechErrorEvent) => {
    setError(error.error?.message || 'An error occurred');
    setIsListening(false);
    setIsLoading(false);
  };

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'This app needs access to your microphone.',
            buttonPositive: 'Grant Permission',
            buttonNegative: 'Cancel',
          }
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Permission Denied',
            'Microphone permission is required.',
            [{ text: 'OK' }]
          );
          return false;
        }
        return true;
      } catch (error) {
        console.error('Permission error:', error);
        Alert.alert('Permission Error', 'Failed to request permission.');
        return false;
      }
    }
    return true;
  };

  const startListening = async () => {
    setError('');
    setIsLoading(true);

    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      setIsLoading(false);
      return;
    }

    try {
      await Voice.stop();
      setResult('');
      await Voice.start('en-US');
    } catch (error) {
      console.error('Voice start error:', error);
      setError('Failed to start voice recognition');
      setIsLoading(false);
      Alert.alert('Error', 'Failed to start voice recognition.');
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (error) {
      console.error('Voice stop error:', error);
      setError('Failed to stop voice recognition');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Speech-to-Text</Text>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <Text style={styles.resultText}>
          {result || "Press the mic to start speaking..."}
        </Text>
      )}

      <TouchableOpacity 
        onPress={isListening ? stopListening : startListening}
        style={styles.micButton}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.purple} />
        ) : <Icon
          name={isListening ? 'mic' : 'mic-outline'}
          size={50}
          color={isListening ? Colors.purple : Colors.purple}
        />}
      </TouchableOpacity>

      <Text style={styles.statusText}>
        {isLoading ? 'Initializing...' :
         isListening ? 'Listening...' :
         'Ready to listen'}
      </Text>
      {isSearchTriggered && result && (
        <ImageApp search={result} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color:Colors.purple,
  },
  resultText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: '#333333',
    minHeight: 50,
  },
  errorText: {
    fontSize: 16,
    color: '#ff4444',
    textAlign: 'center',
    marginBottom: 30,
    minHeight: 50,
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  statusText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 10,
  },
});

export default SpeechToText;
