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
  Animated,
  PanResponder,
  Dimensions,
  ImageSourcePropType,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NewThreadModalProps {
  isVisible: boolean;
  onClose: () => void;
  userPhoto: string;
  username: string;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.88; // Modal covers 88% of the screen

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
  const [isDragging, setIsDragging] = useState(false);
  const translateY = useRef(new Animated.Value(MODAL_HEIGHT)).current;
  const [modalVisible, setModalVisible] = useState(isVisible);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 0 && postText.length === 0;
      },
      onPanResponderGrant: () => {
        setIsDragging(true);
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        setIsDragging(false);
        if (gestureState.dy > MODAL_HEIGHT / 4) {
          closeModal();
        } else {
          Animated.spring(translateY, {
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
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  const closeModal = () => {
    Animated.timing(translateY, {
      toValue: MODAL_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      onClose();
    });
  };

  const handlePost = () => {
    // TODO: Implement post functionality
    console.log('Posting:', postText);
    setPostText('');
    closeModal();
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
    <Modal
      animationType="none"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.modalContainer}>
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [{ translateY: translateY }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <SafeAreaView style={{ flex: 1 }}>
              <View style={styles.header}>
                <TouchableOpacity onPress={closeModal}>
                  <Text style={styles.cancelButton}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>New Vibe</Text>
                <TouchableOpacity>
                  <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
              <View style={styles.contentContainer}>
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
                  />
                  <View style={styles.iconContainer}>
                    <TouchableOpacity style={styles.iconButton}>
                      <Ionicons name="image-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
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
              <View style={styles.footer}>
                <Text style={styles.footerText}>Anyone can reply & quote</Text>
                <TouchableOpacity style={styles.postButton} onPress={handlePost}>
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
    flexDirection: 'row',
    padding: 16,
    paddingHorizontal: 5
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
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
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
  postButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});