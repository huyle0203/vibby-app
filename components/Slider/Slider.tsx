import React, { useEffect } from "react";
import { View, Text, Image, Dimensions } from "react-native";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing, 
  withRepeat,
  cancelAnimation
} from "react-native-reanimated";
import { styles } from "./styles";

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BOX_WIDTH = 191;
const BOX_MARGIN = 32;
const SLIDE_WIDTH = 6 * (BOX_WIDTH + BOX_MARGIN);

interface SliderItem {
  id: number;
  image: any;
  name: string;
  bio: string;
}

const data: SliderItem[] = [
  { id: 1, image: require("../../assets/images/penguin2.png"), name: "Vibby", bio: "ur favorite cat penguin that helps u vibe" },
  { id: 2, image: require("../../assets/images/kanna.jpeg"), name: "Uyen", bio: "i wanna be a princess & im looking for a prince" },
  { id: 3, image: require("../../assets/images/gigachad.png"), name: "Archer", bio: "im a weeb and i love anime" },
  { id: 4, image: require("../../assets/images/gigachad.png"), name: "Devam", bio: "3rd year cs student bruh" },
  { id: 5, image: require("../../assets/images/gigachad.png"), name: "Jason", bio: "handsome Chinese boy" },
  { id: 6, image: require("../../assets/images/gigachad.png"), name: "Huy", bio: "the creator of this app lmao" },
];

export default function Slider() {
  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  useEffect(() => {
    const duration = 80000; // 80 seconds for one complete cycle
    translateX.value = withRepeat(
      withTiming(-SLIDE_WIDTH, {
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

  const renderBox = (item: SliderItem) => (
    <View key={item.id} style={styles.box}>
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} />
      </View>
      <Text style={styles.mainText}>{item.name}</Text>
      <Text style={styles.subText}>{item.bio}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.slide, animatedStyle]}>
        {data.map(renderBox)}
        {data.map(renderBox)}
      </Animated.View>
    </View>
  );
}