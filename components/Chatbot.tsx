import React, { useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import type { AnalysisResult } from '../types';
import { Send, User, Bot } from 'lucide-react';

interface ChatbotProps {
  analysisContext: AnalysisResult;
}

const Chatbot: React.FC<ChatbotProps> = ({ analysisContext }) => {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({ analysisContext });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md flex flex-col h-[60vh]">
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'model' && (
              <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white flex-shrink-0">
                <Bot size={20} />
              </div>
            )}
            <div className={`max-w-lg px-4 py-2 rounded-lg ${
              msg.role === 'user'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
            }`}>
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white flex-shrink-0">
                <User size={20} />
              </div>
            )}
          </div>
        ))}
        {isLoading && messages.length > 0 && messages[messages.length-1].role === 'user' && (
             <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white flex-shrink-0">
                    <Bot size={20} />
                </div>
                <div className="max-w-lg px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Ask a follow-up question..."
          className="flex-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-gray-50 dark:bg-gray-700"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 dark:disabled:bg-primary-700 disabled:cursor-not-allowed"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

export default Chatbot;