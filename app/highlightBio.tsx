import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { hp, wp } from '@/app/helpers/common';
import { theme } from '@/constants/theme'
import BackButton from '@/components/Buttons/BackButton';
import NextButton from '@/components/Buttons/NextButton';
import ScreenWrapper from '@/components/ScreenWrapper';
import { StatusBar } from 'expo-status-bar';

const HighlightBioScreen: React.FC = () => {
  const router = useRouter();
  const [bio, setBio] = useState('');
  const maxLength = 50;

  const handleBioChange = (text: string) => {
    if (text.length <= maxLength) {
      setBio(text);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <View style={styles.content}>
            <StatusBar style="light" />
            <View>
              <Text style={styles.title}>Highlight Bio</Text>
              <Text style={styles.subtitle}>Tell people about you in 1 line!</Text>
            </View>
            
            <View style={styles.form}>
              <Text style={styles.formText}>
                Now's your chance to tell people who you are. You can edit this any time!
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="E.g. A damn cute penguin with cat ears to vibe with you"
                  placeholderTextColor="#666"
                  value={bio}
                  onChangeText={handleBioChange}
                  multiline
                  maxLength={maxLength}
                  returnKeyType="done"
                  blurOnSubmit={true}
                  onSubmitEditing={dismissKeyboard}
                />
                <Text style={styles.charCount}>
                  {maxLength - bio.length} characters remaining
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={() => router.push('/(tabs)/two')}>
              <Text style={styles.buttonText}>Let's Vibe!</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <View style={styles.footer}>
        <BackButton router={router} />
        <View style={styles.progressBar}>
          <View style={styles.progress} />
        </View>
        <NextButton router={router as { push: (route: string) => void }} nextRoute="/(tabs)/two" />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  title: {
    fontSize: hp(4),
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: hp(2),
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.7,
  },
  form: {
    width: '100%',
    gap: 25,
  },
  formText: {
    fontSize: hp(2),
    color: theme.colors.text,
    fontWeight: "bold",
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    backgroundColor: '#111',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3498db',
    padding: hp(2),
  },
  input: {
    fontSize: hp(2),
    color: '#fff',
    textAlignVertical: 'top',
    minHeight: hp(15),
  },
  charCount: {
    fontSize: hp(1.5),
    color: '#666',
    textAlign: 'right',
    marginTop: hp(1),
  },
  button: {
    backgroundColor: '#3A93FA',
    borderRadius: 10,
    paddingVertical: hp(2),
    paddingHorizontal: wp(5),
    alignSelf: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: hp(2),
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#333',
    marginHorizontal: 10,
  },
  progress: {
    width: '100%',
    height: '100%',
    backgroundColor: '#3498db',
  },
});

export default HighlightBioScreen;