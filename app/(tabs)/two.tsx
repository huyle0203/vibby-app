import React, { useState } from 'react';
import { StyleSheet, useColorScheme, KeyboardAvoidingView, Platform, View as RNView } from 'react-native';
import { Text, View } from '@/components/Themed';
import CustomTextInput from '@/components/CustomTextInput';
import Slider from '@/components/Slider/Slider';
import SliderText from '@/components/SliderText/SliderText';
import SliderTextReverse from '@/components/SliderTextReverse/SliderTextReverse';
import { useRouter } from 'expo-router';
import { useChatContext } from '@/context/ChatContext';

export default function TabTwoScreen() {
  const colorScheme = useColorScheme();
  const [textValue, setTextValue] = useState('');
  const router = useRouter();
  const { setInitialMessage } = useChatContext();

  const handleSubmit = () => {
    if (textValue.trim()) {
      setInitialMessage(textValue);
      router.push('/aiChatbotScreen');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, colorScheme === 'dark' ? styles.headingDark : styles.headingLight]}>
        Find and {'\n'} be Found.
      </Text>
      <RNView style={styles.sliderWrapper}>
        <Slider />
      </RNView>
      <RNView style={styles.sliderContainer}>
        <SliderText />
        <SliderTextReverse />
      </RNView>
    
      <View style={[styles.separator, colorScheme === 'dark' ? styles.separatorDark : styles.separatorLight]} />
      
      <KeyboardAvoidingView
        style={styles.inputContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        <CustomTextInput
          value={textValue}
          onChangeText={setTextValue}
          onSubmitEditing={handleSubmit}
          theme={colorScheme || 'light'}
          onIconPress={handleSubmit}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingBottom: Platform.OS === 'ios' ? 0 : 20,
  },
  heading: {
    fontSize: 44,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  headingLight: {
    color: 'black',
  },
  headingDark: {
    color: 'white',
  },
  sliderWrapper: {
    height: 258,
    marginBottom: 20,
    width: '100%',
  },
  sliderContainer: {
    height: 150,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
    alignSelf: 'center',
  },
  separatorLight: {
    backgroundColor: '#eee',
  },
  separatorDark: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  inputContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 10 : 10,
    left: 0,
    right: 0,
    paddingTop: 10,
    paddingHorizontal: 20,
    backgroundColor: '#000',
  },
});