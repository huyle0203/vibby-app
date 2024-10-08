import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import NextButton2 from '@/components/Buttons/NextButton2';
import ScreenWrapper from '@/components/ScreenWrapper';
import { hp, wp } from './helpers/common';
import { updateUserData } from '@/services/userService';
import { useAuth } from '@/context/AuthContext';

export default function NameInputScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const nameInputRef = useRef<TextInput>(null);
  const [dateOfBirth, setDateOfBirth] = useState(['', '', '']);
  const [error, setError] = useState('');
  const inputRefs = useRef<Array<TextInput | null>>([null, null, null]);
  const buttonPosition = useRef(new Animated.Value(0)).current;
  const { user, setUserData } = useAuth();



  useEffect(() => {
    const keyboardWillShow = (event: any) => {
      Animated.timing(buttonPosition, {
        toValue: -event.endCoordinates.height,
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

    const keyboardWillShowListener = Platform.OS === 'ios'
      ? Keyboard.addListener('keyboardWillShow', keyboardWillShow)
      : Keyboard.addListener('keyboardDidShow', keyboardWillShow);
    const keyboardWillHideListener = Platform.OS === 'ios'
      ? Keyboard.addListener('keyboardWillHide', keyboardWillHide)
      : Keyboard.addListener('keyboardDidHide', keyboardWillHide);

    setTimeout(() => nameInputRef.current?.focus(), 100);
    
    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

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
    } else if (newDate[index].length === 0 && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    validateDate(newDate);
  };

  const validateDate = (date: string[]) => {
    const [day, month, year] = date;
    
    if (day && month && year && year.length === 4) {
      const parsedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const currentDate = new Date();
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() - 120);

      const isValidDate = !isNaN(parsedDate.getTime()) && 
                          parsedDate.getFullYear() === parseInt(year) &&
                          parsedDate.getMonth() === parseInt(month) - 1 &&
                          parsedDate.getDate() === parseInt(day);
      
      if (!isValidDate) {
        setError('This date of birth doesn\'t seem right.');
      } else if (parsedDate > currentDate) {
        setError('Date of birth cannot be in the future.');
      } else if (parsedDate < maxDate) {
        setError('Please enter a more recent date of birth.');
      } else {
        setError('');
      }
    } else {
      setError('');
    }
  };

    //auth
    const handleNext = async () => {
      if (name.trim() && dateOfBirth.every(part => part.length > 0)) {
        const dob = `${dateOfBirth[2]}-${dateOfBirth[1]}-${dateOfBirth[0]}`;
        if (!user?.id) {
          Alert.alert('Error', 'User ID is missing. Please try logging in again.');
          return;
        }
        try {
          const result = await updateUserData(user?.id, { name: name.trim(), date_of_birth: dob });
  
          if (!result.success) throw new Error(result.msg);
  
          setUserData({ name: name.trim(), date_of_birth: dob });
          router.push({
            pathname: "/genderSelect",
            params: { name: name.trim() }
          });
          console.log('🧐Name: '+ name, '🧐DOB: '+ dob)
        } catch (error) {
          Alert.alert('Error', (error as Error).message);
        }
      } else {
        setError('Please fill in all fields correctly.');
      }
    };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <StatusBar style="light" />
        <View style={styles.content}>
          <Text style={styles.title}>Hi there! Let's start with an <Text style={styles.intro}>intro.</Text> </Text>
          <Text style={styles.label}>Your Name</Text>
          <TextInput
            ref={nameInputRef}
            style={styles.input}
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
          />
          <Text style={styles.label}>What's Your Birthday?</Text>
          <View style={styles.inputContainer}>
            {[
              { placeholder: 'DD', style: styles.inputDay },
              { placeholder: 'MM', style: styles.inputDay },
              { placeholder: 'YYYY', style: styles.inputYear }
            ].map((input, index) => (
              <React.Fragment key={index}>
                <TextInput
                  ref={el => inputRefs.current[index] = el}
                  style={[styles.inputDOB, input.style]}
                  value={dateOfBirth[index]}
                  onChangeText={(text) => handleDateChange(text, index)}
                  placeholder={input.placeholder}
                  placeholderTextColor="#666"
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
          <NextButton2 onPress={handleNext} />
        </Animated.View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: hp(4),
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#fff',
  },
  intro: {
    color: '#3A93FA'
  },
  label: {
    fontSize: hp(2.5),
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  input: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 10,
    fontSize: hp(2.5),
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 40,
    color: '#fff',
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  inputDOB: {
    fontSize: 24,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
    paddingVertical: 5,
    color: '#fff',
  },
  inputDay: {
    width: 40,
  },
  inputYear: {
    width: 80,
  },
  separator: {
    fontSize: 24,
    color: '#fff',
    marginHorizontal: 5,
  },
  errorText: {
    color: '#3A93FA',
    marginBottom: 10,
  },
  note: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.7
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});