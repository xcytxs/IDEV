import React, { useState, useEffect, useRef } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Agent {
  id: string;
  name: string;
  type: string;
  provider: string;
  model: string;
  status: 'active' | 'inactive';
}

interface LLMProvider {
  name: string;
  endpoint: string;
}

const Chat: React.FC = () => {
  const [agents] = useLocalStorage<Agent[]>('agents', []);
  const [providers] = useLocalStorage<LLMProvider[]>('llmProviders', []);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAgentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const agent = agents.find(a => a.id === e.target.value);
    setSelectedAgent(agent || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !file) return;
    if (!selectedAgent) {
      setError("Please select an agent first.");
      return;
    }

    const newMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    if (file) {
      console.log('File to upload:', file);
      setFile(null);
    }

    try {
      const provider = providers.find(p => p.name === selectedAgent.provider);
      if (!provider) {
        throw new Error("Provider not found");
      }

      console.log(`Sending request to: ${provider.endpoint}/api/generate`);
      const response = await fetch(`${provider.endpoint}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedAgent.model,
          prompt: input,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log('Server response:', data);

      if (!data.response) {
        console.error('Invalid response format:', data);
        throw new Error("Invalid response format from the server");
      }

      const aiResponse: Message = { role: 'assistant', content: data.response };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error communicating with AI:', error);
      setError(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}. Please check the server connection and try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="p-6 h-screen flex flex-col">
      <h1 className="text-3xl font-semibold mb-4">Chat with AI Agent</h1>
      <div className="mb-4">
        <select
          value={selectedAgent?.id || ''}
          onChange={handleAgentChange}
          className="p-2 border rounded"
        >
          <option value="">Select an Agent</option>
          {agents.map(agent => (
            <option key={agent.id} value={agent.id}>{agent.name}</option>
          ))}
        </select>
      </div>
      {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}
      <div className="flex-grow overflow-y-auto mb-4 border rounded p-4">
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              {message.content}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-grow p-2 border rounded-l"
          disabled={isLoading}
        />
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
          disabled={isLoading}
        />
        <label htmlFor="file-upload" className="p-2 bg-gray-200 cursor-pointer">
          📎
        </label>
        <button type="submit" className="p-2 bg-blue-500 text-white rounded-r" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
      {file && <p className="mt-2">File selected: {file.name}</p>}
    </div>
  );
};

export default Chat;