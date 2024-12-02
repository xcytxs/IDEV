import React, { useState, useRef, useEffect } from 'react';
import { Send, FileText, AlertCircle, Loader } from 'lucide-react';
import { Agent } from '../../types/agent';
import { Project, ProjectFile } from '../../types/project';
import { useAgent } from '../../hooks/useAgent';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  files?: ProjectFile[];
}

interface AgentChatProps {
  agent: Agent;
  project: Project;
  onUpdateProject?: (updates: Partial<Project>) => void;
}

const AgentChat: React.FC<AgentChatProps> = ({
  agent,
  project,
  onUpdateProject
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sendMessage, isProcessing, error, lastFiles } = useAgent(agent, project);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    const initializeChat = async () => {
      if (!hasInitialized && agent && project) {
        const initialMessage: Message = {
          id: `initial-${Date.now()}`,
          role: 'assistant',
          content: `Hi! I'm ${agent.name}, and I'll help you with your ${project.type} project.`,
          timestamp: new Date()
        };
        setMessages([initialMessage]);
        setHasInitialized(true);

        try {
          const analysis = await sendMessage('analyze project structure and requirements');
          const analysisMessage: Message = {
            id: `analysis-${Date.now()}-${Math.random().toString(36).substring(2)}`,
            role: 'assistant',
            content: analysis,
            timestamp: new Date(),
            files: lastFiles
          };
          setMessages(prev => [...prev, analysisMessage]);
        } catch (error) {
          console.error('Error analyzing project:', error);
        }
      }
    };

    initializeChat();
  }, [agent, project, hasInitialized, sendMessage, lastFiles]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await sendMessage(input);
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        files: lastFiles
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (lastFiles?.length && onUpdateProject) {
        const updatedFiles = [...project.files];
        for (const file of lastFiles) {
          const existingIndex = updatedFiles.findIndex(f => f.path === file.path);
          if (existingIndex >= 0) {
            updatedFiles[existingIndex] = file;
          } else {
            updatedFiles.push(file);
          }
        }

        onUpdateProject({
          files: updatedFiles,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'I encountered an error while processing your request. Please try again.',
        timestamp: new Date()
      }]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-gray-100">
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
              {message.files && message.files.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-600">
                  <p className="text-sm font-medium mb-1">Modified files:</p>
                  {message.files.map((file) => (
                    <div key={file.path} className="flex items-center text-sm opacity-75">
                      <FileText size={14} className="mr-1" />
                      {file.path}
                    </div>
                  ))}
                </div>
              )}
              <span className="text-xs opacity-75 mt-1 block">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 text-red-400 flex items-center mx-4 mb-4 rounded">
          <AlertCircle size={18} className="mr-2" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
        <div className="flex space-x-2">
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
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isProcessing ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgentChat;