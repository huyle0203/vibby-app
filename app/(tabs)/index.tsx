import React, { useRef, useState, useContext, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Platform, RefreshControl, Animated, View } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import Header from '@/components/Header';
import Lottie from 'lottie-react-native';
import { ThreadsContext } from '@/context/thread-context';
import ThreadItem from '@/components/ThreadItem';
import { createRandomUser, generateThreads } from '@/utils/generate-dommy-data';
import PostCreationArea from '@/components/PostCreationArea';
import { Thread, User } from '@/types/threads';

export default function TabOneScreen() {
  const animationRef = useRef<Lottie>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isHeaderVisible, setHeaderVisible] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  useScrollToTop(scrollViewRef);

  useEffect(() => {
    setCurrentUser(createRandomUser());
    setThreads(generateThreads());
  }, []);

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
        {currentUser && (
          <PostCreationArea userPhoto={currentUser.photo} username={currentUser.username} />
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
    paddingHorizontal: 10,
    paddingTop: Platform.select({ android: 30, ios: 0 }),
  },
  lottieAnimation: {
    width: 90,
    height: 90,
    alignSelf: "center",
  },
});