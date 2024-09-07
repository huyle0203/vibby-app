import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ReactNode } from 'react';

interface ScreenWrapperProps {
  children: ReactNode;
  bg?: string;
}

const ScreenWrapper = ({children, bg}: ScreenWrapperProps) => {

    const {top} = useSafeAreaInsets();
    const paddingTop = top>0? top+5: 30;
  return (
    <View style={{flex: 1, paddingTop, backgroundColor: bg}}>
      {
        children
      }
    </View>
  )
}

export default ScreenWrapper

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         paddingTop: 1,
//         backgroundColor: 'white'
//     }
// })