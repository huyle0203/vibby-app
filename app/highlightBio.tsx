import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { hp, wp } from '@/app/helpers/common';
import { theme } from '@/constants/theme'

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
    <View style={styles.container}>
      <Text style={styles.title}>Highlight Bio</Text>
      <Text style={styles.subtitle}>Tell people about you in 1 line!</Text>
      
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 45,
    paddingHorizontal: wp(5),
    backgroundColor: 'black',
  },
  title: {
    fontSize: hp(4),
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: hp(2),
    color: theme.colors.text,
    opacity: 0.7,
    marginBottom: 20,
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
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: hp(2),
    fontWeight: 'bold',
  },
});

export default HighlightBioScreen;