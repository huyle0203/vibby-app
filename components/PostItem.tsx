import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageSourcePropType, ScrollView, Modal, Dimensions, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { timeAgo } from '@/utils/timeAgo';
import CommentSectionModal from './CommentSectionModal';
import { getPostWithAverageVibe } from '@/services/postService';

interface PostItemProps {
  id: string;
  username: string;
  content: string;
  createdAt: string;
  commentCount: number;
  userPhoto: string;
  images?: string[];
  averageVibe?: number;
  vibeCount?: number;
}

const IMAGE_CONTAINER_WIDTH = 189;
const IMAGE_CONTAINER_HEIGHT = 252;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

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
  id,
  username, 
  content, 
  createdAt, 
  commentCount, 
  userPhoto,
  images,
  averageVibe: initialAverageVibe,
  vibeCount: initialVibeCount
}) => {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
  const [averageVibe, setAverageVibe] = useState<number | null>(initialAverageVibe || null);
  const [vibeCount, setVibeCount] = useState(initialVibeCount || 0);

  useEffect(() => {
    if (initialAverageVibe === undefined || initialVibeCount === undefined) {
      fetchPostData();
    }
  }, [id, initialAverageVibe, initialVibeCount]);

  const fetchPostData = async () => {
    const result = await getPostWithAverageVibe(id);
    if (result.success && result.post) {
      setAverageVibe(result.post.average_vibe);
      setVibeCount(result.post.vibe_count);
    }
  };

  const getImageSource = (): ImageSourcePropType => {
    if (userPhoto in profileImages) {
      return profileImages[userPhoto as keyof typeof profileImages];
    }
    return { uri: userPhoto };
  };

  const imageSource = getImageSource();

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
              <View style={styles.vibeContainer}>
                <Ionicons name="pulse" size={18} color="#3A93FA" />
                <Text style={styles.vibeText}>
                  {averageVibe !== null ? `${averageVibe.toFixed(1)}% (${vibeCount})` : 'No vibes yet'}
                </Text>
              </View>
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
    marginRight: 4,
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

export default PostItem;