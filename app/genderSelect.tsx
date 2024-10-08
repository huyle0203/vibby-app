import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import NextButton from '@/components/Buttons/NextButton';
import ScreenWrapper from '@/components/ScreenWrapper';
import { hp, wp } from './helpers/common';
import BackButton from '@/components/Buttons/BackButton';
import { useAuth } from '@/context/AuthContext';
import { updateUserData } from '@/services/userService';
import { theme } from '@/constants/theme';

type GenderOption = 'Woman' | 'Man' | 'Nonbinary';

export default function GenderSelectScreen() {
  const router = useRouter();
  const { name } = useLocalSearchParams<{ name: string }>();
  const [selectedGender, setSelectedGender] = useState<GenderOption | null>(null);
  const { user, setUserData } = useAuth();

  const genderOptions: GenderOption[] = ['Woman', 'Man', 'Nonbinary'];

  const getTitle = (name: string) => (
    <Text style={styles.title}>
      <Text style={styles.highlightedName}>{name}</Text> brings cool vibe!
    </Text>
  );
  //backend
  const handleNext = async () => {
    if (selectedGender && user?.id) {
      try {
        const result = await updateUserData(user.id, { gender: selectedGender });
        if (result.success) {
          setUserData({ gender: selectedGender });
          router.push('/profilePicture');
          console.log('😀 Gender selected:', selectedGender )
        } else {
          console.error('Failed to update user data:', result.msg);
        }
      } catch (error) {
        console.error('Error updating user data:', error);
      }
    } else {
      console.error('Gender selection is required');
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.content}>
          {getTitle(name || '')}
          <Text style={styles.subtitle}>
            We love that you are here to vibe. Pick the gender that best describes you, then add more about it if you like.
          </Text>
          <Text style={styles.label}>Which gender best describes you?</Text>
          {genderOptions.map((gender) => (
            <Pressable
              key={gender}
              style={styles.genderOption}
              onPress={() => setSelectedGender(gender)}
              accessibilityRole="radio"
              accessibilityState={{ checked: selectedGender === gender }}
            >
              <View style={[
                styles.genderOptionInner,
                selectedGender === gender && styles.selectedOption,
              ]}>
                <Text style={styles.genderText}>{gender}</Text>
                {selectedGender === gender && (
                  <Text style={styles.penguinEmoji}>🐧</Text>
                )}
              </View>
            </Pressable>
          ))}
          <Text style={styles.note}>
            You can always update this later. <Text style={styles.link}>A note about gender on Vibby.</Text>
          </Text>
        </View>

        <View style={styles.footer}>
          <BackButton router={router} />
          <View style={styles.progressBar}>
            <View style={styles.progress} />
          </View>
          <NextButton onPress={handleNext} disabled={!selectedGender} />
        </View>
      </View>
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
    marginBottom: 20,
    color: '#fff',
  },
  highlightedName: {
    color: '#3A93FA',
  },
  subtitle: {
    fontSize: hp(2),
    marginBottom: 30,
    color: '#fff',
  },
  label: {
    fontSize: hp(2.5),
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  genderOption: {
    marginBottom: 15,
  },
  genderOptionInner: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedOption: {
    borderColor: '#3A93FA',
    backgroundColor: '#3A93FA',
  },
  genderText: {
    fontSize: hp(2.5),
    color: '#fff',
  },
  penguinEmoji: {
    fontSize: hp(3),
  },
  note: {
    fontSize: hp(1.8),
    color: '#fff',
    marginTop: 20,
    opacity: 0.7,
  },
  link: {
    textDecorationLine: 'underline',
    color: '#3A93FA',
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
    width: '100%',
    height: '100%',
    backgroundColor: '#3498db',
  },
});