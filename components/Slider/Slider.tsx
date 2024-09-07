import React, { useEffect, useRef } from "react";
import { View, useWindowDimensions, Text, ImageBackground } from "react-native";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing, 
  runOnJS,
  useAnimatedReaction
} from "react-native-reanimated";
import { styles } from "./styles";

const SLIDE_WIDTH = 6 * (191 + 32); // 6 items * (box width + marginRight)

export default function Slider() {
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

  const renderBox = (source: any, mainText: string, subText: string) => (
    <View style={styles.box}>
      <View style={styles.imageContainer}>
        <ImageBackground source={source} style={styles.image} imageStyle={styles.imageBackground} />
      </View>
      <Text style={styles.mainText}>{mainText}</Text>
      <Text style={styles.subText}>{subText}</Text>
    </View>
  );

  const renderSlide = (key: number) => (
    <Animated.View key={key} style={[styles.slide, key === 0 ? slideAnimatedStyle1 : slideAnimatedStyle2]}>
      {renderBox(require("../../assets/images/penguin2.png"), "Vibby", "ur favorite cat penguin that helps u vibe")}
      {renderBox(require("../../assets/images/kanna.jpeg"), "Uyen", "i wanna be a princess & im looking for a prince")}
      {renderBox(require("../../assets/images/gigachad.png"), "Archer", "im a weeb and i love anime")}
      {renderBox(require("../../assets/images/gigachad.png"), "Devam", "3rd year cs student bruh")}
      {renderBox(require("../../assets/images/gigachad.png"), "Jason", "handsome Chinese boy")}
      {renderBox(require("../../assets/images/gigachad.png"), "Huy", "the creator of this app lmao")}
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {slidesRef.current.map(renderSlide)}
    </View>
  );
}