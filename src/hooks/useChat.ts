import { useState, useCallback, useEffect, useRef } from 'react';
import { Agent } from '../types/agent';
import { Project } from '../types/project';
import { useAgent } from './useAgent';
import { Message } from '../types/chat';

export function useChat(agent: Agent | null, project: Project) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const { sendMessage, isProcessing, error, lastFiles } = useAgent(agent || {} as Agent, project);
  const initialized = useRef(false);

  useEffect(() => {
    if (!agent || initialized.current) return;
    
    setMessages([{
      id: `initial-${Date.now()}`,
      role: 'assistant',
      content: `Hi! I'm ${agent.name}, and I'll help you with your ${project.type} project.`,
      timestamp: new Date()
    }]);
    
    initialized.current = true;
  }, [agent?.id, project.type]);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isProcessing || !agent) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await sendMessage(content);
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'I encountered an error while processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  }, [isProcessing, sendMessage, agent]);

  return {
    messages,
    input,
    setInput,
    handleSendMessage,
    isProcessing,
    error,
    lastFiles,
    clearMessages: useCallback(() => setMessages([]), [])
  };
}