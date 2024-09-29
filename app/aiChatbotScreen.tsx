import React, { useState, useRef } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import BackButton from '@/components/Buttons/BackButtonSmall';
import { callOpenAIAssistant } from '@/utils/api';
import { theme } from '@/constants/theme';
import { hp, wp } from './helpers/common';
import { SendIcon } from 'lucide-react-native';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIChatbotScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView | null>(null);

  const handleSendMessage = async () => {
    if (inputText.trim()) {
      const newMessage: Message = { role: 'user', content: inputText };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setInputText('');
      setIsLoading(true);
      try {
        const assistantMessage = await callOpenAIAssistant(inputText);
        const newAssistantMessage: Message = { role: 'assistant', content: assistantMessage };
        setMessages(prevMessages => [...prevMessages, newAssistantMessage]);
      } catch (error) {
        console.error('Error getting response from OpenAI Assistant:', error);
        setMessages(prevMessages => [...prevMessages, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackButton router={router} />
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatContainer}
        contentContainerStyle={styles.chatContent}
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
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor="#A0A0A0"
        />
        <TouchableOpacity onPress={handleSendMessage} disabled={isLoading}>
          <SendIcon color={theme.colors.primary} size={24} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
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
    backgroundColor: '#36454F', // Dark gray color for assistant messages
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
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333333',
    padding: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    color: '#FFFFFF',
  },
});