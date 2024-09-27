import React, { useEffect } from "react";
import { View, Text, ViewStyle } from "react-native";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing, 
  withRepeat,
  cancelAnimation
} from "react-native-reanimated";
import { styles } from "../SliderText/styles";

const SLIDE_WIDTH = 10 * (156.85 + 10); // 10 items * (container width + marginRight)

interface SliderTextReverseProps {
  style?: ViewStyle;
}

const textItems = [
  "love music",
  "knock2 fan",
  "likes to code",
  "burger lover",
  "book enthusiast",
  "meow meow meow",
  "wannabe youtubers",
  "brainrot skibidi",
  "cs2200 enjoyers",
  "kayne west homies"
];

export default function SliderTextReverse({ style }: SliderTextReverseProps) {
  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  useEffect(() => {
    const duration = 90000; // 80 seconds for one complete cycle
    translateX.value = withRepeat(
      withTiming(SLIDE_WIDTH, {
        duration,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    return () => {
      cancelAnimation(translateX);
    };
  }, []);

  const renderTextItem = (item: string, index: number) => (
    <Animated.View key={index} style={styles.textContainer}>
      <Text style={styles.text}>{item}</Text>
    </Animated.View>
  );

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={[styles.slide, animatedStyle]}>
        {textItems.map(renderTextItem)}
        {textItems.map((item, index) => renderTextItem(item, index + textItems.length))}
      </Animated.View>
    </View>
  );
}