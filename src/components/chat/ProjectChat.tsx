import React, { useState, useRef, useEffect } from 'react';
import { Send, Image, Download, Save, Paperclip } from 'lucide-react';
import { Agent } from '../../types/agent';
import { Project } from '../../types/project';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  attachments?: {
    type: 'image' | 'file' | 'code' | 'chapter' | 'scene';
    url: string;
    name: string;
    preview?: string;
  }[];
}

interface ProjectChatProps {
  project: Project;
  agent: Agent;
  onSendMessage: (content: string, attachments?: File[]) => Promise<void>;
  onSaveChat: () => void;
  onExportChat: (format: string) => void;
  features?: {
    imageUpload?: boolean;
    codeSnippets?: boolean;
    chapterPreview?: boolean;
    scenePreview?: boolean;
  };
}

const ProjectChat: React.FC<ProjectChatProps> = ({
  project,
  agent,
  onSendMessage,
  onSaveChat,
  onExportChat,
  features = {}
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() && attachments.length === 0) return;

    try {
      setIsLoading(true);
      await onSendMessage(input, attachments);
      
      const newMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: input,
        timestamp: new Date(),
        attachments: attachments.map(file => ({
          type: 'file',
          url: URL.createObjectURL(file),
          name: file.name
        }))
      };

      setMessages(prev => [...prev, newMessage]);
      setInput('');
      setAttachments([]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <div>
          <h2 className="text-xl font-semibold text-white">{agent.name}</h2>
          <p className="text-sm text-gray-400">{agent.description}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onSaveChat}
            className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            <Save size={20} />
          </button>
          <button
            onClick={() => onExportChat('markdown')}
            className="p-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
          >
            <Download size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-100'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              {message.attachments?.map((attachment, index) => (
                <div key={index} className="mt-2">
                  {attachment.type === 'image' ? (
                    <img
                      src={attachment.url}
                      alt={attachment.name}
                      className="max-w-full rounded"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-sm">
                      <Paperclip size={16} />
                      <span>{attachment.name}</span>
                    </div>
                  )}
                </div>
              ))}
              <span className="text-xs opacity-75 mt-1 block">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-700 p-4">
        <div className="flex items-center space-x-2">
          {features.imageUpload && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                multiple
                accept="image/*"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600"
              >
                <Image size={20} />
              </button>
            </>
          )}
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 bg-gray-700 text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || (!input.trim() && attachments.length === 0)}
            className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
        {attachments.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="px-2 py-1 bg-gray-700 rounded-lg text-sm text-gray-300 flex items-center"
              >
                {file.name}
                <button
                  onClick={() => setAttachments(prev => prev.filter((_, i) => i !== index))}
                  className="ml-2 text-red-400 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectChat;