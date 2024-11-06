import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageSourcePropType, ScrollView, Modal, Dimensions, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { timeAgo } from '@/utils/timeAgo';
import CommentSectionModal from './CommentSectionModal';
import { updateVibePercentage, getVibePercentage } from '@/services/postService';
import { useAuth } from '@/context/AuthContext';

interface PostItemFriendsProps {
  id: string;
  username: string;
  content: string;
  createdAt: string;
  vibeParameter: number;
  commentCount: number;
  userPhoto: string;
  images?: string[];
}

const IMAGE_CONTAINER_WIDTH = 189;
const IMAGE_CONTAINER_HEIGHT = 252;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SLIDER_WIDTH = 112;

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

const PostItemFriends: React.FC<PostItemFriendsProps> = ({
  id,
  username,
  content,
  createdAt,
  vibeParameter,
  commentCount,
  userPhoto,
  images,
}) => {
  const [sliderValue, setSliderValue] = useState(vibeParameter);
  const translateX = useSharedValue((vibeParameter / 100) * SLIDER_WIDTH);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
  const { user } = useAuth();
  const lastSavedValue = useRef(vibeParameter);
  const hasInteracted = useRef(false);

  useEffect(() => {
    if (user) {
      fetchVibePercentage();
    }
  }, [user, id]);

  const fetchVibePercentage = async () => {
    if (user) {
      const result = await getVibePercentage(id, user.id);
      if (result.success && result.vibePercentage !== undefined) {
        setSliderValue(result.vibePercentage);
        translateX.value = (result.vibePercentage / 100) * SLIDER_WIDTH;
        lastSavedValue.current = result.vibePercentage;
      }
    }
  };

  const getImageSource = (): ImageSourcePropType => {
    if (userPhoto in profileImages) {
      return profileImages[userPhoto as keyof typeof profileImages];
    }
    return { uri: userPhoto };
  };

  const imageSource = getImageSource();

  const updateVibePercentageIfChanged = useCallback(async (newValue: number) => {
    if (user && hasInteracted.current && Math.abs(newValue - lastSavedValue.current) > 0.1) {
      const result = await updateVibePercentage(id, user.id, newValue);
      if (result.success) {
        lastSavedValue.current = newValue;
      } else {
        console.error('Failed to update vibe percentage');
      }
    }
    hasInteracted.current = false;
  }, [user, id]);

  const setHasInteracted = useCallback(() => {
    hasInteracted.current = true;
  }, []);

  const updateSliderValue = useCallback((value: number) => {
    setSliderValue(value);
  }, []);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: { startX: number }) => {
      ctx.startX = translateX.value;
      runOnJS(setHasInteracted)();
    },
    onActive: (event, ctx) => {
      const newValue = ctx.startX + event.translationX;
      translateX.value = Math.min(Math.max(newValue, 0), SLIDER_WIDTH);
      const percentage = (translateX.value / SLIDER_WIDTH) * 100;
      runOnJS(updateSliderValue)(percentage);
    },
    onEnd: () => {
      translateX.value = withSpring(translateX.value, { damping: 15 });
      runOnJS(updateVibePercentageIfChanged)(sliderValue);
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const filledStyle = useAnimatedStyle(() => {
    return {
      width: translateX.value,
    };
  });

  const handleImagePress = (image: string) => {
    setZoomedImage(image);
  };

  const closeZoomedImage = () => {
    setZoomedImage(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Image source={imageSource} style={styles.profileImage} />
        <View style={styles.rightContent}>
          <View style={styles.header}>
            <View style={styles.nameTimeContainer}>
              <Text style={styles.username}>{username}</Text>
              <Text style={styles.timeAgo}> · {timeAgo(createdAt)}</Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.content}>{content}</Text>
          {images && images.length > 0 && (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.imageScrollContainer}
            >
              {images.map((image, index) => (
                <TouchableOpacity key={index} onPress={() => handleImagePress(image)}>
                  <View style={styles.imageWrapper}>
                    <Image source={{ uri: image }} style={styles.postImage} />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
          <View style={styles.footer}>
            <View style={styles.interactionContainer}>
              <View style={styles.sliderContainer}>
                <View style={styles.sliderTrack} />
                <Animated.View style={[styles.sliderFilled, filledStyle]} />
                <PanGestureHandler onGestureEvent={gestureHandler}>
                  <Animated.View style={[styles.sliderThumb, animatedStyle]}>
                    <Image
                      source={require('@/assets/images/profile_penguin2.png')}
                      style={styles.penguinImage}
                    />
                  </Animated.View>
                </PanGestureHandler>
              </View>
              <Text style={styles.vibeText}>{Math.round(sliderValue)}%</Text>
              <TouchableOpacity 
                style={styles.commentContainer} 
                onPress={() => setIsCommentModalVisible(true)}
              >
                <Ionicons name="chatbubble-outline" size={18} color="#fff" />
                <Text style={styles.commentCount}>{commentCount}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <Modal
        visible={zoomedImage !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={closeZoomedImage}
      >
        <SafeAreaView style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalBackground} onPress={closeZoomedImage}>
            <Image source={{ uri: zoomedImage || undefined }} style={styles.zoomedImage} resizeMode="contain" />
            <TouchableOpacity style={styles.closeButton} onPress={closeZoomedImage}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
      <CommentSectionModal
        isVisible={isCommentModalVisible}
        onClose={() => setIsCommentModalVisible(false)}
        postId={id}
        postAuthor={username}
        postAuthorPhoto={userPhoto}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    paddingVertical: 12,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  rightContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  timeAgo: {
    color: '#666',
    fontSize: 14,
  },
  content: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 12,
  },
  imageScrollContainer: {
    marginBottom: 12,
  },
  imageWrapper: {
    width: IMAGE_CONTAINER_WIDTH,
    height: IMAGE_CONTAINER_HEIGHT,
    marginRight: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  interactionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sliderContainer: {
    width: SLIDER_WIDTH,
    height: 20,
    justifyContent: 'center',
    marginRight: 8,
  },
  sliderTrack: {
    position: 'absolute',
    height: 4,
    width: '100%',
    backgroundColor: '#666',
    borderRadius: 2,
  },
  sliderFilled: {
    position: 'absolute',
    height: 4,
    backgroundColor: '#3A93FA',
    borderRadius: 2,
  },
  sliderThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3A93FA',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: -12,
    borderWidth: 2,
    borderColor: '#fff',
  },
  penguinImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  vibeText: {
    color: '#3A93FA',
    marginLeft: 8,
    fontSize: 14,
    width: 40,
    textAlign: 'center',
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  commentCount: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomedImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 10,
  },
});

export default PostItemFriends;