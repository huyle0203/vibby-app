import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Iconify } from 'react-native-iconify';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { hp, wp } from '@/app/helpers/common';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface OwnProfileModalProps {
  isVisible: boolean;
  onClose: () => void;
  user: {
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
  };
}

const OwnProfileModal: React.FC<OwnProfileModalProps> = ({ isVisible, onClose, user }) => {
  const translateY = useSharedValue(SCREEN_HEIGHT);

  React.useEffect(() => {
    if (isVisible) {
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 200,
        mass: 0.5,
      });
    } else {
      translateY.value = withSpring(SCREEN_HEIGHT, {
        damping: 20,
        stiffness: 200,
        mass: 0.5,
      });
    }
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const renderInfoBox = (title: string, content: string) => (
    <View style={styles.infoBoxContainer}>
      <Text style={styles.infoBoxTitle}>{title}</Text>
      <View style={styles.infoBox}>
        <Text style={styles.infoBoxContent}>{content}</Text>
      </View>
    </View>
  );

  const renderTagsBox = (title: string, tags: string[]) => (
    <View style={styles.infoBoxContainer}>
      <Text style={styles.infoBoxTitle}>{title}</Text>
      <View style={styles.tagsContainer}>
        {tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <Animated.View style={[styles.modalContainer, animatedStyle]}>
      <ScrollView style={styles.scrollView}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image source={user.profilePicture} style={styles.profilePicture} />
          <View style={styles.userInfo}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.username}>{user.username}</Text>
          </View>
        </View>
        <Text style={styles.bio}>{user.bio}</Text>
        <View style={styles.separator} />
        <View style={styles.infoGrid}>
          <View style={styles.infoColumn}>
            {renderInfoBox("Looking for...", user.lookingFor)}
            {renderInfoBox("What I Like", user.likes)}
            {renderInfoBox("What I Dislike", user.dislikes)}
          </View>
          <View style={styles.infoColumn}>
            {renderTagsBox("Music Taste", user.musicTaste)}
            {renderTagsBox("Hobbies", user.hobbies)}
            {renderTagsBox("Pets", user.pets)}
          </View>
        </View>
        <Text style={styles.sectionTitle}>Must vibe facts</Text>
        <View style={styles.vibeFactsContainer}>
          {user.vibeFacts.map((fact, index) => (
            <View key={index} style={styles.vibeFactBox}>
              <Text style={styles.vibeFactNumber}>#{index + 1}</Text>
              <Text style={styles.vibeFactText}>{fact}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.sectionTitle}>Things I wanna show you</Text>
        <View style={styles.imageGrid}>
          <View style={styles.leftColumn}>
            <Image source={user.images[0]} style={styles.largeImage} />
            <View style={styles.bottomImagesContainer}>
              <Image source={user.images[1]} style={styles.smallImage} />
              <Image source={user.images[2]} style={styles.smallImage} />
            </View>
          </View>
          <View style={styles.rightColumn}>
            <Image source={user.images[3]} style={styles.rightImage} />
            <Image source={user.images[4]} style={styles.rightImage} />
            <Image source={user.images[5]} style={styles.rightImage} />
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Iconify icon="lucide:x" size={24} color="#fff" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.85,
    backgroundColor: '#000',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  username: {
    fontSize: 16,
    color: '#999',
  },
  bio: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  separator: {
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 20,
    marginTop: 15,
  },
  infoGrid: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  infoColumn: {
    flex: 1,
    marginHorizontal: 5,
  },
  infoBoxContainer: {
    marginBottom: 10,
    height: SCREEN_HEIGHT * 0.12,
  },
  infoBoxTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  infoBox: {
    borderWidth: 1,
    borderColor: '#3A93FA',
    borderRadius: 10,
    padding: 10,
    flex: 1,
  },
  infoBoxContent: {
    fontSize: 14,
    color: '#ccc',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#3A93FA',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    margin: 2,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  vibeFactsContainer: {
    marginBottom: 20,
  },
  vibeFactBox: {
    borderWidth: 1,
    borderColor: '#3A93FA',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  vibeFactNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3A93FA',
    marginBottom: 5,
  },
  vibeFactText: {
    fontSize: 14,
    color: '#fff',
  },
  imageGrid: {
    flexDirection: 'row',
    height: SCREEN_WIDTH * 0.89,
    width: SCREEN_WIDTH * 0.89,
    marginBottom: 20,
  },
  leftColumn: {
    width: '66%',
    marginRight: '0.8%',
  },
  rightColumn: {
    width: '33.3%',
    height: '99.9%'
  },
  largeImage: {
    width: '99.9%',
    height: '66.6%',
    borderRadius: 10,
    marginBottom: '1%',
  },
  bottomImagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '33.3%',
  },
  smallImage: {
    width: '49.5%',
    height: '99.9%',
    borderRadius: 10,
    marginBottom: '2.5%',
  },
  rightImage: {
    width: '99.9%',
    height: '33%',
    borderRadius: 10,
    marginBottom: '2%',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
});

export default OwnProfileModal;