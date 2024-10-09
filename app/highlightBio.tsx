import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Platform, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { hp, wp } from '@/app/helpers/common';
import { theme } from '@/constants/theme'
import BackButton from '@/components/Buttons/BackButton';
import VibbyButton from '@/components/Buttons/VibbyButton';
import ScreenWrapper from '@/components/ScreenWrapper';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/context/AuthContext';
import { fetchUserHighlightBio, updateUserHighlightBio } from '@/services/userService';

const HighlightBioScreen: React.FC = () => {
  const router = useRouter();
  const { user, setUserData } = useAuth();
  const [bio, setBio] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const maxLength = 50;

  useEffect(() => {
    const loadBio = async () => {
      if (user) {
        const result = await fetchUserHighlightBio(user.id);
        if (result.success && result.highlightBio) {
          setBio(result.highlightBio);
        }
      }
      setIsLoading(false);
    };
    loadBio();
  }, [user]);

  const handleBioChange = (text: string) => {
    if (text.length <= maxLength) {
      setBio(text);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleSave = async () => {
    if (user) {
      if (!bio.trim()) {
        Alert.alert("Error", "Highlight bio cannot be empty. Please enter a bio.");
        return;
      }
      setIsSaving(true);
      const result = await updateUserHighlightBio(user.id, bio.trim());
      if (result.success) {
        setUserData({ ...user, highlightBio: bio.trim() });
        router.push('/(tabs)/two');
      } else {
        Alert.alert("Error", result.msg || "Failed to update highlight bio. Please try again.");
      }
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <ScreenWrapper>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
        </View>
      </ScreenWrapper>
    );
  }

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
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <View style={styles.footer}>
        <BackButton router={router} />
        <View style={styles.progressBar}>
          <View style={styles.progress} />
        </View>
        <VibbyButton 
          router={router as { push: (route: string) => void }} 
          nextRoute="/(tabs)/two" 
          onPress={handleSave}
          disabled={isSaving}
        />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});

export default HighlightBioScreen;