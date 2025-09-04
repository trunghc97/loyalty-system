import React, { useState, useRef, useEffect } from 'react';
import { chat } from '@/services/llm';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatbotLLMProps {
  className?: string;
  isBubbleMode?: boolean;
}

/**
 * ChatbotLLM Component
 * 
 * A reusable chat interface component for interacting with LLM API.
 * Features:
 * - Responsive design (mobile & desktop)
 * - Message history with auto-scroll
 * - Loading states & error handling
 * - Message history limit (20 messages)
 * - Input/output validation with llm-guard
 * 
 * @param {string} className - Optional additional CSS classes
 * @param {boolean} isBubbleMode - Optional bubble mode for floating chat
 */
export const ChatbotLLM: React.FC<ChatbotLLMProps> = ({
  className = '',
  isBubbleMode = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  // State management
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Trim message history to keep only last 20 messages
  const trimMessages = (msgs: Message[]): Message[] => {
    return msgs.slice(-20);
  };

  // Handle message submission
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!input.trim() || isLoading) return;

    try {
      setIsLoading(true);
      setError(null);

      // Add user message
      const newMessages = trimMessages([
        ...messages,
        { role: 'user', content: input.trim() }
      ]);
      setMessages(newMessages);
      setInput('');

      // Call API
      const { data } = await chat(newMessages);

      // Add assistant response
      setMessages(prevMessages => 
        trimMessages([
          ...prevMessages,
          { role: 'assistant', content: data.answer }
        ])
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi gửi tin nhắn');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key (with Shift+Enter for new line)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (isBubbleMode && !isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-500 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition-all duration-300 transform hover:scale-110 z-50 animate-bounce-slow"
      >
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>
        </div>
      </button>
    );
  }

  return (
    <div 
      className={`
        ${isBubbleMode ? 'fixed bottom-6 right-6 w-96 z-50' : ''} 
        flex flex-col h-[500px] bg-white rounded-lg shadow-lg 
        ${isBubbleMode ? 'transform transition-all duration-300 ease-in-out' : ''} 
        ${isBubbleMode && isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'} 
        ${className}
      `}
    >
      {/* Chat header */}
      <div className="px-4 py-3 border-b flex justify-between items-center">
        <h3 className="text-lg font-semibold">Chat với AI Assistant</h3>
        {isBubbleMode && (
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      {/* Chat messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="px-4 py-2 bg-red-50 border-t border-red-200">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Input area */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập tin nhắn..."
            className="flex-1 min-h-[44px] max-h-[120px] p-2 border rounded-lg resize-y"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`px-4 py-2 rounded-lg font-medium ${
              isLoading || !input.trim()
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Gửi
          </button>
        </div>
      </form>
    </div>
  );
};

/**
 * Hướng dẫn mở rộng:
 * 
 * 1. Thêm hỗ trợ Markdown:
 * - Cài đặt: npm install react-markdown
 * - Import và sử dụng ReactMarkdown component
 * 
 * 2. Thêm hỗ trợ Emoji:
 * - Cài đặt: npm install emoji-mart
 * - Thêm Emoji Picker
 * 
 * 3. Thêm tính năng:
 * - Lưu lịch sử chat vào localStorage
 * - Thêm nút xóa lịch sử
 * - Thêm nút copy message
 * - Hiển thị thời gian gửi tin nhắn
 */
