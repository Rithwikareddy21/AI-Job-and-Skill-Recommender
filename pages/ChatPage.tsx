import React from 'react';
import type { AnalysisResult } from '../types';
import Chatbot from '../components/Chatbot';
import { Bot, Info } from 'lucide-react';

interface ChatPageProps {
  analysisContext: AnalysisResult | null;
}

const ChatPage: React.FC<ChatPageProps> = ({ analysisContext }) => {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Bot className="w-8 h-8 text-primary-500" />
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">AI Career Advisor Chat</h1>
      </div>
      
      {analysisContext ? (
        <Chatbot analysisContext={analysisContext} />
      ) : (
        <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col items-center">
            <Info className="w-12 h-12 text-primary-500 mb-4" />
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">No analysis found.</p>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Please perform a career analysis on the dashboard first to activate the chat.
            </p>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
