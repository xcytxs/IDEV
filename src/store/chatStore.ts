import { create } from 'zustand';
import { Message } from '../types/chat';

interface ChatState {
  messages: Message[];
  input: string;
  isProcessing: boolean;
  error: string | null;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setInput: (input: string) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setError: (error: string | null) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  input: '',
  isProcessing: false,
  error: null,
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  setInput: (input) => set({ input }),
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  setError: (error) => set({ error }),
  clearMessages: () => set({ messages: [] }),
}));