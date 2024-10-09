import React, { useRef, useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Platform, RefreshControl, Animated, View } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import Header from '@/components/Header';
import Lottie from 'lottie-react-native';
import { ThreadsContext } from '@/context/thread-context';
import ThreadItem from '@/components/ThreadItem';
import { createRandomUser, generateThreads } from '@/utils/generate-dommy-data';
import PostCreationArea from '@/components/PostCreationArea';
import { Thread, User } from '@/types/threads';
import { fetchUserProfile, fetchThreads } from '@/services/userService';
import { useAuth } from '@/context/AuthContext';

export default function TabOneScreen() {
  const animationRef = useRef<Lottie>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isHeaderVisible, setHeaderVisible] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const { user, setUserData } = useAuth();

  useScrollToTop(scrollViewRef);

  // useEffect(() => {
  //   if (user) {
  //     fetchUserData()
  //   }
  //   // setThreads(generateThreads());
  // }, [user]);

    useEffect(() => {
    if (user) {
      fetchUserData()
    }
    setThreads(generateThreads());
  },[]);

  

  const fetchUserData = async () => {
    if (user) {
      const result = await fetchUserProfile(user.id);
      if (result.success && result.data) {
        console.log('Fetched user data:', result.data);
        setUserData(result.data);
      }
    }
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const handleRefresh = () => {
    animationRef.current?.play();
    setThreads(generateThreads());
  };

  console.log('Current user state:', user);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={{ opacity: headerOpacity }}>
        <Header />
      </Animated.View>
      <Animated.ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl 
            refreshing={false} 
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
        {threads.map((thread) => (
          <ThreadItem key={thread.id} thread={thread} />
        ))}
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollViewContent: {
    paddingHorizontal: 5,
    paddingTop: Platform.select({ android: 30, ios: 0 }),
  },
  lottieAnimation: {
    width: 90,
    height: 90,
    alignSelf: "center",
  },
});