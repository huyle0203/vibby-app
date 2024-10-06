import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '@/components/ScreenWrapper';
import BackButton from '@/components/Buttons/BackButton';
import NextButton from '@/components/Buttons/NextButton';

export default function MustVibeFactsScreen() {
  const [facts, setFacts] = useState(['', '', '']);
  const router = useRouter();

  const updateFact = (index: number, text: string) => {
    const newFacts = [...facts];
    newFacts[index] = text;
    setFacts(newFacts);
  };

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.content}>
          <Text style={styles.title}>Must vibe facts</Text>
          <Text style={styles.subtitle}>
            Tell your friend cool facts about you,{'\n'}or just any random facts!
          </Text>
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
              />
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <BackButton router={router} />
          <View style={styles.progressBar}>
            <View style={styles.progress} />
          </View>
          <NextButton router={router as { push: (route: string) => void }} nextRoute="/highlightBio" />
        </View>
      </SafeAreaView>
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
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.7,
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
    width: '80%',
    height: '100%',
    backgroundColor: '#3498db',
  },
});