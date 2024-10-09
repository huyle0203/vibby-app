import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageSourcePropType, TouchableHighlight, Alert, ActivityIndicator } from 'react-native';
import { Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router';
import ScreenWrapper from '@/components/ScreenWrapper';
import NextButton from '@/components/Buttons/NextButton';
import BackButton from '@/components/Buttons/BackButton';
import { hp, wp } from './helpers/common';
import { useAuth } from '@/context/AuthContext';
import { updateUserData, updateUserProfilePicture } from '@/services/userService';
import { theme } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

type Avatar = {
  source: ImageSourcePropType;
  value: string;
};

const avatars: Avatar[] = [
  { source: require('../assets/images/profile_vibbyBlue.png'), value: 'vibbyBlue' },
  { source: require('../assets/images/profile_vibbyPink.png'), value: 'vibbyPink' },
  { source: require('../assets/images/profile_vibbyRed.png'), value: 'vibbyRed' },
  { source: require('../assets/images/profile_vibbyGreen.png'), value: 'vibbyGreen' },
  { source: require('../assets/images/profile_vibbyPurple.png'), value: 'vibbyPurple' },
  { source: require('../assets/images/profile_vibbyBlack.png'), value: 'vibbyBlack' },
  { source: require('../assets/images/profile_vibbyYellow.png'), value: 'vibbyYellow' },
  { source: require('../assets/images/profile_vibbyGray.png'), value: 'vibbyGray' },
];

export default function ProfilePictureScreen() {
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
  const [mainProfilePicture, setMainProfilePicture] = useState<ImageSourcePropType>(avatars[0].source);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, setUserData } = useAuth();

  const handleAvatarPress = (index: number): void => {
    setSelectedAvatar(index);
    setMainProfilePicture(avatars[index].source);
  };

  const handleImageUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setMainProfilePicture({ uri: result.assets[0].uri });
      setSelectedAvatar(null);
    }
  };

  const handleNext = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'User ID is missing. Please try logging in again.');
      return;
    }

    setIsLoading(true);

    try {
      let profilePictureValue: string;

      if (selectedAvatar !== null) {
        profilePictureValue = avatars[selectedAvatar].value;
        console.log('🐧 Selected predefined avatar:', profilePictureValue);
        
        const updateResult = await updateUserData(user.id, { profile_picture: profilePictureValue });
        if (!updateResult.success) {
          throw new Error(updateResult.msg || 'Failed to update profile picture');
        }
      } else if (typeof mainProfilePicture === 'object' && 'uri' in mainProfilePicture && mainProfilePicture.uri) {
        console.log('📸 Uploading custom image:', mainProfilePicture.uri);
        
        const fileInfo = await FileSystem.getInfoAsync(mainProfilePicture.uri);
        console.log('File info:', fileInfo);

        if (!fileInfo.exists) {
          throw new Error('File does not exist');
        }

        const fileExtension = mainProfilePicture.uri.split('.').pop()?.toLowerCase() || 'jpg';
        
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

        const result = await updateUserProfilePicture(user.id, mainProfilePicture.uri, fileExtension, mimeType);
        if (!result.success || !result.url) {
          throw new Error(result.msg || 'Failed to upload image');
        }
        profilePictureValue = result.url;
      } else {
        throw new Error('No profile picture selected');
      }

      setUserData({ profile_picture: profilePictureValue });
      console.log('🔄 User data updated with new profile picture:', profilePictureValue);

      const updatedUserData = await updateUserData(user.id, {});
      console.log('📊 Updated user data:', updatedUserData);

      router.push('/tagsSelection');
    } catch (error) {
      console.error('❌ Error in handleNext:', error);
      Alert.alert('Error', (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Choose profile picture</Text>
          <Text style={styles.subtitle}>Choose a photo that represents you!</Text>
        </View>
        <View style={styles.profilePictureContainer}>
          <Image
            source={mainProfilePicture}
            style={styles.profilePicture}
          />
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          )}
          <TouchableHighlight style={styles.addButton} onPress={handleImageUpload}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.avatarSection}>
          <Text style={styles.orText}>or choose a Vibby avatar</Text>
          <View style={styles.avatarContainer}>
            {avatars.map((avatar, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleAvatarPress(index)}
                style={styles.avatarWrapper}
              >
                <View style={[
                  styles.avatarInner,
                  selectedAvatar === index && styles.selectedAvatarInner
                ]}>
                  <Image source={avatar.source} style={styles.avatar} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.footer}>
          <BackButton router={router} />
          <View style={styles.progressBar}>
            <View style={styles.progress} />
          </View>
          <NextButton onPress={handleNext} disabled={isLoading} />
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: height * 0.02,
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
  profilePictureContainer: {
    position: 'relative',
    marginTop: height * 0.03,
  },
  profilePicture: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
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
    borderRadius: width * 0.3,
  },
  addButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: width * 0.075,
    width: width * 0.15,
    height: width * 0.15,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: "black",
    borderWidth: 2.5,
  },
  addButtonText: {
    color: '#000000',
    fontSize: width * 0.09,
    fontWeight: 'bold',
  },
  avatarSection: {
    alignItems: 'center',
  },
  orText: {
    color: '#FFFFFF',
    opacity: 0.7,
    fontSize: hp(2),
    marginBottom: height * 0.01,
  },
  avatarContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  avatarWrapper: {
    margin: width * 0.02,
  },
  avatarInner: {
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: width * 0.1,
    padding: 2,
  },
  selectedAvatarInner: {
    borderColor: '#3A93FA',
  },
  avatar: {
    width: width * 0.16,
    height: width * 0.16,
    borderRadius: width * 0.08,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: height * 0.05,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#333',
    marginHorizontal: 10,
  },
  progress: {
    width: '50%',
    height: '100%',
    backgroundColor: '#3A93FA',
  },
});