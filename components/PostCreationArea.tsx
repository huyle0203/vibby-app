import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NewThreadModal from './NewThreadModal';

interface PostCreationAreaProps {
  userPhoto: string;
  username: string;
}

const profileImages: { [key: string]: ImageSourcePropType } = {
  profile_vibbyRed: require('../assets/images/profile_vibbyRed.png'),
  profile_vibbyBlue: require('../assets/images/profile_vibbyBlue.png'),
  profile_vibbyGreen: require('../assets/images/profile_vibbyGreen.png'),
  profile_vibbyYellow: require('../assets/images/profile_vibbyYellow.png'),
  profile_vibbyPink: require('../assets/images/profile_vibbyPink.png'),
  profile_vibbyPurple: require('../assets/images/profile_vibbyPurple.png'),
  profile_vibbyBlack: require('../assets/images/profile_vibbyBlack.png'),
  profile_vibbyGray: require('../assets/images/profile_vibbyGray.png'),
};

export default function PostCreationArea({ userPhoto, username }: PostCreationAreaProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  console.log('PostCreationArea props:', { userPhoto, username });

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  // Get the correct image source based on the userPhoto value
  const getImageSource = (): ImageSourcePropType => {
    if (userPhoto in profileImages) {
      return profileImages[userPhoto];
    }
    return { uri: userPhoto };
  };

  const imageSource = getImageSource();

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={handleOpenModal}>
        <View style={styles.contentContainer}>
          <Image source={imageSource} style={styles.photo} />
          <View style={styles.rightContent}>
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.placeholder}>What's vibing you?</Text>
            <View style={styles.iconContainer}>
              <Ionicons name="image-outline" size={24} color="#666" style={styles.icon} />
              <Ionicons name="camera-outline" size={24} color="#666" style={styles.icon} />
              <Ionicons name="mic-outline" size={24} color="#666" style={styles.icon} />
              <Ionicons name="list-outline" size={24} color="#666" style={styles.icon} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <NewThreadModal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        userPhoto={userPhoto}
        username={username}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    paddingVertical: 16,
    paddingHorizontal: 0, // Adjusted to match the ThreadItem padding
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  photo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  rightContent: {
    flex: 1,
  },
  username: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  placeholder: {
    color: '#666',
    fontSize: 16,
    marginBottom: 12,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  icon: {
    marginRight: 20,
  },
});