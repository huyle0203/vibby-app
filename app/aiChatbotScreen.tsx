import { View, Text, SafeAreaView, StyleSheet, ScrollView, Button } from 'react-native';
import React, { useState } from 'react';
import { hp, wp } from './helpers/common';
import BackButton from '@/components/Buttons/BackButtonSmall';
import { router } from 'expo-router';
import { dummyMessages } from '@/constants';
import Feature from '@/components/Feature';
import { theme } from '@/constants/theme'
import CustomTextInput from '@/components/CustomTextInput';
import { callChatGPT } from '@/utils/api'; // Import the API utility

export default function AIChatbotScreen() {
  const [messages, setMessages] = useState(dummyMessages);
  const [inputText, setInputText] = useState('');

  // Function to split long text into multiple bubbles
  const splitTextIntoBubbles = (text: string, maxLength = 100) => {
    const words = text.split(' ');
    const bubbles = [];
    let currentBubble = '';

    words.forEach(word => {
      if ((currentBubble + word).length > maxLength) {
        bubbles.push(currentBubble.trim());
        currentBubble = '';
      }
      currentBubble += `${word} `;
    });

    if (currentBubble.trim()) {
      bubbles.push(currentBubble.trim());
    }

    return bubbles;
  };

  // Function to handle sending a message
  const handleSendMessage = async () => {
    if (inputText.trim()) {
      const newMessage = { role: 'user', content: inputText };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputText('');
      try {
        const assistantMessage = await callChatGPT(inputText);
        const messageBubbles = splitTextIntoBubbles(assistantMessage);
        const assistantMessages = messageBubbles.map(content => ({ role: 'assistant', content }));
        setMessages((prevMessages) => [...prevMessages, ...assistantMessages]);
      } catch (error) {
        console.error('Error getting response from ChatGPT:', error);
      }
    }
  };

  // Function to clear chat messages
  const handleClearMessages = () => {
    setMessages([]);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeView}>
        <BackButton router={router} />
        <Text style={styles.title}>Chat Bot</Text>
        <Button title="Clear Chat" onPress={handleClearMessages} />

        {messages.length > 0 ? (
          <View style={styles.chatContainer}>
            <Text style={{fontSize: wp(5)}}>Assistant</Text>
            <ScrollView
              style={styles.scrollView}
              bounces={false}
              showsVerticalScrollIndicator={false}
            >
              {
                messages.map((message, index) => (
                  <View key={index} style={message.role === 'assistant' ? styles.messageRowAssistant : styles.messageRowUser}>
                    <View style={message.role === 'assistant' ? styles.messageAssistant : styles.messageUser}>
                      <Text style={styles.messageText}>
                        {message.content}
                      </Text>
                    </View>
                  </View>
                ))
              }
            </ScrollView>
          </View>
        ) : (
          <Feature />
        )}
      </SafeAreaView>
      
      <View style={styles.footer}>
        <CustomTextInput
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSendMessage}
          theme="light" // Ensure this is a string
          onIconPress={handleSendMessage}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeView: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    paddingVertical: 1,
    paddingHorizontal: 20,
    borderTopWidth: 1,
  },
  messageRowUser: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  messageRowAssistant: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  messageUser: {
    backgroundColor: "#3A93FA",
    borderRadius: theme.radius.lg,
    borderTopRightRadius: 0,
    padding: 10,
    maxWidth: '80%',
  },
  messageAssistant: {
    backgroundColor: "#3A93FA",
    borderRadius: theme.radius.lg,
    borderTopLeftRadius: 0,
    padding: 10,
    maxWidth: '80%',
  },
  messageText: {
    color: 'white',
    fontSize: wp(4),
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: '80%',
    alignSelf: 'center',
  },
});