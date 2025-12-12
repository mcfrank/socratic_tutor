import React from 'react';
import { User } from '../types';
import { PERSONAS } from '../personas';
import { jsPDF } from 'jspdf';

interface SidebarProps {
  user: User;
  onLogout: () => void;
  articleTitle: string;
  conversationSummary: string;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout, articleTitle, conversationSummary }) => {
  const activePersona = PERSONAS.find(p => p.id === user.personaId);
  // Ensure we have a valid URL object, fallback safely if url is weird
  let articleHostname = 'External Source';
  try {
    if (user.article && user.article.url) {
      articleHostname = new URL(user.article.url).hostname;
    }
  } catch (e) {
    // ignore invalid urls
  }

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxLineWidth = pageWidth - margin * 2;
    let y = 20;

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Socratic Tutor Session", margin, y);
    y += 12;

    // Metadata
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Student: ${user.name}`, margin, y);
    y += 8;
    doc.text(`Article: ${articleTitle}`, margin, y);
    y += 8;
    
    doc.setTextColor(0, 0, 255);
    doc.textWithLink(`Source: ${user.article.url}`, margin, y, { url: user.article.url });
    doc.setTextColor(0, 0, 0);
    y += 15;

    // Conversation Summary
    if (conversationSummary) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Conversation Summary", margin, y);
      y += 8;
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      // Clean up bullets for PDF
      const summaryText = conversationSummary.replace(/^-\s*/gm, '• ');
      const summaryLines = doc.splitTextToSize(summaryText, maxLineWidth);
      doc.text(summaryLines, margin, y);
      y += (summaryLines.length * 6) + 15;
    }

    // Chat Transcript
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Transcript", margin, y);
    y += 10;

    const history = JSON.parse(localStorage.getItem(`chatHistory_${user.id}`) || '[]');
    
    doc.setFontSize(10);
    history.forEach((msg: any) => {
      // Check for page break
      if (y > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = 20;
      }

      const role = msg.role === 'user' ? 'Student' : 'Tutor';
      const text = msg.text;
      
      doc.setFont("helvetica", "bold");
      doc.text(`${role}:`, margin, y);
      const roleWidth = doc.getTextWidth(`${role}:`);
      
      doc.setFont("helvetica", "normal");
      const textLines = doc.splitTextToSize(text, maxLineWidth - roleWidth - 5);
      
      doc.text(textLines, margin + roleWidth + 2, y);
      y += (textLines.length * 5) + 4;
    });

    doc.save('socratic_session.pdf');
  };

  const renderSummaryPoints = () => {
    if (!conversationSummary) {
      return <p className="text-xs text-gray-500 italic">Start discussing to generate a summary...</p>;
    }
    
    // Split by hyphens or newlines and render list items
    const points = conversationSummary.split('\n').filter(line => line.trim().length > 0);
    return (
      <ul className="space-y-3 text-sm">
        {points.map((point, index) => {
          const cleanPoint = point.replace(/^-\s*/, '').trim();
          return (
            <li key={index} className="flex">
              <span className="mr-2 text-indigo-500 dark:text-indigo-400">&#8227;</span>
              <span>{cleanPoint}</span>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <aside className="flex flex-col flex-shrink-0 w-80 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold">Socratic Tutor</h1>
        <button 
          onClick={handleDownloadPDF} 
          className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
          title="Download PDF Transcript"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          PDF
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
            href={user.article.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block p-3 text-indigo-700 bg-indigo-100 rounded-lg hover:bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-900"
          >
            {articleTitle}
            <span className="block mt-1 text-xs text-indigo-500 dark:text-indigo-400">{articleHostname}</span>
          </a>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">Conversation Summary</h2>
          {renderSummaryPoints()}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;