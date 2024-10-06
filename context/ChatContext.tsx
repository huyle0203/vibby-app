import React, { createContext, useState, useContext } from 'react';

interface ChatContextType {
  initialMessage: string;
  setInitialMessage: (message: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [initialMessage, setInitialMessage] = useState('');

  return (
    <ChatContext.Provider value={{ initialMessage, setInitialMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};