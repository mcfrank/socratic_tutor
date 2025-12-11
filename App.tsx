
import React from 'react';
import { useAuth } from './hooks/useAuth';
import LoginScreen from './components/LoginScreen';
import ChatScreen from './components/ChatScreen';

const App: React.FC = () => {
  const { user, login, logout } = useAuth();

  if (!user) {
    return <LoginScreen onLogin={login} />;
  }

  return <ChatScreen user={user} onLogout={logout} />;
};

export default App;
