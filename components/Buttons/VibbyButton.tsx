import React from 'react'
import { Pressable, StyleSheet, Image } from 'react-native'

interface VibbyButtonProps {
  size?: number;
  onPress?: () => void;
  disabled?: boolean;
  router?: { push: (route: string) => void };
  nextRoute?: string;
}

export default function VibbyButton({ 
  size = 60, 
  onPress, 
  disabled = false, 
  router, 
  nextRoute 
}: VibbyButtonProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (router && nextRoute) {
      router.push(nextRoute);
    }
  };

  return (
    <Pressable 
      onPress={handlePress} 
      style={[styles.button, disabled && styles.disabledButton]}
      disabled={disabled}
    >
      <Image 
        source={require('../../assets/images/profile_vibbyPink.png')}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  disabledButton: {
    opacity: 0.5,
  }
})