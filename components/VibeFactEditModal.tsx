import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface VibeFactEditModalProps {
  isVisible: boolean;
  onClose: () => void;
  factIndex: number;
  initialFact: string;
  onSave: (index: number, fact: string) => void;
}

const MAX_FACT_LENGTH = 100;

export default function VibeFactEditModal({
  isVisible,
  onClose,
  factIndex,
  initialFact,
  onSave,
}: VibeFactEditModalProps) {
  const [fact, setFact] = useState(initialFact);
  const translateY = useSharedValue(SCREEN_HEIGHT);

  useEffect(() => {
    if (isVisible) {
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 200,
        mass: 0.5,
      });
    }
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const closeModal = () => {
    translateY.value = withSpring(SCREEN_HEIGHT, {
      damping: 20,
      stiffness: 200,
      mass: 0.5,
    });
    setTimeout(onClose, 300);
  };

  const handleSave = () => {
    onSave(factIndex, fact);
    closeModal();
  };

  const gesture = Gesture.Pan()
    .onStart(() => {
      translateY.value = 0;
    })
    .onUpdate((event) => {
      translateY.value = Math.max(0, event.translationY);
    })
    .onEnd((event) => {
      if (event.velocityY > 500 || event.translationY > SCREEN_HEIGHT * 0.2) {
        runOnJS(closeModal)();
      } else {
        translateY.value = withSpring(0, {
          damping: 20,
          stiffness: 200,
          mass: 0.5,
        });
      }
    });

  return (
    <GestureHandlerRootView style={StyleSheet.absoluteFill}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.modalContainer, animatedStyle]}>
          <View style={styles.dragIndicator} />
          <View style={styles.header}>
            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.headerButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Vibe Fact #{factIndex + 1}</Text>
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.headerButton}>Save</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.content}>
            <TextInput
              style={styles.input}
              value={fact}
              onChangeText={(text) => setFact(text.slice(0, MAX_FACT_LENGTH))}
              placeholder="Enter your vibe fact"
              placeholderTextColor="#666"
              multiline
              maxLength={MAX_FACT_LENGTH}
            />
            <Text style={styles.charCount}>
              {fact.length}/{MAX_FACT_LENGTH}
            </Text>
          </View>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.54,
    backgroundColor: '#000',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#666',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerButton: {
    color: '#3A93FA',
    fontSize: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  input: {
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#3A93FA',
    borderRadius: 10,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    color: '#666',
    fontSize: 12,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
});