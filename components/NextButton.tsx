import React from 'react'
import { Pressable, StyleSheet } from 'react-native'
import { Iconify } from 'react-native-iconify'
import { theme } from '@/constants/theme'

interface NextButtonProps {
  size?: number;
  router: { push: (route: string) => void };
  nextRoute: string;
}

export default function NextButton({ size = 30, router, nextRoute }: NextButtonProps) {
  return (
    <Pressable onPress={() => router.push(nextRoute)} style={styles.button}>
      <Iconify icon="iconamoon:arrow-right-2-bold" strokeWidth={2.6} size={size} color={theme.colors.text} />
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