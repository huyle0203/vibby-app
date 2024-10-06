import React, { useState, useRef, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, Image, KeyboardAvoidingView, Platform, Keyboard, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import BackButton from '@/components/Buttons/BackButtonSmall';
import { callOpenAIAssistant } from '@/utils/api';
import CustomTextInput from '@/components/CustomTextInput';
import { useChatContext } from '@/context/ChatContext';
import StaticSlider, {User} from '@/components/StaticSlider/StaticSlider'; 
import UserProfileModal from '@/components/UserProfileModal';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function AIChatbotScreen() {
  const { initialMessage, setInitialMessage } = useChatContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showBios, setShowBios] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    if (initialMessage) {
      handleInitialMessage();
    }
  }, []);

  const handleInitialMessage = async () => {
    const newMessage: Message = { role: 'user', content: initialMessage };
    setMessages([newMessage]);
    setInitialMessage('');
    await getAssistantResponse(initialMessage);
  };

  const handleSendMessage = async () => {
    if (inputText.trim()) {
      const newMessage: Message = { role: 'user', content: inputText };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setInputText('');
      await getAssistantResponse(inputText);
    }
  };

  const getAssistantResponse = async (message: string) => {
    setIsLoading(true);
    try {
      const assistantMessage = await callOpenAIAssistant(message);
      const assistantResponses = assistantMessage.split('\n').filter((msg: string) => msg.trim() !== '');
      
      for (let response of assistantResponses) {
        const newAssistantMessage: Message = { role: 'assistant', content: response };
        setMessages(prevMessages => [...prevMessages, newAssistantMessage]);
        
        if (response.includes("Vibby gotchu 🤩! Have a look at their bio!")) {
          setShowBios(true);
        }
        
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error('Error getting response from OpenAI Assistant:', error);
      setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setIsProfileModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackButton router={router} />
      
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatContainer}
          contentContainerStyle={styles.chatContent}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((message, index) => (
            <View key={index} style={[
              styles.messageBubble,
              message.role === 'user' ? styles.userBubble : styles.assistantBubble
            ]}>
              {message.role === 'assistant' && (
                <Image
                  source={require('../assets/images/penguin2.png')}
                  style={styles.avatar}
                />
              )}
              <View style={[
                styles.messageContent,
                message.role === 'user' ? styles.userMessageContent : styles.assistantMessageContent
              ]}>
                <Text style={styles.messageText}>{message.content}</Text>
              </View>
            </View>
          ))}
          {showBios && (
            <View style={styles.sliderContainer}>
              <StaticSlider onUserSelect={handleUserSelect} />
            </View>
          )}
        </ScrollView>
        {/* for iphone: safeAreaView */}
        
        <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        <SafeAreaView> 
          <CustomTextInput
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSendMessage}
            theme="dark"
            onIconPress={handleSendMessage}
            editable={!isLoading}
          />
            </SafeAreaView>

      </KeyboardAvoidingView>
    
      {selectedUser && (
        <UserProfileModal
          isVisible={isProfileModalVisible}
          onClose={() => setIsProfileModalVisible(false)}
          user={selectedUser}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    paddingBottom: 90, // Increased padding to account for the input container
  },
  messageBubble: {
    flexDirection: 'row',
    marginBottom: 12,
    maxWidth: '80%',
  },
  userBubble: {
    alignSelf: 'flex-end',
  },
  assistantBubble: {
    alignSelf: 'flex-start',
  },
  messageContent: {
    borderRadius: 20,
    padding: 12,
  },
  userMessageContent: {
    backgroundColor: '#3A93FA', 
  },
  assistantMessageContent: {
    backgroundColor: '#36454F',
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  inputContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 10,
    left: 0,
    right: 0,
    paddingTop: 10,
    paddingHorizontal: 20,
    backgroundColor: '#000',
  },
  sliderContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
});