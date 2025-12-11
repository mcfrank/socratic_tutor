import React from 'react';
import { User } from '../types';
import { ARTICLE_URL } from '../constants';
import { PERSONAS } from '../personas';

interface SidebarProps {
  user: User;
  onLogout: () => void;
  articleTitle: string;
  discussionQuestions: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout, articleTitle, discussionQuestions }) => {
  const activePersona = PERSONAS.find(p => p.id === user.personaId);
  const articleHostname = new URL(ARTICLE_URL).hostname;

  return (
    <aside className="flex flex-col flex-shrink-0 w-80 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold">Socratic Tutor</h1>
        <button onClick={onLogout} className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
          Logout
        </button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="mb-6">
          <h2 className="mb-2 text-sm font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">Student</h2>
          <p className="text-gray-700 dark:text-gray-300">{user.name}</p>
        </div>
         <div className="mb-6">
          <h2 className="mb-2 text-sm font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">Active Tutor</h2>
          <p className="text-gray-700 dark:text-gray-300">{activePersona?.name || 'Unknown'}</p>
        </div>
        <div className="mb-6">
          <h2 className="mb-2 text-sm font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">Reading Material</h2>
          <a 
            href={ARTICLE_URL} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block p-3 text-indigo-700 bg-indigo-100 rounded-lg hover:bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-900"
          >
            {articleTitle}
            <span className="block mt-1 text-xs text-indigo-500 dark:text-indigo-400">{articleHostname}</span>
          </a>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">Discussion Points</h2>
          <ul className="space-y-3 text-sm">
            {discussionQuestions.map((q, index) => (
              <li key={index} className="flex">
                <span className="mr-2 text-indigo-500 dark:text-indigo-400">&#8227;</span>
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;