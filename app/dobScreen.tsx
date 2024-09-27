import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
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

export default function DateOfBirthScreen() {
  const router = useRouter();
  const [dateOfBirth, setDateOfBirth] = useState(['', '', '']);
  const [error, setError] = useState('');
  const inputRefs = useRef<Array<TextInput | null>>([null, null, null]);
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

    // Focus on the first input when the component mounts
    setTimeout(() => inputRefs.current[0]?.focus(), 100);

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

  const handleDateChange = (text: string, index: number) => {
    const newDate = [...dateOfBirth];
    newDate[index] = text.replace(/[^0-9]/g, '');
    setDateOfBirth(newDate);

    if (newDate[index].length === (index === 2 ? 4 : 2)) {
      if (index < 2) {
        inputRefs.current[index + 1]?.focus();
      } else {
        validateDate(newDate);
      }
    }
  };

  const validateDate = (date: string[]) => {
    const [day, month, year] = date;
    if (day && month && year && year.length === 4) {
      const isValidDate = !isNaN(Date.parse(`${year}-${month}-${day}`));
      if (!isValidDate) {
        setError('Enter a valid date of birth.');
      } else {
        setError('');
      }
    } else {
      setError('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar style="dark" />
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="gift-outline" size={24} color="black" />
          </View>
          <View style={styles.dots}>
            {[...Array(3)].map((_, i) => (
              <View key={i} style={[styles.dot, i === 0 && styles.activeDot]} />
            ))}
          </View>
        </View>
        <Text style={styles.title}>What's your date of birth?</Text>
        <View style={styles.inputContainer}>
          {[
            { placeholder: 'DD', style: styles.inputDay },
            { placeholder: 'MM', style: styles.inputDay },
            { placeholder: 'YYYY', style: styles.inputYear }
          ].map((input, index) => (
            <React.Fragment key={index}>
              <TextInput
                ref={el => inputRefs.current[index] = el}
                style={[styles.input, input.style]}
                value={dateOfBirth[index]}
                onChangeText={(text) => handleDateChange(text, index)}
                placeholder={input.placeholder}
                placeholderTextColor="#999"
                keyboardType="number-pad"
                maxLength={index === 2 ? 4 : 2}
              />
              {index < 2 && <Text style={styles.separator}>{'  '}</Text>}
            </React.Fragment>
          ))}
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Text style={styles.note}>
          We use this to calculate the age on your profile.
        </Text>
      </View>
      <Animated.View
        style={[
          styles.buttonContainer,
          { transform: [{ translateY: buttonPosition }] },
        ]}
      >
        <NextButton router={router as { push: (route: string) => void }} nextRoute="/nextScreen" />
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
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
  activeDot: {
    backgroundColor: '#000',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  input: {
    fontSize: 24,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    paddingVertical: 5,
  },
  inputDay: {
    width: 40,
  },
  inputYear: {
    width: 80,
  },
  separator: {
    fontSize: 24,
    color: '#000',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  note: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});