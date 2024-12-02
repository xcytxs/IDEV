import React, { memo } from 'react';
import { Message } from '../../types/chat';
import { FileText } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = memo<ChatMessageProps>(({ message }) => {
  return (
    <div
      className={`flex ${
        message.role === 'user' ? 'justify-end' : 'justify-start'
      } mb-4`}
    >
      <div
        className={`max-w-[80%] rounded-lg p-3 ${
          message.role === 'user'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-700 text-gray-100'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        {message.files && message.files.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-600">
            <p className="text-sm font-medium mb-1">Modified files:</p>
            {message.files.map((file, index) => (
              <div key={index} className="flex items-center text-sm opacity-75">
                <FileText size={14} className="mr-1" />
                {file}
              </div>
            ))}
          </div>
        )}
        <span className="text-xs opacity-75 mt-1 block">
          {message.timestamp.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
});

export default ChatMessage;