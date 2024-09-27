import React from 'react'
import { Pressable, StyleSheet } from 'react-native'
import { Iconify } from 'react-native-iconify'
import { theme } from '@/constants/theme'

interface BackButtonProps {
  size?: number;
  router: { back: () => void };
}

export default function BackButton({ size = 30, router }: BackButtonProps) {
  return (
    <Pressable onPress={() => router.back()} style={styles.button}>
        <Iconify icon="iconamoon:arrow-left-2-bold" strokeWidth={2.6} size={size} color={theme.colors.text} />
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
    }
  }
)
