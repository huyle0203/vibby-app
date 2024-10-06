import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BOX_WIDTH = 191;
const BOX_HEIGHT = 258;
const BOX_MARGIN = 32;

export interface User {
  id: number;
  name: string;
  username: string;
  bio: string;
  profilePicture: any;
  lookingFor: string;
  musicTaste: string[];
  likes: string;
  dislikes: string;
  hobbies: string[];
  pets: string[];
  images: any[];
  vibeFacts: string[];
}

// Import all images
const vibbyProfile = require("../../assets/images/penguin2.png");
const uyenProfile = require("../../assets/images/penguin2.png");
const archerProfile = require("../../assets/images/penguin2.png");
const devamProfile = require("../../assets/images/penguin2.png");
const jasonProfile = require("../../assets/images/penguin2.png");
const huyProfile = require("../../assets/images/penguin2.png");

const vibbyImages = [
  require("../../assets/images/penguin2.png"),
  require("../../assets/images/penguin2.png"),
  require("../../assets/images/penguin2.png"),
  require("../../assets/images/penguin2.png"),
  require("../../assets/images/penguin2.png"),
  require("../../assets/images/penguin2.png"),
];

const uyenImages = [
  require("../../assets/images/penguin2.png"),
  require("../../assets/images/penguin2.png"),
  require("../../assets/images/penguin2.png"),
  require("../../assets/images/penguin2.png"),
  require("../../assets/images/penguin2.png"),
  require("../../assets/images/penguin2.png"),
];

const archerImages = [
  require("../../assets/images/penguin2.png"),
  require("../../assets/images/penguin2.png"),
  require("../../assets/images/penguin2.png"),
  require("../../assets/images/penguin2.png"),
  require("../../assets/images/penguin2.png"),
  require("../../assets/images/penguin2.png"),
];

const devamImages = [
  require("../../assets/images/penguin2.png"),
  require("../../assets/images/penguin2.png"),
  require("../../assets/images/penguin2.png"),
  require("../../assets/images/penguin2.png"),
  require("../../assets/images/penguin2.png"),
  require("../../assets/images/penguin2.png"),
];

const jasonImages = [
  require("../../assets/images/penguin2.png"),
  require("../../assets/images/penguin2.png"),
  require("../../assets/images/penguin2.png"),
  require("../../assets/images/penguin2.png"),
  require("../../assets/images/penguin2.png"),
  require("../../assets/images/penguin2.png"),
];

const huyImages = [
  require("../../assets/images/penguin2.png"),
  require("../../assets/images/penguin2.png"),
  require("../../assets/images/penguin2.png"),
  require("../../assets/images/penguin2.png"),
  require("../../assets/images/penguin2.png"),
  require("../../assets/images/penguin2.png"),
];

const data: User[] = [
  { 
    id: 1, 
    profilePicture: vibbyProfile, 
    name: "Vibby", 
    username: "@vibby",
    bio: "ur favorite cat penguin that helps u vibe",
    lookingFor: "New friends to vibe with",
    musicTaste: ["EDM", "Pop", "K-pop"],
    likes: "Dancing, coding, anime",
    dislikes: "Negativity, cold weather",
    hobbies: ["Coding", "Dancing", "Watching anime"],
    pets: ["Virtual pet penguin"],
    images: vibbyImages,
    vibeFacts: ["I can speak 5 languages fluently", "I've never eaten a fish", "I can solve a Rubik's cube in under a minute"]
  },
  { 
    id: 2, 
    profilePicture: uyenProfile, 
    name: "Uyen", 
    username: "@princess_uyen",
    bio: "i wanna be a princess & im looking for a prince",
    lookingFor: "My prince charming",
    musicTaste: ["Disney soundtracks", "Classical"],
    likes: "Tiaras, ballgowns, fairy tales",
    dislikes: "Frogs (unless they're princes)",
    hobbies: ["Singing", "Dancing", "Reading fairy tales"],
    pets: ["A royal corgi"],
    images: uyenImages,
    vibeFacts: ["I've watched every Disney movie at least 10 times", "I can recite the entire script of 'Frozen'", "I once met a real prince at a charity event"]
  },
  { 
    id: 3, 
    profilePicture: archerProfile, 
    name: "Archer", 
    username: "@weeb_archer",
    bio: "im a weeb and i love anime",
    lookingFor: "Anime watching buddies",
    musicTaste: ["J-pop", "Anime OSTs"],
    likes: "Cosplay, manga collecting",
    dislikes: "People who say anime is just cartoons",
    hobbies: ["Cosplaying", "Reading manga", "Learning Japanese"],
    pets: ["A Shiba Inu named Naruto"],
    images: archerImages,
    vibeFacts: ["I've been to Japan 7 times for anime conventions", "My manga collection has over 1000 volumes", "I once cosplayed for 30 days straight"]
  },
  { 
    id: 4, 
    profilePicture: devamProfile, 
    name: "Devam", 
    username: "@dev_am",
    bio: "3rd year cs student bruh",
    lookingFor: "Study groups, hackathon partners",
    musicTaste: ["Lo-fi", "Indie rock"],
    likes: "Coding challenges, coffee",
    dislikes: "Bugs, all-nighters (but still do them)",
    hobbies: ["Coding", "Playing chess", "Solving puzzles"],
    pets: ["A rubber duck for debugging"],
    images: devamImages,
    vibeFacts: ["I've won 3 hackathons in the past year", "I can type at 120 WPM", "I once debugged code in my sleep (literally)"]
  },
  { 
    id: 5, 
    profilePicture: jasonProfile, 
    name: "Jason", 
    username: "@jason_chen",
    bio: "handsome Chinese boy",
    lookingFor: "Friends to explore the city with",
    musicTaste: ["Mandopop", "R&B"],
    likes: "Photography, street food",
    dislikes: "Early mornings, spicy food",
    hobbies: ["Photography", "Exploring new restaurants", "Learning languages"],
    pets: ["A goldfish named Nemo"],
    images: jasonImages,
    vibeFacts: ["I've tried over 500 different street foods", "My photos have been featured in National Geographic", "I can do a backflip on command"]
  },
  { 
    id: 6, 
    profilePicture: huyProfile, 
    name: "Huy", 
    username: "@huy_creator",
    bio: "the creator of this app lmao",
    lookingFor: "Beta testers, fellow developers",
    musicTaste: ["Electronic", "Synthwave"],
    likes: "App development, UI/UX design",
    dislikes: "Spaghetti code, scope creep",
    hobbies: ["Coding", "Designing UIs", "Playing video games"],
    pets: ["A cat named Pixel"],
    images: huyImages,
    vibeFacts: ["I've launched 5 apps in the past year", "I can code in 10 different programming languages", "I once stayed awake for 72 hours straight to finish a project"]
  },
];

interface StaticSliderProps {
  onUserSelect: (user: User) => void;
}

const StaticSlider: React.FC<StaticSliderProps> = ({ onUserSelect }) => {
  const [displayedItems, setDisplayedItems] = useState(3);

  const renderBox = (item: User) => (
    <TouchableOpacity key={item.id} style={styles.box} onPress={() => onUserSelect(item)}>
      <View style={styles.imageContainer}>
        <Image source={item.profilePicture} style={styles.image} />
      </View>
      <Text style={styles.mainText}>{item.name}</Text>
      <Text style={styles.subText}>{item.bio}</Text>
    </TouchableOpacity>
  );

  const handleShowMore = () => {
    setDisplayedItems(prevItems => Math.min(prevItems + 3, data.length));
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {data.slice(0, 3).map(renderBox)}
      </ScrollView>
      {displayedItems < data.length && (
        <TouchableOpacity style={styles.showMoreButton} onPress={handleShowMore}>
          <Text style={styles.showMoreText}>Show Me More!</Text>
        </TouchableOpacity>
      )}
      {displayedItems > 3 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.scrollViewContent, styles.additionalBiosContainer]}
        >
          {data.slice(3, displayedItems).map(renderBox)}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20, // Add some padding at the bottom of the container
  },
  scrollViewContent: {
    paddingHorizontal: 16,
  },
  additionalBiosContainer: {
    marginTop: 20, // Increase the gap between the initial bios and additional ones
  },
  box: {
    width: BOX_WIDTH,
    height: BOX_HEIGHT,
    marginRight: BOX_MARGIN,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    padding: 5,
    borderColor: '#3A93FA',
    borderWidth: 2,
    borderRadius: 13
  },
  imageContainer: {
    width: 171,
    height: 171,
    borderRadius: 85.5,
    overflow: "hidden",
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  image: {
    width: "80%",
    height: "80%",
    borderRadius: 85.5,
  },
  mainText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 2,
    fontWeight: 'bold',
    color: '#fff',
  },
  subText: {
    fontSize: 12,
    textAlign: "center",
    color: '#fff',
  },
  showMoreButton: {
    backgroundColor: '#3A93FA',
    padding: 10,
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center',
  },
  showMoreText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default StaticSlider;