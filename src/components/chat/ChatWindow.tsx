import React, { useRef, useEffect, memo } from 'react';
import { Send, Loader } from 'lucide-react';
import { Message } from '../../types/chat';
import ChatMessage from './ChatMessage';
import { useChatStore } from '../../store/chatStore';

interface ChatWindowProps {
  onSendMessage: (content: string) => void;
}

const ChatWindow = memo<ChatWindowProps>(({ onSendMessage }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, input, isProcessing, setInput } = useChatStore();

  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };

    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      onSendMessage(input);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="min-h-0 flex flex-col justify-end">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-4">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-700 text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isProcessing}
          />
          <button
            type="submit"
            disabled={isProcessing || !input.trim()}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center w-10 h-10"
          >
            {isProcessing ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              <Send size={20} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
});

export default ChatWindow;