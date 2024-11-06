import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ImageSourcePropType,
  Alert,
  FlatList,
  ScrollView,
  Animated,
  KeyboardAvoidingViewProps,
  PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { createPost, uploadImage } from '../services/postService';
import { useAuth } from '../context/AuthContext';

interface NewThreadModalProps {
  isVisible: boolean;
  onClose: () => void;
  userPhoto: string;
  username: string;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.88;
const IMAGE_CONTAINER_WIDTH = 189;
const IMAGE_CONTAINER_HEIGHT = 252;

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

export default function NewThreadModal({ isVisible, onClose, userPhoto, username }: NewThreadModalProps) {
  const [postText, setPostText] = useState('');
  const [selectedImages, setSelectedImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [modalVisible, setModalVisible] = useState(isVisible);
  const { user } = useAuth();
  const slideAnim = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 0 && (postText.length === 0 && selectedImages.length === 0);
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > MODAL_HEIGHT / 4) {
          closeModal();
        } else {
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (isVisible) {
      setModalVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  const handleCancel = () => {
    if (postText.length > 0 || selectedImages.length > 0) {
      Alert.alert(
        "Discard Post?",
        "Are you sure you want to discard this post?",
        [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel"
          },
          { 
            text: "Discard", 
            onPress: () => closeModal(),
            style: "destructive"
          }
        ],
        { cancelable: false }
      );
    } else {
      closeModal();
    }
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: MODAL_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      onClose();
      // Reset the state
      setPostText('');
      setSelectedImages([]);
    });
  };

  const handlePost = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to post.');
      return;
    }

    if (postText.length === 0 && selectedImages.length === 0) {
      Alert.alert('Error', 'Please enter some text or select at least one image.');
      return;
    }

    if (postText.length > 500) {
      Alert.alert('Error', 'Post content cannot exceed 500 characters.');
      return;
    }

    try {
      console.log('Starting post creation process...');
      console.log('User ID:', user.id);
      console.log('Post content:', postText);
      console.log('Number of images:', selectedImages.length);

      const uploadedImageUrls = await Promise.all(selectedImages.map(image => uploadImage(image.uri, user.id)));
      
      console.log('Uploaded image URLs:', uploadedImageUrls);

      const result = await createPost({
        userId: user.id,
        content: postText,
        images: uploadedImageUrls,
      });

      if (result.success) {
        console.log('Post created successfully:', result.data);
        Alert.alert('Success', 'Your post has been created!');
        closeModal();
      } else {
        console.error('Failed to create post:', result.msg);
        Alert.alert('Error', result.msg || 'Failed to create post. Please try again.');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  const handleImagePick = async () => {
    if (selectedImages.length >= 5) {
      Alert.alert('Error', 'You can only select up to 5 images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = result.assets.slice(0, 5 - selectedImages.length);
      setSelectedImages([...selectedImages, ...newImages]);
    }
  };

  const handleCameraPick = async () => {
    if (selectedImages.length >= 5) {
      Alert.alert('Error', 'You can only select up to 5 images.');
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Error', 'Camera permission is required to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImages([...selectedImages, result.assets[0]]);
    }
  };

  const getImageSource = (): ImageSourcePropType => {
    if (userPhoto in profileImages) {
      return profileImages[userPhoto];
    }
    return { uri: userPhoto };
  };

  const imageSource = getImageSource();

  const renderImageItem = ({ item }: { item: ImagePicker.ImagePickerAsset }) => (
    <View style={styles.imageWrapper}>
      <Image 
        source={{ uri: item.uri }} 
        style={styles.selectedImage} 
        resizeMode="cover"
      />
    </View>
  );

  const keyboardAvoidingViewProps: KeyboardAvoidingViewProps = Platform.OS === 'ios'
    ? { behavior: 'padding', keyboardVerticalOffset: 100 }
    : { behavior: 'height' };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleCancel}
    >
      <View style={styles.modalContainer}>
        <Animated.View 
          style={[
            styles.modalContent,
            {
              transform: [{
                translateY: slideAnim
              }]
            }
          ]}
          {...panResponder.panHandlers}
        >
          <KeyboardAvoidingView
            {...keyboardAvoidingViewProps}
            style={{ flex: 1 }}
          >
            <SafeAreaView style={{ flex: 1 }}>
              <View style={styles.header}>
                <TouchableOpacity onPress={handleCancel}>
                  <Text style={styles.cancelButton}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>New Vibe</Text>
                <TouchableOpacity>
                  <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.contentContainer}>
                <View style={styles.userInfoContainer}>
                  <Image source={imageSource} style={styles.photo} />
                  <View style={styles.rightContent}>
                    <Text style={styles.username}>{username}</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="What's vibing you too?"
                      placeholderTextColor="#666"
                      value={postText}
                      onChangeText={setPostText}
                      multiline
                      autoFocus
                      maxLength={500}
                    />
                    {selectedImages.length > 0 && (
                      <FlatList
                        data={selectedImages}
                        renderItem={renderImageItem}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.selectedImagesContainer}
                        snapToInterval={IMAGE_CONTAINER_WIDTH + 8}
                        snapToAlignment="start"
                        decelerationRate="fast"
                      />
                    )}
                    <View style={styles.iconContainer}>
                      <TouchableOpacity style={styles.iconButton} onPress={handleImagePick}>
                        <Ionicons name="image-outline" size={24} color="#fff" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.iconButton} onPress={handleCameraPick}>
                        <Ionicons name="camera-outline" size={24} color="#fff" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="mic-outline" size={24} color="#fff" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="list-outline" size={24} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </ScrollView>
              <View style={styles.footer}>
                <Text style={styles.footerText}>Anyone can reply & quote</Text>
                <TouchableOpacity 
                  style={[
                    styles.postButton, 
                    (postText.length === 0 && selectedImages.length === 0) && styles.postButtonDisabled
                  ]} 
                  onPress={handlePost}
                  disabled={postText.length === 0 && selectedImages.length === 0}
                >
                  <Text style={styles.postButtonText}>Post</Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#000',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: MODAL_HEIGHT,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  cancelButton: {
    color: '#fff',
    fontSize: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  userInfoContainer: {
    flexDirection: 'row',
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
  input: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 12,
    paddingVertical: 8,
  },
  selectedImagesContainer: {
    paddingRight: 16,
    marginBottom: 16,
  },
  imageWrapper: {
    width: IMAGE_CONTAINER_WIDTH,
    height: IMAGE_CONTAINER_HEIGHT,
    marginRight: 8,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#333',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  iconButton: {
    marginRight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  postButton: {
    backgroundColor: '#3A93FA',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonDisabled: {
    backgroundColor: '#3A93FA80',
  },
  postButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});