import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions, SafeAreaView, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Iconify } from 'react-native-iconify';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, Easing } from 'react-native-reanimated';
import { useAuth } from '@/context/AuthContext';
import { fetchUserHighlightBio, fetchUserFacts, updateUserImages } from '@/services/userService';
import VibeFactEditModal from './VibeFactEditModal';
import EditFieldModal from './EditFieldModal';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const profileImages: { [key: string]: ImageSourcePropType } = {
  profile_vibbyRed: require('@/assets/images/profile_vibbyRed.png'),
  profile_vibbyBlue: require('@/assets/images/profile_vibbyBlue.png'),
  profile_vibbyGreen: require('@/assets/images/profile_vibbyGreen.png'),
  profile_vibbyYellow: require('@/assets/images/profile_vibbyYellow.png'),
  profile_vibbyPink: require('@/assets/images/profile_vibbyPink.png'),
  profile_vibbyPurple: require('@/assets/images/profile_vibbyPurple.png'),
  profile_vibbyBlack: require('@/assets/images/profile_vibbyBlack.png'),
  profile_vibbyGray: require('@/assets/images/profile_vibbyGray.png'),
};

interface EditProfileModalProps {
  isVisible: boolean;
  onClose: () => void;
  userImages: string[];
  onImagesUpdate: (images: string[]) => void;
}

const MAX_BIO_LENGTH = 50;
const MAX_OTHER_LENGTH = 100;

export default function EditProfileModal({ isVisible, onClose, userImages, onImagesUpdate }: EditProfileModalProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Edit');
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState('');
  const [lookingFor, setLookingFor] = useState('');
  const [likes, setLikes] = useState('');
  const [dislikes, setDislikes] = useState('');
  const [vibeFacts, setVibeFacts] = useState(['', '', '']);
  const [editingFactIndex, setEditingFactIndex] = useState<number | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);

  const translateY = useSharedValue(SCREEN_HEIGHT);
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (isVisible) {
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 200,
        mass: 0.5,
      });
    } else {
      translateY.value = withSpring(SCREEN_HEIGHT, {
        damping: 20,
        stiffness: 200,
        mass: 0.5,
      });
    }
  }, [isVisible]);

  useEffect(() => {
    if (user && user.id) {
      fetchUserHighlightBio(user.id).then((result) => {
        if (result.success && result.highlightBio) {
          setBio(result.highlightBio.slice(0, MAX_BIO_LENGTH));
        }
      });

      fetchUserFacts(user.id).then((result) => {
        if (result.success && result.facts) {
          setVibeFacts(result.facts.map(fact => fact.slice(0, MAX_OTHER_LENGTH)));
        }
      });
    }
  }, [user]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const tabIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const handleTabPress = useCallback((tab: string) => {
    setActiveTab(tab);
    translateX.value = withTiming(tab === 'Edit' ? 0 : SCREEN_WIDTH / 2, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, []);

  const handleSave = () => {
    // Implement save logic here
    onClose();
  };

  const renderTextInput = (value: string, onChangeText: (text: string) => void, placeholder: string, fieldName: string, maxLength: number) => (
    <TouchableOpacity style={styles.inputWrapper} onPress={() => setEditingField(fieldName)}>
      <View style={styles.inputContainer}>
        <Text style={[styles.input, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
      </View>
      <TouchableOpacity style={styles.editIcon} onPress={() => setEditingField(fieldName)}>
        <Iconify icon="clarity:edit-solid" size={10} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const handleImagePick = async (index: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      const newImages = [...userImages];
      newImages[index] = result.assets[0].uri;
      onImagesUpdate(newImages);

      if (user) {
        const fileExtension = result.assets[0].uri.split('.').pop() || 'jpg';
        const mimeType = `image/${fileExtension}`;
        
        await updateUserImages(user.id, [
          { uri: result.assets[0].uri, fileExtension, mimeType }
        ]);
      }
    }
  };

  const renderPhotoBox = (index: number) => (
    <TouchableOpacity style={styles.photoBox} key={index} onPress={() => handleImagePick(index)}>
      {userImages[index] ? (
        <Image source={{ uri: userImages[index] }} style={styles.image} />
      ) : (
        <View style={styles.plusIcon}>
          <Ionicons name="add" size={40} color="#FFFFFF70" />
        </View>
      )}
    </TouchableOpacity>
  );

  const getImageSource = (): ImageSourcePropType => {
    if (user?.profile_picture && user.profile_picture in profileImages) {
      return profileImages[user.profile_picture as keyof typeof profileImages];
    }
    return user?.profile_picture ? { uri: user.profile_picture } : profileImages.profile_vibbyBlue;
  };

  const handleEditFact = (index: number) => {
    setEditingFactIndex(index);
  };

  const handleSaveFact = (index: number, newFact: string) => {
    const newFacts = [...vibeFacts];
    newFacts[index] = newFact.slice(0, MAX_OTHER_LENGTH);
    setVibeFacts(newFacts);
    setEditingFactIndex(null);
  };

  const handleSaveField = (fieldName: string, value: string) => {
    switch (fieldName) {
      case 'name':
        setName(value);
        break;
      case 'bio':
        setBio(value.slice(0, MAX_BIO_LENGTH));
        break;
      case 'lookingFor':
        setLookingFor(value.slice(0, MAX_OTHER_LENGTH));
        break;
      case 'likes':
        setLikes(value.slice(0, MAX_OTHER_LENGTH));
        break;
      case 'dislikes':
        setDislikes(value.slice(0, MAX_OTHER_LENGTH));
        break;
    }
    setEditingField(null);
  };

  const renderContent = () => {
    if (activeTab === 'View') {
      return (
        <View style={styles.viewContent}>
          <Text style={styles.viewContentText}>View Content</Text>
        </View>
      );
    }

    return (
      <>
        <View style={styles.profileImageContainer}>
          <Image source={getImageSource()} style={styles.profileImage} />
          <View style={styles.cameraIconContainer}>
            <Ionicons name="camera" size={24} color="#fff" />
          </View>
          <Text style={styles.changePhotoText}>Change photo</Text>
        </View>

        {renderTextInput(name, setName, 'Name', 'name', MAX_OTHER_LENGTH)}
        {renderTextInput(bio, setBio, 'Bio', 'bio', MAX_BIO_LENGTH)}

        <Text style={styles.sectionTitle}>Looking for...</Text>
        {renderTextInput(lookingFor, setLookingFor, 'What are you looking for?', 'lookingFor', MAX_OTHER_LENGTH)}

        <Text style={styles.sectionTitle}>What I Like</Text>
        {renderTextInput(likes, setLikes, 'What do you like?', 'likes', MAX_OTHER_LENGTH)}

        <Text style={styles.sectionTitle}>What I Dislike</Text>
        {renderTextInput(dislikes, setDislikes, 'What do you dislike?', 'dislikes', MAX_OTHER_LENGTH)}

        <Text style={styles.sectionTitle}>Must Vibe Facts</Text>
        {vibeFacts.map((fact, index) => (
          <TouchableOpacity key={index} onPress={() => handleEditFact(index)}>
            <View style={styles.vibeFactContainer}>
              <Text style={styles.vibeFactInput}>{fact || `Fact #${index + 1}`}</Text>
              <Text style={styles.vibeFactNumber}>#{index + 1}</Text>
              <TouchableOpacity style={styles.editIcon} onPress={() => handleEditFact(index)}>
                <Iconify icon="clarity:edit-solid" size={10} color="#fff" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionTitle}>Things I wanna show u</Text>
        <View style={styles.photoGrid}>
          {[...Array(6)].map((_, index) => renderPhotoBox(index))}
        </View>
      </>
    );
  };

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd(() => {
      if (translateY.value > SCREEN_HEIGHT * 0.2) {
        translateY.value = withSpring(SCREEN_HEIGHT, {
          damping: 20,
          stiffness: 200,
          mass: 0.5,
        });
        onClose();
      } else {
        translateY.value = withSpring(0, {
          damping: 20,
          stiffness: 200,
          mass: 0.5,
        });
      }
    });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.modalContainer, animatedStyle]}>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.headerButton}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={handleSave}>
                <Text style={styles.headerButton}>Save</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={styles.tab}
                onPress={() => handleTabPress('Edit')}
              >
                <Text style={[styles.tabText, activeTab === 'Edit' && styles.activeTabText]}>
                  Edit
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tab}
                onPress={() => handleTabPress('View')}
              >
                <Text style={[styles.tabText, activeTab === 'View' && styles.activeTabText]}>
                  View
                </Text>
              </TouchableOpacity>
              <Animated.View style={[styles.tabIndicator, tabIndicatorStyle]} />
            </View>

            <ScrollView style={styles.scrollView}>{renderContent()}</ScrollView>
          </SafeAreaView>
        </Animated.View>
      </GestureDetector>
      <VibeFactEditModal
        isVisible={editingFactIndex !== null}
        onClose={() => setEditingFactIndex(null)}
        factIndex={editingFactIndex !== null ? editingFactIndex : 0}
        initialFact={editingFactIndex !== null ? vibeFacts[editingFactIndex] : ''}
        onSave={handleSaveFact}
      />
      <EditFieldModal
        isVisible={editingField !== null}
        onClose={() => setEditingField(null)}
        fieldName={editingField || ''}
        initialValue={
          editingField === 'name'
            ? name
            : editingField === 'bio'
            ? bio
            : editingField === 'lookingFor'
            ? lookingFor
            : editingField === 'likes'
            ? likes
            : editingField === 'dislikes'
            ? dislikes
            : ''
        }
        onSave={handleSaveField}
        maxLength={editingField === 'bio' ? MAX_BIO_LENGTH : MAX_OTHER_LENGTH}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.85,
    backgroundColor: '#000',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomColor: '#333',
  },
  headerButton: {
    color: '#fff',
    fontSize: 16,
  },
  headerTitle: {
    color: '#3A93FA',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    position: 'relative',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabText: {
    color: '#666',
    fontSize: 16,
  },
  activeTabText: {
    color: '#fff',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: SCREEN_WIDTH / 2,
    height: 2,
    backgroundColor: '#3A93FA',
  },
  scrollView: {
    flex: 1,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius:  50,
    opacity: 0.5,
  },
  cameraIconContainer: {
    position: 'absolute',
    top: 30,
    left: SCREEN_WIDTH / 2 - 20,
    borderRadius: 20,
    padding: 10,
  },
  changePhotoText: {
    color: '#3A93FA',
    marginTop: 10,
    fontSize: 16,
  },
  inputWrapper: {
    position: 'relative',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3A93FA',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  placeholderText: {
    color: '#666',
  },
  editIcon: {
    position: 'absolute',
    top: -7,
    right: -7,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderColor: '#3A93FA',
    borderWidth: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
    marginLeft: 16,
  },
  vibeFactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3A93FA',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
  },
  vibeFactInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  vibeFactNumber: {
    color: '#3A93FA',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 16,
  },
  photoBox: {
    width: (SCREEN_WIDTH - 48) / 3,
    height: (SCREEN_WIDTH - 48) / 3,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#3A93FA',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tapToEditText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  viewContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewContentText: {
    color: '#fff',
    fontSize: 18,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
});