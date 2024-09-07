import React, { useEffect, useRef } from "react";
import { View, Text, useWindowDimensions, ViewStyle} from "react-native";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing, 
  runOnJS,
  useAnimatedReaction
} from "react-native-reanimated";
import { styles } from "./styles";

const SLIDE_WIDTH = 10 * (156.85 + 10); // 6 items * (container width + marginRight)

interface SliderTextProps {
    style?: ViewStyle;
  }

export default function SliderText({ style }: SliderTextProps) {
  const dimensions = useWindowDimensions();
  const slideX = useSharedValue(0);
  const slidesRef = useRef([0, 1]);

  const createSlideAnimatedStyle = (index: number) => useAnimatedStyle(() => ({
    transform: [{ translateX: slideX.value + index * SLIDE_WIDTH }],
  }));

  const slideAnimatedStyle1 = createSlideAnimatedStyle(0);
  const slideAnimatedStyle2 = createSlideAnimatedStyle(1);

  const resetPosition = () => {
    'worklet';
    if (slideX.value <= -SLIDE_WIDTH) {
      slideX.value += SLIDE_WIDTH;
      runOnJS(updateSlideOrder)();
    }
  };

  const updateSlideOrder = () => {
    slidesRef.current = [slidesRef.current[1], slidesRef.current[0]];
  };

  useAnimatedReaction(
    () => slideX.value,
    () => resetPosition(),
    [slideX]
  );

  const startAnimation = () => {
    slideX.value = withTiming(-SLIDE_WIDTH, {
      duration: 80000,
      easing: Easing.linear,
    }, () => {
      slideX.value = 0;
      runOnJS(updateSlideOrder)();
      runOnJS(startAnimation)(); // Restart the animation
    });
  };

  useEffect(() => {
    startAnimation();
  }, []);

  const renderSlide = (key: number) => (
    <Animated.View key={key} style={[styles.slide, key === 0 ? slideAnimatedStyle1 : slideAnimatedStyle2]}>
      <View style={styles.textContainer}><Text style={styles.text}>who makes music</Text></View>
      <View style={styles.textContainer}><Text style={styles.text}>study partners</Text></View>
      <View style={styles.textContainer}><Text style={styles.text}>valorant gamers</Text></View>
      <View style={styles.textContainer}><Text style={styles.text}>nice friend</Text></View>
      <View style={styles.textContainer}><Text style={styles.text}>likes rock&roll</Text></View>
      <View style={styles.textContainer}><Text style={styles.text}>star wars fan</Text></View>
    </Animated.View>
  );

  return (
    <View style={[styles.container, style]}>
      {slidesRef.current.map(renderSlide)}
    </View>
  );
}