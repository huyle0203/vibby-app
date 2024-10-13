import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, Dimensions, ImageSourcePropType } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { fetchUserProfile, fetchUserFacts, fetchUserImages } from '@/services/userService';
import ScreenWrapper from '@/components/ScreenWrapper';
import EditProfileModal from '@/components/EditProfileModal';
import OwnProfileModal from '@/components/OwnProfileModal';

const { width } = Dimensions.get('window');

const profileImages: { [key: string]: ImageSourcePropType } = {
  profile_vibbyRed: require('@/assets/images/profile_vibbyRed.png'),
  profile_vibbyBlue: require('@/assets/images/profile_vibbyBlue.png'),
  profile_vibbyGreen: require('@/assets/images/profile_vibbyGreen.png'),
  profile_vibbyYellow: require('@/assets/images/profile_vibbyYellow.png'),
  profile_vibbyPink: require('@/assets/images/profile_vibbyPink.png'),
  profile_vibbyPurple: require('@/assets/images/profile_vibbyPurple.png'),
  profile_vibbyBlack: require('@/assets/images/profile_vibbyBlack.png'),
  profile_vibbyGray: require('@/assets/images/profile_vibbyGray.png'),
};

export default function TabFourScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState(0);
  const [translateX] = useState(new Animated.Value(0));
  const { user } = useAuth();
  const [highlightBio, setHighlightBio] = useState<string | null>(null);
  const [vibeFacts, setVibeFacts] = useState<string[]>([]);
  const [isEditProfileModalVisible, setIsEditProfileModalVisible] = useState(false);
  const [isOwnProfileModalVisible, setIsOwnProfileModalVisible] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userImages, setUserImages] = useState<string[]>([]);

  const tabs = ['Threads', 'Replies', 'Repost'];

  useEffect(() => {
    if (user && user.id) {
      fetchUserProfile(user.id).then((result) => {
        if (result.success && result.data) {
          setHighlightBio(result.data.highlight_bio || null);
          setUserProfile(result.data);
        }
      });

      fetchUserFacts(user.id).then((result) => {
        if (result.success && result.facts) {
          setVibeFacts(result.facts);
        }
      });

      fetchUserImages(user.id).then((result) => {
        if (result.success && result.urls) {
          setUserImages(result.urls);
        }
      });
    }
  }, [user]);

  const handleTabPress = (index: number) => {
    setActiveTab(index);
    Animated.spring(translateX, {
      toValue: index * (width / 3),
      useNativeDriver: true,
    }).start();
  };

  const getImageSource = (): ImageSourcePropType => {
    if (user?.profile_picture && user.profile_picture in profileImages) {
      return profileImages[user.profile_picture as keyof typeof profileImages];
    }
    return user?.profile_picture ? { uri: user.profile_picture } : profileImages.profile_vibbyBlue;
  };

  const handleEditProfilePress = () => {
    setIsEditProfileModalVisible(true);
  };

  const handleCloseEditProfileModal = () => {
    setIsEditProfileModalVisible(false);
  };

  const handleProfilePicturePress = () => {
    setIsOwnProfileModalVisible(true);
  };

  const handleCloseOwnProfileModal = () => {
    setIsOwnProfileModalVisible(false);
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading user data...</Text>
      </View>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="menu" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileInfo}>
          <TouchableOpacity onPress={handleProfilePicturePress}>
            <Image source={getImageSource()} style={styles.profileImage} />
          </TouchableOpacity>
          <Text style={styles.name}>{user.name || 'User'}</Text>
          <Text style={styles.username}>{user.email || '@username'}</Text>
          <Text style={styles.bio}>{highlightBio || 'No bio available'}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleEditProfilePress}>
            <Text style={styles.buttonText}>Edit profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Share profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabContainer}>
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={tab}
              style={styles.tab}
              onPress={() => handleTabPress(index)}
            >
              <Text style={[styles.tabText, activeTab === index && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
          <Animated.View
            style={[
              styles.tabIndicator,
              {
                transform: [{ translateX }],
              },
            ]}
          />
        </View>

        <View style={styles.content}>
          {activeTab === 0 && <Text style={styles.contentText}>Threads Content</Text>}
          {activeTab === 1 && <Text style={styles.contentText}>Replies Content</Text>}
          {activeTab === 2 && <Text style={styles.contentText}>Repost Content</Text>}
        </View>

        <EditProfileModal
          isVisible={isEditProfileModalVisible}
          onClose={handleCloseEditProfileModal}
          userImages={userImages}
          onImagesUpdate={setUserImages}
        />

        {userProfile && (
          <OwnProfileModal
            isVisible={isOwnProfileModalVisible}
            onClose={handleCloseOwnProfileModal}
            user={{
              name: user.name || 'User',
              username: user.email || '@username',
              bio: highlightBio || 'No bio available',
              profilePicture: getImageSource(),
              lookingFor: userProfile.looking_for || '',
              musicTaste: userProfile.music_taste || [],
              likes: userProfile.likes || '',
              dislikes: userProfile.dislikes || '',
              hobbies: userProfile.hobbies || [],
              pets: userProfile.pets || [],
              images: userImages,
              vibeFacts: vibeFacts,
            }}
          />
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  username: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    borderColor: '#3A93FA',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    position: 'relative',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  tabText: {
    color: 'gray',
    fontSize: 16,
  },
  activeTabText: {
    color: 'white',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    width: width / 3,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentText: {
    color: 'white',
    fontSize: 18,
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
});