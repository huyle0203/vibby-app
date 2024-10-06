import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageSourcePropType, TouchableHighlight } from 'react-native';
import { Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import ScreenWrapper from '@/components/ScreenWrapper';
import NextButton from '@/components/Buttons/NextButton';
import BackButton from '@/components/Buttons/BackButton';
import { hp, wp } from './helpers/common';

const { width, height } = Dimensions.get('window');

type Avatar = {
  source: ImageSourcePropType;
};

export default function ProfilePictureScreen() {
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
  const [mainProfilePicture, setMainProfilePicture] = useState<ImageSourcePropType>(
    require('../assets/images/vibbyBlue.png')
  );
  const router = useRouter();

  const avatars: Avatar[] = [
    { source: require('../assets/images/vibbyBlue.png') },
    { source: require('../assets/images/vibbyPink.png') },
    { source: require('../assets/images/vibbyRed.png') },
    { source: require('../assets/images/vibbyGreen.png') },
    { source: require('../assets/images/vibbyPurple.png') },
    { source: require('../assets/images/vibbyBlack.png') },
    { source: require('../assets/images/vibbyYellow.png') },
    { source: require('../assets/images/vibbyGray.png') },
  ];

  const handleAvatarPress = (index: number): void => {
    setSelectedAvatar(index);
    setMainProfilePicture(avatars[index].source);
  };

  const handleImageUpload = async () => {
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
      setMainProfilePicture({ uri: result.assets[0].uri });
      setSelectedAvatar(null);
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
          <NextButton router={router as { push: (route: string) => void }} nextRoute="/tagsSelection" />
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