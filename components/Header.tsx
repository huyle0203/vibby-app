import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import React from 'react';
import { View, StyleSheet, Text, Button, Alert, Animated, SafeAreaView } from 'react-native';
import { Iconify } from 'react-native-iconify';

interface HeaderProps {
  opacity: Animated.AnimatedInterpolation<string | number>;
  translateY: Animated.AnimatedInterpolation<string | number>;
}

const Header: React.FC<HeaderProps> = ({ opacity, translateY }) => {
  const { user } = useAuth();

  console.log('user: ', user);

  const onLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Sign out', "Error signing out");
    }
  };

  return (
    <Animated.View style={[styles.headerContainer, { opacity, transform: [{ translateY }] }]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Vibby</Text>
          </View>
          {/* erase this logout button later */}
          <Button title='logout' onPress={onLogout} />
          <View style={styles.iconsContainer}>
            <Iconify icon="mdi:bell-notification-outline" size={28} color="white" style={styles.icon} />
            <Iconify icon="ant-design:message-outlined" size={28} color="white" style={styles.icon} />
          </View>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'black',
  },
  safeArea: {
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  logoContainer: {
    flex: 1,
  },
  logoText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  iconsContainer: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 15,
  },
});

export default Header;