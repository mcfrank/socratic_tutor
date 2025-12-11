import React from 'react';
import { Message, Role } from '../types';

interface MessageProps {
  message: Message;
  personaName: string;
}

const MessageComponent: React.FC<MessageProps> = ({ message, personaName }) => {
  const isUser = message.role === Role.USER;

  const wrapperClasses = isUser ? 'flex justify-end' : 'flex';
  const bubbleClasses = isUser
    ? 'bg-indigo-500 text-white'
    : 'bg-white text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  const authorName = isUser ? 'You' : personaName;

  // Basic markdown-like formatting for newlines
  const formattedText = message.text.split('\n').map((line, index) => (
    <span key={index}>
      {line}
      <br />
    </span>
  ));

  return (
    <div className={wrapperClasses}>
      <div className="flex flex-col max-w-lg">
        <div className={`px-4 py-3 rounded-2xl shadow ${bubbleClasses}`}>
          <p className="text-sm">{formattedText}</p>
        </div>
        <div className={`mt-1 text-xs text-gray-500 dark:text-gray-400 ${isUser ? 'text-right' : 'text-left'}`}>
          {authorName}
        </div>
      </div>
    </div>
  );
};

export default MessageComponent;
