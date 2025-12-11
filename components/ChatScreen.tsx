import React, { useState, useEffect } from 'react';
import { User } from '../types';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import { generateDiscussionPoints } from '../services/geminiService';
import { ARTICLE_CONTENT } from '../article';

interface ChatScreenProps {
  user: User;
  onLogout: () => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ user, onLogout }) => {
  const [articleTitle, setArticleTitle] = useState('');
  const [discussionQuestions, setDiscussionQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processArticle = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // The content is now embedded locally, so no fetching is needed.
        // We just need to generate the title and questions using the AI.
        const points = await generateDiscussionPoints(ARTICLE_CONTENT);
        setArticleTitle(points.title);
        setDiscussionQuestions(points.questions);

      } catch (err) {
        console.error("Failed to initialize chat screen:", err);
        const message = err instanceof Error ? err.message : "An unknown error occurred while analyzing the article.";
        setError(`Failed to prepare the discussion. Please try refreshing the page. Details: ${message}`);
      } finally {
        setIsLoading(false);
      }
    };

    processArticle();
  }, []); // Run once on mount

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="flex flex-col items-center text-center">
             <svg className="w-10 h-10 mb-4 text-indigo-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Preparing Your Session</h2>
            <p className="text-gray-500 dark:text-gray-400">Analyzing the article...</p>
        </div>
      </div>
    );
  }

  if (error) {
     return (
      <div className="flex items-center justify-center h-screen bg-red-50 dark:bg-gray-900">
        <div className="p-8 space-y-4 bg-white border-2 border-red-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-red-700 max-w-lg text-center">
            <h2 className="text-xl font-bold text-red-700 dark:text-red-400">Initialization Failed</h2>
            <p className="text-gray-600 dark:text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen font-sans antialiased text-gray-800 bg-gray-100 dark:bg-gray-900 dark:text-gray-200">
      <Sidebar 
        user={user} 
        onLogout={onLogout}
        articleTitle={articleTitle}
        discussionQuestions={discussionQuestions}
      />
      <main className="flex flex-col flex-1 w-full h-screen">
        <ChatWindow 
            user={user} 
            articleContent={ARTICLE_CONTENT} 
        />
      </main>
    </div>
  );
};

export default ChatScreen;