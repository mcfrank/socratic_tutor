import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message, Role, User } from '../types';
import { createChatSession } from '../services/geminiService';
import MessageComponent from './Message';
import { Chat } from '@google/genai';
import { PERSONAS } from '../personas';

interface ChatWindowProps {
  user: User;
  articleContent: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ user, articleContent }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activePersona = PERSONAS.find(p => p.id === user.personaId) || PERSONAS[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const saveHistory = useCallback((updatedMessages: Message[]) => {
      try {
        localStorage.setItem(`chatHistory_${user.id}`, JSON.stringify(updatedMessages));
      } catch (error) {
        console.error("Failed to save chat history", error);
      }
  }, [user.id]);

  useEffect(() => {
    const initializeChat = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const systemInstruction = activePersona.getSystemInstruction(articleContent);
        const storedHistory: Message[] = JSON.parse(localStorage.getItem(`chatHistory_${user.id}`) || '[]');
        
        if (storedHistory.length === 0) {
          // New chat: AI starts the conversation.
          const chatSession = createChatSession([], systemInstruction);
          chatSessionRef.current = chatSession;

          // A hidden prompt for the AI to generate its first question
          const stream = await chatSession.sendMessageStream({ message: "Hello, please begin our discussion." });
          
          let modelResponse = '';
          setMessages([{ role: Role.MODEL, text: '...' }]);

          for await (const chunk of stream) {
              modelResponse += chunk.text;
              setMessages([{ role: Role.MODEL, text: modelResponse }]);
          }
          
          const historyToSave = [
              { role: Role.USER, text: "Hello, please begin our discussion." }, // Keep history consistent for AI
              { role: Role.MODEL, text: modelResponse }
          ];
          saveHistory(historyToSave);
          setMessages([historyToSave[1]]); // But only show the AI's first message to the user

        } else {
          chatSessionRef.current = createChatSession(storedHistory, systemInstruction);
          setMessages(storedHistory.filter(msg => msg.text.trim() !== '' && msg.text.trim() !== "Hello, please begin our discussion."));
        }
      } catch (chatError) {
        console.error("Failed to initialize chat:", chatError);
        setError("I seem to have encountered an error preparing our dialogue. Please try refreshing the page.");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (articleContent) {
        initializeChat();
    }
  }, [user.id, user.personaId, saveHistory, activePersona, articleContent]);


  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: Role.USER, text: input.trim() };
    
    // Optimistically update UI
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    if (!chatSessionRef.current) {
      console.error("Chat session not initialized!");
      setError("The chat session isn't ready. Please refresh.");
      setIsLoading(false);
      return;
    }
    
    try {
      const stream = await chatSessionRef.current.sendMessageStream({ message: userMessage.text });

      let modelResponse = '';
      setMessages(prev => [...prev, { role: Role.MODEL, text: '...' }]);

      for await (const chunk of stream) {
        modelResponse += chunk.text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: Role.MODEL, text: modelResponse };
          return newMessages;
        });
      }
      
      const storedHistory = JSON.parse(localStorage.getItem(`chatHistory_${user.id}`) || '[]');
      const finalHistory = [...storedHistory, userMessage, { role: Role.MODEL, text: modelResponse }];
      saveHistory(finalHistory);

    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { role: Role.MODEL, text: "I seem to have encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full p-4 overflow-hidden">
      {isLoading && messages.length === 0 ? (
        <div className="flex items-center justify-center flex-1">
          <div className="flex flex-col items-center text-center">
             <svg className="w-8 h-8 mb-2 text-indigo-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Preparing Dialogue</h2>
            <p className="text-gray-500 dark:text-gray-400">{activePersona.name} is pondering the first question...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 pr-4 overflow-y-auto">
            <div className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-800 bg-red-100 rounded-lg dark:bg-red-900/50 dark:text-red-300">
                  <strong>Error:</strong> {error}
                </div>
              )}
              {messages.map((msg, index) => (
                <MessageComponent key={index} message={msg} personaName={activePersona.name} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          <div className="w-full pt-4">
            <form onSubmit={handleSend} className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isLoading ? `${activePersona.name} is thinking...` : "What is on your mind?"}
                className="w-full p-4 pr-16 text-gray-800 bg-white border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 p-2 text-white bg-indigo-600 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed dark:disabled:bg-indigo-800"
                aria-label="Send message"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" transform='rotate(90)'>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatWindow;