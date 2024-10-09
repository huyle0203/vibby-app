import React, { createContext, useState, useContext, ReactNode } from "react";

interface User {
  id: string;
  email?: string;
  name?: string;
  date_of_birth?: string;
  gender?: 'Woman' | 'Man' | 'Nonbinary';
  profile_picture?: string;
  tags?: string[];
  images?: string[];
  facts?: string[];
  highlightBio?: string;
}

interface AuthContextType {
  user: User | null;
  setAuth: (user: User | null) => void;
  setUserData: (userData: Partial<User>) => void;
  isAuthenticated: boolean;
}

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
    setUser(prevUser => prevUser ? {...prevUser, ...userData} : userData as User);
  };

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{ user, setAuth, setUserData, isAuthenticated }}>
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