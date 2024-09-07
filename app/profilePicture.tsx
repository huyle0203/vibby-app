import React, { useState } from 'react';
import { View, Text, Image, Button, StyleSheet, TouchableOpacity, ImageSourcePropType } from 'react-native';
import { hp, wp } from '@/app/helpers/common';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { useRouter } from 'expo-router';
type Avatar = {
  source: ImageSourcePropType;
};

const router = useRouter();

const ProfilePictureScreen: React.FC = () => {
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
  const [mainProfilePicture, setMainProfilePicture] = useState<ImageSourcePropType>(
    require('../assets/images/penguin2.png')
  );

  const avatars: Avatar[] = [
    { source: require('../assets/images/huy.jpg') },
    { source: require('../assets/images/alpaca.jpeg') },
    { source: require('../assets/images/axotl.png') },
    { source: require('../assets/images/sloth.jpeg') },
    { source: require('../assets/images/sloth.jpeg') },
    { source: require('../assets/images/capybara.jpeg') },
    { source: require('../assets/images/gigachad.png') },
    { source: require('../assets/images/gigachad.png') },
    { source: require('../assets/images/gigachad.png') },
  ];

  const handleAvatarPress = (index: number): void => {
    setSelectedAvatar(index);
    setMainProfilePicture(avatars[index].source);
  };

  const handleImageUpload = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    // Launch image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      // Use the selected image
      if (result.assets && result.assets.length > 0) {
        setMainProfilePicture({ uri: result.assets[0].uri });
        setSelectedAvatar(null);

        // Save the image to the device's media library
        await MediaLibrary.saveToLibraryAsync(result.assets[0].uri);
      }
    }
  };

  return (
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
      <TouchableOpacity style={styles.button} onPress={() => router.push('/highlightBio')}>
        <Text style={styles.buttonText}>Let's Vibe!</Text>
      </TouchableOpacity>
    </View>
  );
};
const fourAvatarsWidth = wp(15) * 4;

// Calculate the width of three gaps (10px each)
const gapsWidth = 1;

// Sum these up for the total maxWidth
const maxWidth = fourAvatarsWidth + gapsWidth;

// Round up to the nearest integer to ensure all avatars fit
const roundedMaxWidth = Math.ceil(maxWidth);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  title: {
    fontSize: hp(3.6),
    color: '#FFFFFF',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: hp(1.8),
    color: '#FFFFFF',
    marginBottom: 20,
    opacity: 0.7,
  },
  profilePictureContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profilePicture: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  addButton: {
    position: 'absolute',
    bottom: 150,
    right: 10,
    backgroundColor: '#00BFFF',
    borderRadius: 50,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 50,
    
  },
  orText: {
    color: '#FFFFFF',
    marginVertical: 20,
    opacity: 0.7,
    fontSize: hp(1.8),
  },
  avatarContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: roundedMaxWidth, // Adjusted based on new avatar size
  },
  avatarWrapper: {
    padding: 0.,
    borderRadius: wp(25) + 4, // Slightly larger than the avatar
    marginTop: 10,
    marginBottom: 10,
  },
  selectedAvatarWrapper: {
    borderWidth: 2,
    borderColor: 'white',
  },
  avatar: {
    width: wp(15),
    height: wp(15),
    borderRadius: 30,
    margin: 10,
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

export default ProfilePictureScreen;