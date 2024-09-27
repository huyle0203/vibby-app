import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { hp, wp } from '@/app/helpers/common';
import { theme } from '@/constants/theme'
import BackButton from '@/components/BackButton';
import NextButton from '@/components/NextButton';
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

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.content}>
          <View style={styles.header}>
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
                placeholderTextColor="#999"
                value={bio}
                onChangeText={handleBioChange}
                multiline
                maxLength={maxLength}
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
        
        <View style={styles.footer}>
          <BackButton router={router} />
          <View style={styles.progressBar}>
            <View style={styles.progress} />
          </View>
          <NextButton router={router as { push: (route: string) => void }} nextRoute="/(tabs)/two" />
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: hp(4), // Add top margin to push the header higher
  },
  title: {
    fontSize: hp(3.5),
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: hp(2),
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
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
    height: hp(20),
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: hp(2),
  },
  input: {
    fontSize: hp(2),
    color: '#000',
    textAlignVertical: 'top',
    height: '80%',
  },
  charCount: {
    fontSize: hp(1.5),
    color: '#999',
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
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#333',
    marginHorizontal: 10,
  },
  progress: {
    width: '75%',
    height: '100%',
    backgroundColor: '#3498db',
  },
});

export default HighlightBioScreen;