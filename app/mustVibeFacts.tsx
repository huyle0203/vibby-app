import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform, TouchableWithoutFeedback, Keyboard, Dimensions, KeyboardAvoidingView, ScrollView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '@/components/ScreenWrapper';
import BackButton from '@/components/Buttons/BackButton';
import NextButton from '@/components/Buttons/NextButton';
import { hp } from './helpers/common';
import { useAuth } from '@/context/AuthContext';
import { fetchUserFacts, updateUserFacts } from '@/services/userService';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const MAX_CHARS = 100;
const MAX_FACTS = 3;

export default function MustVibeFactsScreen() {
  const [facts, setFacts] = useState<string[]>(['', '', '']);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const { user, setUserData } = useAuth();

  useEffect(() => {
    const loadFacts = async () => {
      if (user) {
        const result = await fetchUserFacts(user.id);
        if (result.success && result.facts) {
          setFacts([...result.facts, ...Array(MAX_FACTS - result.facts.length).fill('')]);
        }
      }
      setIsLoading(false);
    };
    loadFacts();
  }, [user]);

  const updateFact = (index: number, text: string) => {
    const newFacts = [...facts];
    newFacts[index] = text.slice(0, MAX_CHARS);
    setFacts(newFacts);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const handleFocus = (index: number) => {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: index * 150, animated: true });
    }, 100);
  };

  const handleSave = async () => {
    if (user) {
      setIsSaving(true);
      const nonEmptyFacts = facts.filter(fact => fact.trim() !== '');
      const result = await updateUserFacts(user.id, nonEmptyFacts);
      if (result.success) {
        setUserData({ ...user, facts: nonEmptyFacts });
        router.push('/highlightBio');
      } else {
        // Handle error (e.g., show an alert)
        console.error(result.msg);
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
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={styles.content}>
              <StatusBar style="light" />
              <View>
                <Text style={styles.title}>Must vibe facts</Text>
                <Text style={styles.subtitle}>
                  Tell your friend cool facts about you,{'\n'}or just any random facts!
                </Text>
              </View>
              <View style={styles.factsContainer}>
                {facts.map((fact, index) => (
                  <View key={index} style={styles.factContainer}>
                    <Text style={styles.factNumber}>#{index + 1}.</Text>
                    <TextInput
                      style={styles.input}
                      value={fact}
                      onChangeText={(text) => updateFact(index, text)}
                      placeholder={`E.g. ${getPlaceholder(index)}`}
                      placeholderTextColor="#666"
                      multiline
                      returnKeyType="done"
                      blurOnSubmit={true}
                      onSubmitEditing={dismissKeyboard}
                      maxLength={MAX_CHARS}
                      onFocus={() => handleFocus(index)}
                    />
                    <Text style={styles.charCount}>
                      {MAX_CHARS - fact.length} chars remaining
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
        <View style={styles.footer}>
          <BackButton router={router} />
          <View style={styles.progressBar}>
            <View style={styles.progress} />
          </View>
          <NextButton
            router={router as { push: (route: string) => void }}
            nextRoute="/highlightBio"
            onPress={handleSave}
            disabled={isSaving}
          />
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const getPlaceholder = (index: number) => {
  const placeholders = [
    "Cat Penguins can actually fly, haters gonna hate",
    "Allergic to peanuts, humans lol. Just wanna sleep all day",
    "Meow Meow Meow Meow Meow maooooo"
  ];
  return placeholders[index];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
    paddingBottom: 100,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
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
  factsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  factContainer: {
    marginBottom: 20,
  },
  factNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#111',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3498db',
    color: '#fff',
    padding: 15,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    color: '#666',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#333',
    marginHorizontal: 10,
  },
  progress: {
    width: '80%',
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