import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { timeAgo } from '@/utils/timeAgo';

interface PostItemProps {
  username: string;
  content: string;
  createdAt: string;
  vibeParameter: number;
  commentCount: number;
  userPhoto: string;
  images?: string[];
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

const PostItem: React.FC<PostItemProps> = ({ 
  username, 
  content, 
  createdAt, 
  vibeParameter, 
  commentCount, 
  userPhoto,
  images 
}) => {
  const getImageSource = (): ImageSourcePropType => {
    if (userPhoto in profileImages) {
      return profileImages[userPhoto as keyof typeof profileImages];
    }
    return { uri: userPhoto };
  };

  const imageSource = getImageSource();

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
            <View style={styles.imageContainer}>
              {images.map((image, index) => (
                <Image key={index} source={{ uri: image }} style={styles.postImage} />
              ))}
            </View>
          )}
          <View style={styles.footer}>
            <View style={styles.interactionContainer}>
              <View style={styles.vibeContainer}>
                <Ionicons name="pulse" size={18} color="#3A93FA" />
                <Text style={styles.vibeText}>{vibeParameter}</Text>
              </View>
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
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  interactionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vibeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  vibeText: {
    color: '#3A93FA',
    marginLeft: 4,
    fontSize: 14,
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentCount: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 14,
  },
});

export default PostItem;