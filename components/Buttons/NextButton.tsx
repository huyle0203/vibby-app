import React from 'react'
import { Pressable, StyleSheet } from 'react-native'
import { Iconify } from 'react-native-iconify'
import { theme } from '@/constants/theme'

interface NextButtonProps {
  size?: number;
  onPress?: () => void;
  disabled?: boolean;
  router?: { push: (route: string) => void };
  nextRoute?: string;
}

export default function NextButton({ 
  size = 30, 
  onPress, 
  disabled = false, 
  router, 
  nextRoute 
}: NextButtonProps) {
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
      <Iconify 
        icon="iconamoon:arrow-right-2-bold" 
        strokeWidth={2.6} 
        size={size} 
        color={disabled ? theme.colors.textLight : theme.colors.text} 
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
    backgroundColor: '#3A93FA'
  },
  disabledButton: {
    backgroundColor: '#A9A9A9',
  }
}
)