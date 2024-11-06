import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SettingsModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isVisible, onClose }: SettingsModalProps) {
  const [isPaused, setIsPaused] = useState(false);
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (isVisible) {
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 200,
      });
    } else {
      translateY.value = withSpring(SCREEN_HEIGHT, {
        damping: 20,
        stiffness: 200,
      });
    }
  }, [isVisible]);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd(() => {
      if (translateY.value > SCREEN_HEIGHT * 0.2) {
        translateY.value = withSpring(SCREEN_HEIGHT, {
          damping: 20,
          stiffness: 200,
        });
        onClose();
      } else {
        translateY.value = withSpring(0, {
          damping: 20,
          stiffness: 200,
        });
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const renderSectionHeader = (title: string) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  const renderNavigationItem = (title: string, icon: string, color: string = '#fff') => (
    <TouchableOpacity style={styles.navigationItem}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon as any} size={24} color={color} />
      </View>
      <Text style={[styles.navigationText, { color }]}>{title}</Text>
      <Ionicons name="chevron-forward" size={24} color="#666" style={styles.chevron} />
    </TouchableOpacity>
  );

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={styles.sectionContainer}>
      {renderSectionHeader(title)}
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.modalContainer, animatedStyle]}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Settings</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
          >
            {renderSection('Profile', (
              <>
                <View style={styles.navigationItem}>
                  <View style={styles.iconContainer}>
                    <MaterialIcons name="search-off" size={24} color="#fff" />
                  </View>
                  <View style={styles.pauseContent}>
                    <Text style={styles.pauseTitle}>Pause</Text>
                    <Text style={styles.pauseDescription}>
                      Pausing prevents your profile from being shown to new people. You can still chat with your current matches.
                    </Text>
                  </View>
                  <Switch
                    value={isPaused}
                    onValueChange={setIsPaused}
                    trackColor={{ false: '#767577', true: '#3A93FA' }}
                    thumbColor={isPaused ? '#fff' : '#f4f3f4'}
                  />
                </View>
                {renderNavigationItem('Share Profile', 'share-outline')}
              </>
            ))}

            {renderSection('Notifications', (
              <>
                {renderNavigationItem('Push Notifications', 'notifications-outline')}
                {renderNavigationItem('Email', 'mail-outline')}
              </>
            ))}

            {renderSection('Subscription', (
              <>
                {renderNavigationItem('Subscribe to Vibby', 'sparkles-outline', '#FFBA0A')}
                {renderNavigationItem('Restore Subscription', 'refresh-outline')}
              </>
            ))}

            {renderSection('Users', (
              <>
                {renderNavigationItem('Block List', 'person-remove-outline')}
              </>
            ))}

            {renderSection('Legal', (
              <>
                {renderNavigationItem('Privacy Policy', 'lock-closed-outline')}
                {renderNavigationItem('Terms of Service', 'document-text-outline')}
                {renderNavigationItem('Your Privacy Choices', 'shield-checkmark-outline')}
                {renderNavigationItem('Download My Data', 'download-outline')}
              </>
            ))}

            {renderSection('Account Management', (
              <>
                <TouchableOpacity style={styles.navigationItem}>
                  <Text style={styles.navigationText}>Disable Account</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navigationItem}>
                  <Text style={[styles.navigationText, styles.deleteAccountText]}>Delete Account</Text>
                </TouchableOpacity>
              </>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT,
    backgroundColor: '#000',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    color: '#3A93FA',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 150,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    color: '#fff',
    fontSize: 18,
    opacity: 0.7,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
    marginLeft: 16,
  },
  sectionContent: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3A93FA',
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  navigationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(58, 147, 250, 0.7)',
  },
  navigationText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 16,
    flex: 1,
  },
  pauseContent: {
    flex: 1,
    marginLeft: 16,
  },
  pauseTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  pauseDescription: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    lineHeight: 20,
  },
  chevron: {
    marginLeft: 'auto',
  },
  deleteAccountText: {
    color: '#FA6161',
  },
  pauseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  iconContainer: {
    width: 24,
  },
});