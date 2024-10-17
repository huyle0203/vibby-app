import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
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

interface PostItemFriendsProps {
  username: string;
  content: string;
  createdAt: string;
  vibeParameter: number;
  commentCount: number;
  userPhoto: string;
}

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

const SLIDER_WIDTH = 112;

const PostItemFriends: React.FC<PostItemFriendsProps> = ({
  username,
  content,
  createdAt,
  vibeParameter,
  commentCount,
  userPhoto,
}) => {
  const [sliderValue, setSliderValue] = useState(vibeParameter);
  const translateX = useSharedValue(0);

  const getImageSource = (): ImageSourcePropType => {
    if (userPhoto in profileImages) {
      return profileImages[userPhoto as keyof typeof profileImages];
    }
    return { uri: userPhoto };
  };

  const imageSource = getImageSource();

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: { startX: number }) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      const newValue = ctx.startX + event.translationX;
      translateX.value = Math.min(Math.max(newValue, 0), SLIDER_WIDTH);
      runOnJS(setSliderValue)((translateX.value / SLIDER_WIDTH) * 100);
    },
    onEnd: () => {
      translateX.value = withSpring(translateX.value, { damping: 15 });
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
              <View style={styles.commentContainer}>
                <Ionicons name="chatbubble-outline" size={18} color="#fff" />
                <Text style={styles.commentCount}>{commentCount}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
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
    paddingHorizontal: 0,
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
});

export default PostItemFriends;