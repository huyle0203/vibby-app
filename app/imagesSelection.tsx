import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import ScreenWrapper from '@/components/ScreenWrapper';
import NextButton from '@/components/Buttons/NextButton';
import BackButton from '@/components/Buttons/BackButton';
import { hp } from './helpers/common';
import { useAuth } from '@/context/AuthContext';
import { updateUserData, updateUserImages } from '@/services/userService';
import { theme } from '@/constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface PhotoItem {
  uri: string;
}

export default function ImageSelectionScreen() {
  const [selectedPhotos, setSelectedPhotos] = useState<PhotoItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, setUserData } = useAuth();

  const pickPhotos = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [1, 1],
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 6,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newPhotos = result.assets.map(asset => ({ uri: asset.uri }));
      setSelectedPhotos(newPhotos.slice(0, 6)); // Limit to 6 photos
    }
  };

  const renderPhotoBox = (index: number, style: object, displayIndex: number) => {
    const photo = selectedPhotos[index];
    return (
      <TouchableOpacity
        style={[styles.photoBox, style]}
        onPress={pickPhotos}
      >
        {photo ? (
          <View style={styles.photoContainer}>
            <Image source={{ uri: photo.uri }} style={styles.photoPreview} />
            <View style={styles.photoNumber}>
              <Text style={styles.photoNumberText}>{displayIndex}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.plusIcon}>
            <Ionicons name="add" size={40} color="#3A93FA" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const handleNext = async () => {
    if (!user || !user.id) {
      Alert.alert('Error', 'User ID is missing. Please try logging in again.');
      return;
    }

    setIsLoading(true);

    try {
      if (selectedPhotos.length > 0) {
        if (selectedPhotos.length > 6) {
          throw new Error('You can select a maximum of 6 images');
        }

        const uploadedUrls = await Promise.all(selectedPhotos.map(async (photo, index) => {
          const fileExtension = photo.uri.split('.').pop()?.toLowerCase() || 'jpg';
          let mimeType;
          switch (fileExtension) {
            case 'png':
              mimeType = 'image/png';
              break;
            case 'jpg':
            case 'jpeg':
              mimeType = 'image/jpeg';
              break;
            case 'heic':
              mimeType = 'image/heic';
              break;
            default:
              mimeType = 'application/octet-stream';
          }

          const result = await updateUserImages(user.id, photo.uri, fileExtension, mimeType, index);
          if (!result.success || !result.url) {
            throw new Error(result.msg || `Failed to upload image ${index + 1}`);
          }
          return result.url;
          console.log( '😀Successfully update')
        }));

        setUserData({ images: uploadedUrls });
        console.log('🔄 User data updated with new images:', uploadedUrls);

        const updatedUserData = await updateUserData(user.id, { images: uploadedUrls });
        console.log('📊 Updated user data:', updatedUserData);
      } else {
        console.log('No images selected. Proceeding to next screen.');
      }

      router.push('/mustVibeFacts');
    } catch (error) {
      console.error('❌ Error in handleNext:', error);
      Alert.alert('Error', (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <StatusBar style="light" />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Show Us Who You Are</Text>
          <Text style={styles.subtitle}>Choose photos that represent you!</Text>
        </View>
        <View style={styles.photoGrid}>
          <View style={styles.leftColumn}>
            {renderPhotoBox(0, styles.largeImage, 1)}
            <View style={styles.bottomImagesContainer}>
              {renderPhotoBox(3, styles.smallImage, 4)}
              {renderPhotoBox(4, styles.smallImage, 5)}
            </View>
          </View>
          <View style={styles.rightColumn}>
            {renderPhotoBox(1, styles.rightImage, 2)}
            {renderPhotoBox(2, styles.rightImage, 3)}
            {renderPhotoBox(5, styles.rightImage, 6)}
          </View>
        </View>

        <Text style={styles.instruction}>Tap to select multiple photos (optional)</Text>
        <Text style={styles.requirement}>You can choose up to 6 photos</Text>

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
          <NextButton onPress={handleNext} disabled={isLoading} />
        </View>
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    justifyContent: 'space-between',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: SCREEN_HEIGHT * 0.02,
  },
  title: {
    fontSize: hp(4),
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: hp(2),
    color: '#FFFFFF',
    textAlign: 'center',
  },
  photoGrid: {
    flexDirection: 'row',
    height: SCREEN_WIDTH * 0.89,
    width: SCREEN_WIDTH * 0.89,
    alignSelf: 'center',
  },
  leftColumn: {
    width: '66%',
    marginRight: '0.8%',
  },
  rightColumn: {
    width: '33.3%',
    height: '99.9%'
  },
  photoBox: {
    borderWidth: 2,
    borderColor: '#3A93FA',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  largeImage: {
    width: '99.9%',
    height: '66.6%',
    marginBottom: '1%',
  },
  bottomImagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '33.3%',
  },
  smallImage: {
    width: '49.5%',
    height: '99.9%',
  },
  rightImage: {
    width: '99.9%',
    height: '33%',
    marginBottom: '2%',
  },
  plusIcon: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
  },
  photoNumber: {
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: '#3A93FA',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoNumberText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  instruction: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 5,
  },
  requirement: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 10,
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
    color: '#000',
  },
  infoLink: {
    color: '#8E44AD',
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});