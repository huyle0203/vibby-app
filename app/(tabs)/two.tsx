import React from 'react';
import { StyleSheet, useColorScheme, KeyboardAvoidingView, Platform } from 'react-native';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
//import HomeCarousel from '@/components/Slider';
import CustomTextInput from '@/components/CustomTextInput';
import Slider from '@/components/Slider/Slider';
import SliderText from '@/components/SliderText/SliderText';
import SliderTextReverse from '@/components/SliderTextReverse/SliderTextReverse';
import { useRouter } from 'expo-router';
export default function TabTwoScreen() {
  const colorScheme = useColorScheme();
  const [textValue, setTextValue] = React.useState('');
  const router = useRouter();
  const handleSubmit = () => {
    // Handle submit logic here
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Tab Two</Text> */}
      <Text style={[styles.heading, colorScheme === 'dark' ? styles.headingDark : styles.headingLight]}>
        Find and {'\n'} be Found.
      </Text>
      <View style={styles.sliderWrapper}>
        <Slider />
      </View>
      <View style={styles.sliderContainer}>
        <SliderText />
        <SliderTextReverse />
      </View>
    
      {/* <HomeCarousel /> */}

      <View style={[styles.separator, colorScheme === 'dark' ? styles.separatorDark : styles.separatorLight]} />
      
      <View style={styles.bottomContainer}>
        <KeyboardAvoidingView
          style={styles.textInputWrapper}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} // Adjust this offset as needed
        >
          <CustomTextInput
            value={textValue}
            onChangeText={setTextValue}
            onSubmitEditing={handleSubmit}
            theme={colorScheme || 'light'} // Provide a default value
            onIconPress={() => {
              router.push('/aiChatbotScreen');
            }}
          />
        </KeyboardAvoidingView>
      </View>
      {/* <EditScreenInfo path="app/(tabs)/two.tsx" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  heading: {
    fontSize: 44,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  headingLight: {
    color: 'black',
  },
  headingDark: {
    color: 'white',
  },
  sliderWrapper: {
    marginBottom: 20, // Add margin to create a gap
  },
  sliderContainer: {
    position: 'static',
    height: 150, // Adjust this height as needed
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  sliderReverse: {
    position: 'absolute',
    bottom: 0,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
    alignSelf: 'center',
  },
  separatorLight: {
    backgroundColor: '#eee',
  },
  separatorDark: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  textInputWrapper: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    justifyContent: 'flex-end',
    width: '100%',
  },
});