import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { User, Article } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string, personaId: string, article: Article) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('socratic_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('socratic_user');
    }
  }, []);

  const login = useCallback((username: string, personaId: string, article: Article) => {
    // In a real app, this would involve a SAML redirect and callback.
    // Here, we'll just create a user object and store it.
    const newUser: User = { 
      id: `user_${username.toLowerCase()}`, 
      name: username, 
      personaId,
      article
    };
    localStorage.setItem('socratic_user', JSON.stringify(newUser));
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    // Also clear chat history for the user on logout
    if (user) {
       localStorage.removeItem(`chatHistory_${user.id}`);
    }
    localStorage.removeItem('socratic_user');
    setUser(null);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};