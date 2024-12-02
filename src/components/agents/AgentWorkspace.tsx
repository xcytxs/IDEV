import React, { useState } from 'react';
import { Tabs, MessageSquare, Code, Settings } from 'lucide-react';
import { Agent } from '../../types/agent';
import AgentChat from '../chat/AgentChat';
import CodeEditor from '../editor/CodeEditor';
import AgentSettings from './AgentSettings';

interface AgentWorkspaceProps {
  agent: Agent | null;
}

const AgentWorkspace: React.FC<AgentWorkspaceProps> = ({ agent }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'code' | 'settings'>('chat');

  if (!agent) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <p className="text-gray-400">Select an agent to begin working</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="border-b border-gray-700">
        <div className="flex">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-3 flex items-center ${
              activeTab === 'chat'
                ? 'bg-gray-700 text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <MessageSquare size={18} className="mr-2" />
            Chat
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-4 py-3 flex items-center ${
              activeTab === 'code'
                ? 'bg-gray-700 text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Code size={18} className="mr-2" />
            Code
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-3 flex items-center ${
              activeTab === 'settings'
                ? 'bg-gray-700 text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Settings size={18} className="mr-2" />
            Settings
          </button>
        </div>
      </div>

      <div className="h-[calc(100vh-16rem)]">
        {activeTab === 'chat' && <AgentChat agent={agent} />}
        {activeTab === 'code' && <CodeEditor agent={agent} />}
        {activeTab === 'settings' && <AgentSettings agent={agent} />}
      </div>
    </div>
  );
};

export default AgentWorkspace;