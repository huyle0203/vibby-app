import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import NextButton from '@/components/NextButton';
import { useRouter } from 'expo-router';

export default function NameInputScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const firstNameInputRef = useRef<TextInput>(null);
  const buttonPosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      keyboardWillShow
    );
    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      keyboardWillHide
    );

    // Focus on the first name input when the component mounts
    setTimeout(() => firstNameInputRef.current?.focus(), 100);

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  const keyboardWillShow = (event: any) => {
    Animated.timing(buttonPosition, {
      toValue: -event.endCoordinates.height + 20,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const keyboardWillHide = () => {
    Animated.timing(buttonPosition, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar style="light" />
      <View style={styles.content}>
        <Text style={styles.header}>NO BACKGROUND CHECKS ARE CONDUCTED</Text>
        <View style={styles.iconContainer}>
          <Ionicons name="document-text-outline" size={40} color="white" />
          <View style={styles.dots}>
            {[...Array(4)].map((_, i) => (
              <View key={i} style={styles.dot} />
            ))}
          </View>
        </View>
        <Text style={styles.title}>What's your name?</Text>
        <TextInput
          ref={firstNameInputRef}
          style={[styles.input, { color: 'white' }]} // Set text color to white
          placeholder="First name (required)"
          placeholderTextColor="#999"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={[styles.input, { color: 'white' }]} // Set text color to white
          placeholder="Last name"
          placeholderTextColor="#999"
          value={lastName}
          onChangeText={setLastName}
        />
        <Text style={styles.note}>
          Last name is optional, and only shared with matches.{' '}
          <Text style={styles.why}>Why?</Text>
        </Text>
      </View>
      <Animated.View
        style={[
          styles.buttonContainer,
          { transform: [{ translateY: buttonPosition }] },
        ]}
      >
        <NextButton router={router as { push: (route: string) => void }} nextRoute="/profilePicture" />
        {/* <TouchableOpacity style={styles.button}>
          <Ionicons name="arrow-forward" size={24} color="white" />
        </TouchableOpacity> */}
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  dots: {
    flexDirection: 'row',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    fontSize: 18,
    paddingVertical: 10,
    marginBottom: 20,
  },
  note: {
    fontSize: 14,
    color: '#fff',
  },
  why: {
    color: '#8e44ad',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  button: {
    backgroundColor: '#fff',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});