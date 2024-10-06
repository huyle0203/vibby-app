import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import ScreenWrapper from '@/components/ScreenWrapper';
import NextButton from '@/components/Buttons/NextButton';
import BackButton from '@/components/Buttons/BackButton';

interface PhotoItem {
  uri: string;
}

export default function ImageSelectionScreen() {
  const [selectedPhotos, setSelectedPhotos] = useState<PhotoItem[]>([]);
  const router = useRouter();

  const pickPhoto = async (index: number) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newPhoto: PhotoItem = {
        uri: result.assets[0].uri,
      };
      
      const newSelectedPhotos = [...selectedPhotos];
      newSelectedPhotos[index] = newPhoto;
      setSelectedPhotos(newSelectedPhotos);
    }
  };

  const renderPhotoBox = (index: number) => {
    const photo = selectedPhotos[index];
    return (
      <TouchableOpacity
        style={styles.photoBox}
        onPress={() => pickPhoto(index)}
      >
        {photo ? (
          <Image source={{ uri: photo.uri }} style={styles.photoPreview} />
        ) : (
          <View style={styles.plusIcon}>
            <Ionicons name="add" size={40} color="#3498db" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapper>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="images-outline" size={30} color="black" />
          </View>
          <View style={styles.dots}>
            {[...Array(3)].map((_, i) => (
              <View key={i} style={[styles.dot, i === 1 && styles.activeDot]} />
            ))}
          </View>
        </View>

        <Text style={styles.title}>Show Us Who You Are</Text>

        <View style={styles.photoGrid}>
          {[...Array(6)].map((_, index) => renderPhotoBox(index))}
        </View>

        <Text style={styles.instruction}>Tap to edit, drag to reorder</Text>
        <Text style={styles.requirement}>You dont have to choose</Text>

        <View style={styles.infoBox}>
          <Ionicons name="bulb-outline" size={24} color="#8E44AD" />
          <Text style={styles.infoText}>
            Not sure which photos to use?{'\n'}
            <Text style={styles.infoLink}>See what works</Text> based on research.
          </Text>
        </View>

        <View style={styles.footer}>
          <BackButton router={router} />
          <View style={styles.progressBar}>
            <View style={styles.progress} />
          </View>
          <NextButton 
            router={router as { push: (route: string) => void }} 
            nextRoute="/mustVibeFacts"
            // disabled={selectedPhotos.length < 6}
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#3498db',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photoBox: {
    width: '30%',
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: '#3498db',
    borderStyle: 'dashed',
    borderRadius: 10,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  instruction: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 5,
  },
  requirement: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E5F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  infoText: {
    marginLeft: 10,
    flex: 1,
  },
  infoLink: {
    color: '#8E44AD',
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#333',
    marginHorizontal: 10,
  },
  progress: {
    width: '66%',
    height: '100%',
    backgroundColor: '#3498db',
  },
});