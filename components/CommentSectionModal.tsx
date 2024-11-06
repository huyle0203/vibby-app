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
  FlatList,
  ImageSourcePropType,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { fetchComments, createComment } from '@/services/commentService';

interface CommentSectionModalProps {
  isVisible: boolean;
  onClose: () => void;
  postId: string;
  postAuthor: string;
  postAuthorPhoto: string;
}

interface Comment {
  id: string;
  user_id: string;
  post_id: string;
  content: string;
  created_at: string;
  nickname: string;
  user: {
    name: string;
    profile_picture: string | null;
  };
}

const SCREEN_HEIGHT = Dimensions.get('window').height;
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.70;

const EMOJIS = ['❤️', '🙌', '🔥', '👏', '😢', '😍', '😮', '😂'];

const anonymousPhoto = require('@/assets/images/profile_vibbyBlue.png');

export default function CommentSectionModal({ isVisible, onClose, postId, postAuthor, postAuthorPhoto }: CommentSectionModalProps) {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPostAuthor, setIsPostAuthor] = useState(false);
  const translateY = useRef(new Animated.Value(MODAL_HEIGHT)).current;
  const [modalVisible, setModalVisible] = useState(isVisible);
  const { user } = useAuth();

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 0,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
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
      loadComments();
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

  const loadComments = async () => {
    if (!user || !postId) return;
    setIsLoading(true);
    const result = await fetchComments(postId, user.id);
    if (result.success && result.comments) {
      setComments(result.comments);
      setIsPostAuthor(result.isPostAuthor || false);
    } else {
      console.error('Failed to fetch comments:', result.msg);
    }
    setIsLoading(false);
  };

  const handlePostComment = async () => {
    if (commentText.trim() && user && postId) {
      const result = await createComment({
        userId: user.id,
        postId: postId,
        content: commentText.trim(),
      });

      if (result.success && result.data) {
        setComments([result.data, ...comments]);
        setCommentText('');
      } else {
        console.error('Failed to post comment:', result.msg);
      }
    }
  };

  const handleEmojiPress = (emoji: string) => {
    setCommentText(prevText => prevText + emoji);
  };

  const renderComment = ({ item }: { item: Comment }) => {
    const isOwnComment = user?.id === item.user_id;
    const commentUserPhoto: ImageSourcePropType = isOwnComment || isPostAuthor
      ? (item.user.profile_picture ? { uri: item.user.profile_picture } : anonymousPhoto)
      : anonymousPhoto;
  
    const displayName = isOwnComment || isPostAuthor ? item.user.name : item.nickname || 'Anonymous';
  
    return (
      <View style={styles.commentContainer}>
        <Image source={commentUserPhoto} style={styles.userPhoto} />
        <View style={styles.commentContent}>
          <View style={styles.commentHeader}>
            <Text style={styles.username}>{displayName}</Text>
            <Text style={styles.timestamp}>{new Date(item.created_at).toLocaleString()}</Text>
          </View>
          <Text style={styles.commentText}>{item.content}</Text>
        </View>
      </View>
    );
  };

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
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="chevron-down" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Comments</Text>
              <View style={styles.placeholder} />
            </View>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading comments...</Text>
              </View>
            ) : (
              <FlatList
                data={comments}
                renderItem={renderComment}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.commentsList}
                showsVerticalScrollIndicator={false}
                style={styles.flatList}
              />
            )}
            <KeyboardAvoidingView
              style={styles.inputContainer}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 260 : 0}
            >
              <View style={styles.emojiContainer}>
                {EMOJIS.map((emoji, index) => (
                  <TouchableOpacity key={index} style={styles.emojiButton} onPress={() => handleEmojiPress(emoji)}>
                    <Text style={styles.emojiText}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.textInputContainer}>
                <Image source={{ uri: user?.profile_picture || postAuthorPhoto }} style={styles.userPhoto} />
                <TextInput
                  style={styles.input}
                  placeholder={`Add a comment...`}
                  placeholderTextColor="#666"
                  value={commentText}
                  onChangeText={setCommentText}
                  multiline
                />
                <TouchableOpacity onPress={handlePostComment} disabled={!commentText.trim()}>
                  <Text style={[styles.postButton, !commentText.trim() && styles.postButtonDisabled]}>
                    Post
                  </Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
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
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  flatList: {
    flex: 1,
  },
  commentsList: {
    paddingHorizontal: 16,
  },
  commentContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  userPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 8,
  },
  timestamp: {
    color: '#666',
    fontSize: 12,
  },
  commentText: {
    color: '#fff',
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000',
    marginBottom: 10,
  },
  emojiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  emojiButton: {
    padding: 4,
  },
  emojiText: {
    fontSize: 24,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    marginHorizontal: 8,
  },
  postButton: {
    color: '#3A93FA',
    fontWeight: 'bold',
  },
  postButtonDisabled: {
    opacity: 0.5,
  },
});