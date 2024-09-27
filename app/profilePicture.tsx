import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import ScreenWrapper from '@/components/ScreenWrapper';
import NextButton from '@/components/NextButton';
import BackButton from '@/components/BackButton';

const { width, height } = Dimensions.get('window');

type Avatar = {
  source: ImageSourcePropType;
};

export default function ProfilePictureScreen() {
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
  const [mainProfilePicture, setMainProfilePicture] = useState<ImageSourcePropType>(
    require('../assets/images/penguin2.png')
  );
  const router = useRouter();

  const avatars: Avatar[] = [
    { source: require('../assets/images/vibbyBlue.png') },
    { source: require('../assets/images/vibbyPink.png') },
    { source: require('../assets/images/vibbyRed.png') },
    { source: require('../assets/images/vibbyGreen.png') },
    { source: require('../assets/images/vibbyPurple.png') },
    { source: require('../assets/images/vibbyBlack.png') },
    { source: require('../assets/images/vibbyPink.png') },
    { source: require('../assets/images/vibbyRed.png') },
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
      <Text style={styles.title}>Choose profile picture</Text>
      <Text style={styles.subtitle}>Choose a photo that represents you!</Text>
      <View style={styles.profilePictureContainer}>
        <Image
          source={mainProfilePicture}
          style={styles.profilePicture}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleImageUpload}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.orText}>or choose a Vibby avatar</Text>
      <View style={styles.avatarContainer}>
        {avatars.map((avatar, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleAvatarPress(index)}
            style={[
              styles.avatarWrapper,
              selectedAvatar === index && styles.selectedAvatarWrapper
            ]}
          >
            <Image source={avatar.source} style={styles.avatar} />
          </TouchableOpacity>
        ))}
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
  title: {
    fontSize: width * 0.07,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: width * 0.04,
    color: '#FFFFFF',
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 10,
  },
  profilePictureContainer: {
    position: 'relative',
    marginTop: height * 0.05,
  },
  profilePicture: {
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
  },
  addButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: width * 0.06,
    width: width * 0.12,
    height: width * 0.12,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: "black",
    borderWidth: 2,
  },
  addButtonText: {
    color: '#000000',
    fontSize: width * 0.08,
    fontWeight: 'bold',
  },
  orText: {
    color: '#FFFFFF',
    opacity: 0.7,
    fontSize: width * 0.04,
    marginTop: height * 0.03,
  },
  avatarContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: height * 0.02,
  },
  avatarWrapper: {
    margin: width * 0.02,
  },
  selectedAvatarWrapper: {
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: width * 0.1,
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