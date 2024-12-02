import React, { useState, useRef, useEffect } from 'react';
import { Send, Save, Download } from 'lucide-react';
import { Project } from '../../types/project';
import { Agent } from '../../types/agent';
import { useOrchestrator } from '../../hooks/useOrchestrator';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface ProjectWorkspaceChatProps {
  project: Project;
  agent: Agent;
  onProjectUpdate: (projectId: string, updates: Partial<Project>) => void;
}

const ProjectWorkspaceChat: React.FC<ProjectWorkspaceChatProps> = ({
  project,
  agent,
  onProjectUpdate,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { context, addDecision } = useOrchestrator(project);

  useEffect(() => {
    // Initialize chat with a greeting
    if (messages.length === 0 && agent) {
      setMessages([{
        id: 'initial',
        role: 'assistant',
        content: `Hi! I'm ${agent.name}, and I'll help you with your ${project.type} project.`,
        timestamp: new Date()
      }]);
    }
  }, [agent?.name, project.type, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Add decision for project update
      await addDecision({
        type: 'project_update',
        description: 'User message in project chat',
        reasoning: input
      });

      // Simulate agent response
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `I understand you want to discuss "${input}". Let me help you with that.`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleSaveChat = () => {
    const chatData = {
      projectId: project.id,
      messages,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${project.id}-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportChat = () => {
    const chatText = messages
      .map(msg => `[${msg.timestamp.toLocaleString()}] ${msg.role}: ${msg.content}`)
      .join('\n\n');
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${project.id}-${new Date().toISOString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <div>
          <h2 className="text-xl font-semibold text-white">Project Assistant</h2>
          <p className="text-sm text-gray-400">Chat with {agent.name}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleSaveChat}
            className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            <Save size={20} />
          </button>
          <button
            onClick={handleExportChat}
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
            disabled={isLoading || !input.trim()}
            className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectWorkspaceChat;