import React from 'react';
import { TextInput, TextInputProps, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Iconify } from 'react-native-iconify';

interface CustomTextInputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmitEditing: () => void;
  theme: 'light' | 'dark';
  onIconPress: () => void;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({ 
  value, 
  onChangeText, 
  onSubmitEditing, 
  theme, 
  onIconPress, 
  ...props 
}) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={[styles.input, theme === 'dark' ? styles.inputDark : styles.inputLight]}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        placeholderTextColor="rgba(255, 255, 255, 0.7)"
        placeholder="Tell Vibby who you are looking for..."
        {...props}
      />
      <TouchableOpacity onPress={onIconPress} style={styles.iconContainer}>
        <Iconify icon="ep:arrow-right-bold" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    position: 'relative',
    width: '100%',
  },
  input: {
    height: 50,
    borderColor: '#3A93FA',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    width: '100%',
    fontSize: 16,
    fontWeight: 'bold',
    paddingRight: 40,
  },
  inputLight: {
    backgroundColor: '#000',
    color: '#fff',
  },
  inputDark: {
    backgroundColor: '#000',
    color: 'white',
  },
  iconContainer: {
    position: 'absolute',
    right: 10,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomTextInput;