import React, { useState, useCallback } from 'react';
import { User, Message } from '../types';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import { generateConversationSummary } from '../services/geminiService';

interface ChatScreenProps {
  user: User;
  onLogout: () => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ user, onLogout }) => {
  const [summary, setSummary] = useState<string>('');
  
  // Use the title from the selected article directly
  const articleTitle = user.article.title;

  const handleConversationUpdate = useCallback(async (history: Message[]) => {
    // Only summarize if there is meaningful history
    if (history.length > 1) {
      try {
        const newSummary = await generateConversationSummary(history);
        setSummary(newSummary);
      } catch (e) {
        console.error("Failed to update summary", e);
      }
    }
  }, []);

  return (
    <div className="flex h-screen font-sans antialiased text-gray-800 bg-gray-100 dark:bg-gray-900 dark:text-gray-200">
      <Sidebar 
        user={user} 
        onLogout={onLogout}
        articleTitle={articleTitle}
        conversationSummary={summary}
      />
      <main className="flex flex-col flex-1 w-full h-screen">
        <ChatWindow 
            user={user} 
            articleContent={user.article.content} 
            onConversationUpdate={handleConversationUpdate}
        />
      </main>
    </div>
  );
};

export default ChatScreen;