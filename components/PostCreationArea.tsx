import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NewThreadModal from './NewThreadModal';

interface PostCreationAreaProps {
  userPhoto: string;
  username: string;
}

export default function PostCreationArea({ userPhoto, username }: PostCreationAreaProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={handleOpenModal}>
        <View style={styles.contentContainer}>
          <Image source={{ uri: userPhoto }} style={styles.photo} />
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
    padding: 16,
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