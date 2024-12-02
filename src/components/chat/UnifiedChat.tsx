import React, { useCallback, useEffect } from 'react';
import { Project } from '../../types/project';
import { useChatStore } from '../../store/chatStore';
import { useAgentStore } from '../../store/agentStore';
import { useProjectStore } from '../../store/projectStore';
import ChatWindow from './ChatWindow';
import AgentSelector from './AgentSelector';
import { useAgent } from '../../hooks/useAgent';

interface UnifiedChatProps {
  project: Project;
  onUpdateProject: (updates: Partial<Project>) => void;
}

const UnifiedChat: React.FC<UnifiedChatProps> = ({ project, onUpdateProject }) => {
  const {
    messages,
    input,
    isProcessing,
    setInput,
    addMessage,
    clearMessages
  } = useChatStore();
  
  const { selectedAgent } = useAgentStore();
  const { sendMessage, lastFiles } = useAgent(selectedAgent, project);

  useEffect(() => {
    if (selectedAgent) {
      addMessage({
        id: `initial-${Date.now()}`,
        role: 'assistant',
        content: `Hi! I'm ${selectedAgent.name}, and I'll help you with your ${project.type} project.`,
        timestamp: new Date()
      });
    }
    return () => clearMessages();
  }, [selectedAgent?.id]);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isProcessing || !selectedAgent) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user' as const,
      content,
      timestamp: new Date()
    };

    addMessage(userMessage);
    setInput('');

    try {
      const response = await sendMessage(content);
      
      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant' as const,
        content: response,
        timestamp: new Date(),
        files: lastFiles
      };

      addMessage(assistantMessage);

      if (lastFiles?.length) {
        onUpdateProject({
          files: project.files.map(f => {
            const updatedFile = lastFiles.find(newFile => newFile.path === f.path);
            return updatedFile || f;
          }).concat(lastFiles.filter(newFile => 
            !project.files.some(f => f.path === newFile.path)
          ))
        });
      }
    } catch (error) {
      addMessage({
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'I encountered an error while processing your request. Please try again.',
        timestamp: new Date()
      });
    }
  }, [selectedAgent, isProcessing, sendMessage, lastFiles, project.files]);

  if (!selectedAgent) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Select an agent to start chatting
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <AgentSelector project={project} />
      <ChatWindow
        messages={messages}
        input={input}
        isProcessing={isProcessing}
        onInputChange={setInput}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default UnifiedChat;