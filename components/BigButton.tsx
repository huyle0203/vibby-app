import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Svg, Path } from 'react-native-svg';

interface BigButtonProps {
  onPress: () => void;
}

const BigButton: React.FC<BigButtonProps> = ({ onPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={onPress}>
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" opacity={0.8}>
          <Path d="M12 5v14M5 12h14" />
        </Svg>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 59,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default BigButton;