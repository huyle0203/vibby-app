import React, { ReactNode } from 'react'
import { View, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface ScreenWrapperProps {
  children: ReactNode;
  bg?: string;
  fullScreen?: boolean;
}

const ScreenWrapper = ({ children, bg, fullScreen = false }: ScreenWrapperProps) => {
  const { top } = useSafeAreaInsets();
  const paddingTop = fullScreen ? 0 : (top > 0 ? top + 5 : 30);

  return (
    <View style={[
      styles.container,
      { paddingTop, backgroundColor: bg },
      fullScreen && styles.fullScreen
    ]}>
      {children}
    </View>
  )
}

export default ScreenWrapper

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fullScreen: {
    paddingTop: 0,
  }
})