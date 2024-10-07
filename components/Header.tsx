import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Button, Alert } from 'react-native';
import { Iconify } from 'react-native-iconify';

const Header = () => {
  const {user, setAuth} = useAuth();

  console.log('user: ', user);

  const onLogout = async ()=>{
    //setAuth(null);
    const {error} = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Sign out', "Error signing out")
    }

  }

  return (
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
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'black',
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