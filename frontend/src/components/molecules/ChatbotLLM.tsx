import React, { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  answer: string;
}

interface ChatbotLLMProps {
  endpoint?: string;
  className?: string;
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
 * - Customizable API endpoint
 * 
 * @param {string} endpoint - Optional API endpoint override
 * @param {string} className - Optional additional CSS classes
 */
export const ChatbotLLM: React.FC<ChatbotLLMProps> = ({
  endpoint = '/api/llm/chat',
  className = '',
}) => {
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
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data: ChatResponse = await response.json();

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

  return (
    <div className={`flex flex-col h-[500px] bg-white rounded-lg shadow-lg ${className}`}>
      {/* Chat header */}
      <div className="px-4 py-3 border-b">
        <h3 className="text-lg font-semibold">Chat với AI Assistant</h3>
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

/* 
Hướng dẫn mở rộng:

1. Thêm hỗ trợ Markdown:
- Cài đặt: npm install react-markdown
- Import: import ReactMarkdown from 'react-markdown'
- Thay thế phần hiển thị message content:
  <ReactMarkdown>{message.content}</ReactMarkdown>

2. Thêm hỗ trợ Emoji:
- Cài đặt: npm install emoji-mart
- Import: import { Picker } from 'emoji-mart'
- Thêm button chọn emoji và xử lý sự kiện

3. Thêm tính năng:
- Lưu lịch sử chat vào localStorage
- Thêm nút xóa lịch sử
- Thêm nút copy message
- Hiển thị thời gian gửi tin nhắn
*/
