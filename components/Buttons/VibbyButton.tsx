import React, { useRef, useState } from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import Rive, { RiveRef, Alignment, Fit } from 'rive-react-native';

interface VibbyButtonProps {
  onPress: () => void;
  style?: ViewStyle;
}

const VibbyButton: React.FC<VibbyButtonProps> = ({ onPress, style }) => {
  const riveRef = useRef<RiveRef>(null);
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
    setIsPressed(true);
    if (riveRef.current) {
      riveRef.current.fireState('Egg Radio Button', 'pressed');
    }
  };

  const handlePressOut = () => {
    setIsPressed(false);
    if (riveRef.current) {
      riveRef.current.fireState('Egg Radio Button', 'reset');
    }
    onPress();
  };

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.button, style, isPressed && styles.buttonPressed]}
    >
      <Rive
        ref={riveRef}
        resourceName="egg_radio_button"
        artboardName="Egg Radio Button"
        autoplay={false}
        alignment={Alignment.Center}
        fit={Fit.Contain}
        style={styles.animation}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  buttonPressed: {
    transform: [{ scale: 1.1 }],
  },
  animation: {
    width: '100%',
    height: '100%',
  },
});

export default VibbyButton;