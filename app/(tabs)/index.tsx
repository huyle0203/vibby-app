import React, { useRef, useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Platform, RefreshControl, Animated, View, Text, Image, TouchableOpacity } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import Header from '@/components/Header';
import Lottie from 'lottie-react-native';
import PostItemFriends from '@/components/PostItemFriends';
import PostCreationArea from '@/components/PostCreationArea';
import { fetchUserProfile } from '@/services/userService';
import { fetchFriendsPosts } from '@/services/postService';
import { useAuth } from '@/context/AuthContext';

interface Post {
  id: string;
  user_id: string;
  content: string;
  images: string[];
  created_at: string;
  updated_at: string;
  average_vibe: number | null;
  vibe_count: number;
  user: {
    name: string;
    profile_picture: string;
  };
}

const HEADER_HEIGHT = 50; // Adjust this value based on your header's height

export default function TabOneScreen() {
  const animationRef = useRef<Lottie>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const { user, setUserData } = useAuth();
  const router = useRouter();

  useScrollToTop(scrollViewRef);

  useEffect(() => {
    console.log('Component mounted, user:', user);
    if (user) {
      fetchUserData();
      fetchPosts();
    }
  }, []);

  const fetchUserData = async () => {
    if (user) {
      const result = await fetchUserProfile(user.id);
      if (result.success && result.data) {
        console.log('Fetched user data:', result.data);
        setUserData(result.data);
      } else {
        console.error('Failed to fetch user data:', result.error);
      }
    }
  };

  const fetchPosts = async () => {
    if (user) {
      console.log('Fetching posts for user:', user.id);
      const friendsResult = await fetchFriendsPosts(user.id);

      console.log('Friends posts result:', friendsResult);

      if (friendsResult.success && friendsResult.posts) {
        setPosts(friendsResult.posts);
      } else {
        console.error('Failed to fetch friends posts:', friendsResult.msg);
        setPosts([]);
      }
    }
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: 'clamp',
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    animationRef.current?.play();
    await fetchPosts();
    setRefreshing(false);
  };

  const handleFindFriends = () => {
    router.push({ pathname: '/(tabs)/two' });
  };

  console.log('Current user state:', user);

  return (
    <View style={styles.container}>
      <Header opacity={headerOpacity} translateY={headerTranslateY} />
      <SafeAreaView style={styles.safeArea}>
        <Animated.ScrollView
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollViewContent}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={handleRefresh}
              tintColor={"transparent"}
            />
          }
        >
          <Lottie 
            ref={animationRef}
            source={require("../../assets/lottie-animations/penguin.json")}
            loop={false}
            autoPlay
            style={styles.lottieAnimation}
          />
          {user && (
            <PostCreationArea 
              userPhoto={user.profile_picture || 'profile_vibbyBlue'}
              username={user.name || 'User'}
            />
          )}
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostItemFriends
                key={post.id}
                id={post.id}
                username={post.user.name}
                content={post.content}
                createdAt={post.created_at}
                vibeParameter={post.average_vibe || 0}
                commentCount={0}
                userPhoto={post.user.profile_picture || 'profile_vibbyBlue'}
                images={post.images}
              />
            ))
          ) : (
            <View style={styles.noPostsContainer}>
              <Image
                source={require('../../assets/images/vibbyFind.png')}
                style={styles.noPostsImage}
              />
              <Text style={styles.noPostsText}>Hey, it seems like you got no biches yet.</Text>
              <Text style={styles.noPostsText}>Time to find some, will ya?</Text>
              <TouchableOpacity style={styles.findFriendsButton} onPress={handleFindFriends}>
                <Text style={styles.findFriendsButtonText}>Let's find friends</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeArea: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: HEADER_HEIGHT,
  },
  lottieAnimation: {
    width: 90,
    height: 90,
    alignSelf: "center",
  },
  noPostsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  noPostsImage: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  noPostsText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  findFriendsButton: {
    backgroundColor: '#3A93FA',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  findFriendsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});