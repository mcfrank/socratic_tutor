import React, { useState } from 'react';
import { PERSONAS } from '../personas';
import { Article } from '../types';
import { articlesData } from '../articles';

interface LoginScreenProps {
  onLogin: (username: string, personaId: string, article: Article) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [selectedArticleId, setSelectedArticleId] = useState(articlesData[0].id);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const article = articlesData.find(a => a.id === selectedArticleId);
    if (username.trim() && article) {
      // Default to the first persona (AI Tutor) as selection is removed
      onLogin(username.trim(), PERSONAS[0].id, article);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-lg p-8 space-y-8 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Socratic Tutor</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Engage in dialogue. Sharpen your mind.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="username" className="text-sm font-bold text-gray-700 dark:text-gray-300">Your Name</label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="relative block w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 bg-gray-100 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="Enter your name to begin"
            />
          </div>

          <div>
            <label htmlFor="article" className="text-sm font-bold text-gray-700 dark:text-gray-300">Select Article</label>
            <select
              id="article"
              name="article"
              required
              value={selectedArticleId}
              onChange={(e) => setSelectedArticleId(e.target.value)}
              className="relative block w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {articlesData.map((article) => (
                <option key={article.id} value={article.id}>
                  {article.title}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 dark:disabled:bg-indigo-800"
            disabled={!username.trim()}
          >
            Start Dialogue
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;