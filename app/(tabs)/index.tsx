import { SafeAreaView, ScrollView, StyleSheet, Platform, RefreshControl, Animated } from 'react-native';
import Header from '@/components/Header';
import Lottie from 'lottie-react-native';
import * as React from 'react';
import { ThreadsContext } from '@/context/thread-context';
import ThreadItem from '@/components/ThreadItem';
import { createRandomUser } from '@/utils/generate-dommy-data';

const user = createRandomUser();
console.log(JSON.stringify(user, null, 2));

export default function TabOneScreen() {
  const animationRef = React.useRef<Lottie>(null);
  const threads = React.useContext(ThreadsContext);
  const [isHeaderVisible, setHeaderVisible] = React.useState(true);
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50], // Adjust the range as needed
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView>
      <Animated.View style={{ opacity: headerOpacity }}>
        <Header />
      </Animated.View>
      <Animated.ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingTop: Platform.select({ android: 30 }),
        }}
        refreshControl={
          <RefreshControl refreshing={false} 
          onRefresh={() => {animationRef.current?.play()}}
          tintColor={"transparent"}/>
        }
      >
        <Lottie 
        ref={animationRef}
        source={require("../../assets/lottie-animations/penguin.json")}
        loop={false}
        autoPlay
        style={{ width: 90, height: 90, alignSelf: "center" }}
        />
      {threads.map((thread) => (
        <ThreadItem key={thread.id} thread={thread} />
      ))}
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

// ... existing code ...