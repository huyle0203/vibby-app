import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the shape of the user object
interface User {
  // Add properties that your user object will have
  id?: string;
  email?: string;
  // Add other user properties as needed
}

// Define the shape of the context value
interface AuthContextType {
  user: User | null;
  setAuth: (user: User | null) => void;
  setUserData: (userData: Partial<User>) => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const setAuth = (authUser: User | null) => {
    setUser(authUser);
  };

  const setUserData = (userData: Partial<User>) => {
    setUser(prevUser => ({...prevUser, ...userData}));
  };

  return (
    <AuthContext.Provider value={{ user, setAuth, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};